/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fetch = require('node-fetch');
const cache = require('./src/cache');
const uuid = require('uuid/v4');
const auth = require('@adobe/jwt-auth');
const debug = require('debug')('@adobe/fetch');
const NO_CONFIG = 'Auth configuration missing.';

async function getToken(authOptions, tokenCache, forceNewToken) {
  const key = authOptions.clientId + '|' + authOptions.metaScopes.join(',');

  let token = await tokenCache.get(key);

  if (token && !forceNewToken) {
    return token;
  } else {
    try {
      token = await auth(authOptions);
      if (token) {
        return tokenCache.set(key, token);
      } else {
        throw 'Access token empty';
      }
    } catch (err) {
      console.error('Error while getting a new access token.', err);
      throw err;
    }
  }
}

function capFirst(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function generateRequestID() {
  return uuid().replace(/-/g, '');
}

function addHeaders(token, options, predefinedHeaders) {
  let headers = {};

  for (let name in predefinedHeaders) {
    const value = predefinedHeaders[name];
    headers[name.toLowerCase()] = typeof value === 'function' ? value() : value;
  }

  if (options.headers) {
    if (typeof options.headers.entries === 'function') {
      // This is a headers object, iterate with for..of.
      for (let pair of options.headers.entries()) {
        const [name, value] = pair;
        headers[name.toLowerCase()] = value;
      }
    } else {
      // This is a normal JSON. Iterate with for.. in
      for (let name in options.headers) {
        headers[name.toLowerCase()] = options.headers[name];
      }
    }
  }

  headers.authorization = `${capFirst(token.token_type)} ${token.access_token}`;
  options.headers = headers;
  return options;
}

async function _fetch(url, options, configOptions, tokenCache, forceNewToken) {
  const token = await getToken(configOptions.auth, tokenCache, forceNewToken);
  const opts = addHeaders(token, options, configOptions.headers);

  debug(
    `${opts.method || 'GET'} ${url} - x-request-id: ${
      opts.headers['x-request-id']
    }`
  );
  const res = await fetch(url, opts);

  if (!res.ok) {
    debug(
      `${opts.method || 'GET'} ${url} - status ${res.statusText} (${
        res.status
      }). x-request-id: ${opts.headers['x-request-id']}`
    );
    if ((res.status === 401 || res.status === 403) && !forceNewToken) {
      debug(`${opts.method || 'GET'} ${url} - Will get new token.`);
      return await _fetch(url, options, configOptions, tokenCache, true);
    }
  }
  return res;
}

/**
 * Fetch function
 *
 * @return  Promise
 * @param url
 * @param options
 */
function adobefetch(url, options, configOptions, tokenCache) {
  return _fetch(url, options, configOptions, tokenCache, false);
}

function verifyConfig(options) {
  let {
    clientId,
    technicalAccountId,
    orgId,
    clientSecret,
    privateKey,
    metaScopes,
    storage
  } = options;

  const errors = [];
  !clientId ? errors.push('clientId') : '';
  !technicalAccountId ? errors.push('technicalAccountId') : '';
  !orgId ? errors.push('orgId') : '';
  !clientSecret ? errors.push('clientSecret') : '';
  !privateKey ? errors.push('privateKey') : '';
  !metaScopes || metaScopes.length === 0 ? errors.push('metaScopes') : '';

  if (errors.length > 0) {
    throw `Required parameter(s) ${errors.join(', ')} are missing`;
  }

  if (
    !(
      typeof privateKey === 'string' ||
      privateKey instanceof Buffer ||
      ArrayBuffer.isView(privateKey)
    )
  ) {
    throw 'Required parameter privateKey is invalid';
  }

  if (storage) {
    let { read, write } = storage;
    if (!read) {
      throw 'Storage read method missing!';
    } else if (!write) {
      throw 'Storage write method missing!';
    }
  }
}

function config(configOptions) {
  if (!configOptions.auth) {
    throw NO_CONFIG;
  } else {
    verifyConfig(configOptions.auth);
  }

  const tokenCache = cache.config(configOptions.auth);
  configOptions.headers = configOptions.headers || {};
  configOptions.headers = Object.assign(
    {
      'x-api-key': configOptions.auth.clientId,
      'x-request-id': () => generateRequestID(),
      'x-gw-ims-org-id': configOptions.auth.orgId
    },
    configOptions.headers
  );

  return (url, options = {}) =>
    adobefetch(url, options, configOptions, tokenCache);
}

module.exports = { config: config };
