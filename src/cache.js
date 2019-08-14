/* eslint-disable require-atomic-updates */
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

const storage = require('./storage');

// Consider a token expired 60 seconds before its calculated expiry time.
const EXPIRY_THRESHOLD = 60 * 1000;

/**
 * Reads cache from storage.
 *
 * @returns Promise
 */
async function readCache(cache) {
  if (cache.disableStorage) {
    if (cache.tokens === undefined) {
      cache.tokens = {};
    }
  } else {
    cache.tokens = (await storage.read()) || {};
  }
}

/**
 * Save cache to storage.
 *
 * @returns Promise
 */
async function saveCache(cache) {
  if (!cache.disableStorage) {
    await storage.save(cache.tokens);
  }
}

/**
 * Stores new token in cache & storage.
 *
 * @param key
 * @param token
 * @returns Promise
 */
async function setToken(key, token, cache) {
  // Add expiry timestamp based on the server time.
  token.expires_at = Date.now() + token.expires_in - EXPIRY_THRESHOLD;

  await readCache(cache);
  cache.tokens[key] = token;
  await saveCache(cache);

  return token;
}

function _validToken(key, cache) {
  return cache.tokens !== undefined &&
    cache.tokens[key] &&
    cache.tokens[key].expires_at > Date.now()
    ? cache.tokens[key]
    : undefined;
}

/**
 * Gets a cached token if one is available and valid.
 *
 * @param key
 * @returns {undefined|*}
 */
async function getToken(key, cache) {
  let cacheRead = false;
  if (cache.tokens === undefined) {
    cache.tokens = {};
    await readCache(cache);
    cacheRead = true;
  }

  let token = _validToken(key, cache);
  if (token || cacheRead) {
    return token;
  } else {
    await readCache(cache);
    return _validToken(key, cache);
  }
}

function config(options) {
  const cache = {
    disableStorage: (options && options.disableStorage) || false,
    tokens: undefined
  };

  return {
    set: (key, token) => setToken(key, token, cache),
    get: key => getToken(key, cache)
  };
}

module.exports.config = config;
