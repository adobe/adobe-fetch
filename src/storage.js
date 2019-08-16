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

const storage = require('node-persist');
const TOKENS = 'tokens';

let storagePromise = null;
let storageInitialized = false;

/**
 * Initialise storage (node-persist)
 *
 * @param options (Optional)
 * @returns Promise
 * @private
 */
async function _initStorage() {
  // Make sure init is only called once.
  if (!storagePromise) {
    storagePromise = storage.init().then(() => (storageInitialized = true));
  }
  return storagePromise;
}

/**
 * Reads token cache from storage.
 *
 * @returns Promise
 */
async function read() {
  if (!storageInitialized) {
    await _initStorage();
  }
  return await storage.getItem(TOKENS);
}

/**
 * Saves token cache to storage.
 *
 * @param tokens
 * @returns {*}
 */
async function write(tokens) {
  return await storage.setItem(TOKENS, tokens);
}

module.exports.read = read;
module.exports.write = write;
