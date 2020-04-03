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
const storage = require('node-persist');
const mockData = require('./mockData');
const adobefetch = require('../index');

const TOKENS_KEY = 'tokens';

let testFetch = null;

jest.mock('node-persist');
jest.mock('node-fetch');

function expectHeaders(url, options, access_token, apikey, orgid) {
  expect(options.headers).toBeDefined();
  expect(options.headers['authorization']).toBe(`Bearer ${access_token}`);
  expect(options.headers['x-api-key']).toBe(apikey);
  expect(options.headers['x-gw-ims-org-id']).toBe(orgid);
  expect(options.headers['x-request-id']).toHaveLength(32);
  return Promise.resolve(mockData.responseOK);
}

describe('Validate provided behavior', () => {
  beforeEach(() => {
    // Default node-persist init/get/set - Do nothing
    storage.init.mockImplementation(() => Promise.resolve());
    storage.getItem = jest.fn(() => Promise.resolve(undefined));
    storage.setItem = jest.fn(() => Promise.resolve());

    // Default fetch mock - Returns status 200 and expects the auth headers.
    fetch.mockImplementation((url, options) =>
      expectHeaders(
        url,
        options,
        mockData.token.access_token,
        mockData.config.clientId,
        mockData.config.orgId
      )
    );
  });

  test('adds authentication headers', () => {
    expect.assertions(5);
    testFetch = adobefetch.config({ auth: mockData.providedConfig });
    return testFetch(mockData.url);
  });

  test('caches access token', async () => {
    let providerCalled = 0;
    expect.assertions(11);
    testFetch = adobefetch.config({
      auth: mockData.customProvidedConfig(() => {
        providerCalled++;
        return Promise.resolve(mockData.token);
      })
    });

    await testFetch(mockData.url);
    await testFetch(mockData.url);
    expect(providerCalled).toBe(1);
  });

  test('get stored token if valid', async () => {
    expect.assertions(5);
    const token = mockData.valid_token[mockData.token_provided_key];
    storage.getItem = jest.fn(() => {
      return Promise.resolve(mockData.valid_token);
    });
    fetch.mockImplementation((url, options) =>
      expectHeaders(
        url,
        options,
        token.access_token,
        mockData.config.clientId,
        mockData.config.orgId
      )
    );
    testFetch = adobefetch.config({ auth: mockData.providedConfig });
    await testFetch(mockData.url);
  });

  test('get new token when cached expires', async () => {
    expect.assertions(7);
    storage.getItem = jest.fn((key) => {
      expect(key).toBe(TOKENS_KEY);
      return Promise.resolve(mockData.expiring_token);
    });
    testFetch = adobefetch.config({ auth: mockData.providedConfig });
    await testFetch(mockData.url);
  });

  test('get new token when fetch returns 401', async () => {
    expect.assertions(5);
    fetch.mockImplementation(() =>
      Promise.resolve(mockData.responseUnauthorized)
    );

    testFetch = adobefetch.config({
      auth: mockData.customProvidedConfig(() => {
        fetch.mockImplementation((url, options) =>
          expectHeaders(
            url,
            options,
            mockData.token2.access_token,
            mockData.config.clientId,
            mockData.config.orgId
          )
        );
        return Promise.resolve(mockData.token2);
      })
    });
    await testFetch(mockData.url);
  });
});
