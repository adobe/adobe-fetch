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

const cache = require('./cache');
const uuid = require('uuid/v4');
const debug = require('debug')('@adobe/fetch');
const NO_CONFIG = 'Auth configuration missing.';
const AUTH_MODES = {
  JWT: 'jwt',
  Provided: 'provided'
};

async function getToken(authOptions, tokenCache, forceNewToken, auth) {
  const key = authOptions.auth_key;
  let token = await tokenCache.get(key);

  if (token && !forceNewToken) {
    return token;
  } else {
    let authFunc = undefined;
    if (authOptions.mode === AUTH_MODES.JWT) {
      authFunc = async () => await auth(authOptions);
    } else {
      authFunc = async () => await authOptions.tokenProvider();
    }

    try {
      token = await authFunc();
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

function normalizeHeaders(headers) {
  let normalized = {};
  if (headers) {
    if (typeof headers.entries === 'function') {
      // This is a headers object, iterate with for..of.
      for (let pair of headers.entries()) {
        const [name, value] = pair;
        normalized[name.toLowerCase()] = value;
      }
    } else {
      // This is a normal JSON. Iterate with for.. in
      for (let name in headers) {
        normalized[name.toLowerCase()] = headers[name];
      }
    }
  }
  return normalized;
}

function calculateHeaders(predefinedHeaders) {
  let headers = {};
  for (let name in predefinedHeaders) {
    const value = predefinedHeaders[name];
    if (typeof value === 'function') {
      headers[name] = value();
    } else {
      headers[name] = value;
    }
  }
  return headers;
}

function getHeaders(token, options, predefinedHeaders) {
  let headers = calculateHeaders(predefinedHeaders);
  if (options && options.headers) {
    headers = Object.assign(headers, normalizeHeaders(options.headers));
  }

  headers.authorization = `${capFirst(token.token_type)} ${token.access_token}`;
  return headers;
}

async function _fetch(
  url,
  opts,
  configOptions,
  tokenCache,
  forceNewToken,
  auth
) {
  const token = await getToken(
    configOptions.auth,
    tokenCache,
    forceNewToken,
    auth
  );

  const fetchOpts = Object.assign({}, opts);
  fetchOpts.headers = getHeaders(token, opts, configOptions.headers);

  debug(
    `${fetchOpts.method || 'GET'} ${url} - x-request-id: ${
      fetchOpts.headers['x-request-id']
    }`
  );
  const res = await fetch(url, fetchOpts);

  if (!res.ok) {
    debug(
      `${fetchOpts.method || 'GET'} ${url} - status ${res.statusText} (${
        res.status
      }). x-request-id: ${fetchOpts.headers['x-request-id']}`
    );
    if ((res.status === 401 || res.status === 403) && !forceNewToken) {
      debug(`${opts.method || 'GET'} ${url} - Will get new token.`);
      return await _fetch(url, opts, configOptions, tokenCache, true, auth);
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
function adobefetch(url, options, configOptions, tokenCache, auth) {
  return _fetch(url, options, configOptions, tokenCache, false, auth);
}

function verifyAuthConfig(options, hasAuthFunction) {
  let {
    mode,
    clientId,
    technicalAccountId,
    orgId,
    clientSecret,
    privateKey,
    metaScopes,
    storage,
    tokenProvider
  } = options;

  const errors = [];
  if (mode === AUTH_MODES.JWT) {
    !clientId ? errors.push('clientId') : '';
    !technicalAccountId ? errors.push('technicalAccountId') : '';
    !orgId ? errors.push('orgId') : '';
    !clientSecret ? errors.push('clientSecret') : '';
    !privateKey ? errors.push('privateKey') : '';
    !metaScopes || metaScopes.length === 0 ? errors.push('metaScopes') : '';
    if (!hasAuthFunction) {
      throw 'JWT authentication is not available in current setup.';
    }

    if (
      privateKey &&
      !(
        typeof privateKey === 'string' ||
        privateKey instanceof Buffer ||
        ArrayBuffer.isView(privateKey)
      )
    ) {
      throw 'Required parameter privateKey is invalid';
    }
    if (!errors.length) {
      options.auth_key = `${clientId}|${metaScopes.join(',')}`;
    }
  } else if (mode === AUTH_MODES.Provided) {
    !clientId ? errors.push('clientId') : '';
    !orgId ? errors.push('orgId') : '';
    !tokenProvider ? errors.push('tokenProvider') : '';
    if (!errors.length) {
      options.auth_key = `${clientId}|org-${orgId}`;
    }
    if (tokenProvider && typeof tokenProvider !== 'function') {
      throw 'Required parameter tokenProvider needs to be a function';
    }
  } else {
    throw `Invalid authentication mode - ${options.mode}`;
  }

  if (errors.length > 0) {
    throw `Required parameter(s) ${errors.join(', ')} are missing`;
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

function prepareConfig(config, hasAuthFunction) {
  if (!config.auth) {
    throw NO_CONFIG;
  } else {
    if (!config.auth.mode) {
      config.auth.mode = hasAuthFunction ? AUTH_MODES.JWT : AUTH_MODES.Provided;
    }
    verifyAuthConfig(config.auth, hasAuthFunction);
  }

  config.headers = Object.assign(
    {
      'x-api-key': config.auth.clientId,
      'x-request-id': () => generateRequestID(),
      'x-gw-ims-org-id': config.auth.orgId
    },
    normalizeHeaders(config.headers)
  );
}

function getConfig(storage, auth = undefined) {
  return configOptions => {
    prepareConfig(configOptions, !!auth);

    const tokenCache = cache.config(configOptions.auth, storage);

    return (url, options = {}) =>
      adobefetch(url, options, configOptions, tokenCache, auth);
  };
}

module.exports = {
  getConfig: getConfig,
  normalizeHeaders: normalizeHeaders,
  generateRequestID: generateRequestID,
  AUTH_MODES: AUTH_MODES
};
