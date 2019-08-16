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
const auth = require('@adobe/jwt-auth');
const merge = require('deepmerge');
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

function addAuthHeaders(token, options, authOptions) {
  return merge(options, {
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
      'x-api-key': authOptions.clientId,
      'x-gw-ims-org-id': authOptions.orgId
    }
  });
}

async function _fetch(url, options, configOptions, tokenCache, forceNewToken) {
  const token = await getToken(configOptions.auth, tokenCache, forceNewToken);
  const opts = addAuthHeaders(token, options, configOptions.auth);
  const res = await fetch(url, opts);

  if ((res.status === 401 || res.status === 403) && !forceNewToken) {
    return await _fetch(url, options, configOptions, tokenCache, true);
  } else {
    return res;
  }
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

  return (url, options = {}) =>
    adobefetch(url, options, configOptions, tokenCache);
}

module.exports = { config: config };
