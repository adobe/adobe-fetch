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

const auth = require('@adobe/jwt-auth');
const uuid = require('uuid/v4');
const storage = require('node-persist');
const fetch = require('node-fetch');
const mockData = require('./mockData');
const adobefetch = require('../index');

const TOKENS_KEY = 'tokens';

let testFetch = null;

jest.mock('@adobe/jwt-auth');
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

describe('Validate auth behavior', () => {
  beforeEach(() => {
    // Default node-persist init/get/set - Do nothing
    storage.init.mockImplementation(() => Promise.resolve());
    storage.getItem = jest.fn(() => Promise.resolve(undefined));
    storage.setItem = jest.fn(() => Promise.resolve());

    // Default auth - Return default token.
    auth.mockImplementation(() => Promise.resolve(mockData.token));

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

    // New adobe fetch object.
    testFetch = adobefetch.config({ auth: mockData.config });
  });

  test('adds authentication headers', () => {
    expect.assertions(5);
    return testFetch(mockData.url);
  });

  test('caches access token', async () => {
    expect.assertions(11);
    await testFetch(mockData.url);
    let authCalled = false;
    auth.mockImplementation(() => {
      // This code should not be called since test uses a cached token.
      authCalled = true;
      return Promise.reject();
    });
    await testFetch(mockData.url);
    expect(authCalled).toBe(false);
  });

  test('get stored token if valid', async () => {
    expect.assertions(5);
    const token = mockData.valid_token[mockData.token_key];
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
    await testFetch(mockData.url);
  });

  test('get new token when cached expires', async () => {
    expect.assertions(7);
    storage.getItem = jest.fn(key => {
      expect(key).toBe(TOKENS_KEY);
      return Promise.resolve(mockData.expiring_token);
    });
    await testFetch(mockData.url);
  });

  test('get new token when fetch returns 401', async () => {
    expect.assertions(5);
    fetch.mockImplementation(() => {
      auth.mockImplementation(() => {
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
      });
      return Promise.resolve(mockData.responseUnauthorized);
    });
    await testFetch(mockData.url);
  });

  test('get new token when fetch returns 403', async () => {
    expect.assertions(5);
    fetch.mockImplementation(() => {
      auth.mockImplementation(() => {
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
      });
      return Promise.resolve(mockData.responseForbidden);
    });
    await testFetch(mockData.url);
  });

  test('returns response when fetch returns 444', async () => {
    fetch.mockImplementation(() =>
      Promise.resolve(mockData.responseUnauthorizedOther)
    );
    const res = await testFetch(mockData.url);
    expect(res).toBeDefined();
    expect(res.status).toBe(444);
    expect(res.ok).toBe(false);
  });

  test('allows x-api-key override', async () => {
    expect.assertions(5);
    fetch.mockImplementation((url, options) =>
      expectHeaders(
        url,
        options,
        mockData.token.access_token,
        'test-override',
        mockData.config.orgId
      )
    );
    await testFetch(mockData.url, {
      headers: { 'x-api-key': 'test-override' }
    });
  });

  test('allows x-request-id override', async () => {
    expect.assertions(6);
    const xrequestid = uuid().replace(/-/g, '');

    fetch.mockImplementation((url, options) => {
      expect(options.headers['x-request-id']).toBe(xrequestid);
      return expectHeaders(
        url,
        options,
        mockData.token.access_token,
        mockData.config.clientId,
        mockData.config.orgId
      );
    });
    await testFetch(mockData.url, {
      headers: { 'x-request-id': xrequestid }
    });
  });

  test('token stored in default storage', async () => {
    expect.assertions(7);
    storage.setItem = jest.fn((key, value) => {
      expect(key).toBe(TOKENS_KEY);
      expect(value).toStrictEqual({ [mockData.token_key]: mockData.token });
    });
    await testFetch(mockData.url);
  });

  test('token not stored if storage disabled', async () => {
    let setItemCalled = false;
    let getItemCalled = false;
    storage.getItem = jest.fn(() => {
      getItemCalled = true;
      return Promise.resolve({});
    });
    storage.setItem = jest.fn(() => {
      setItemCalled = true;
      return Promise.resolve();
    });
    testFetch = adobefetch.config({
      auth: Object.assign({ disableStorage: true }, mockData.config)
    });
    await testFetch(mockData.url);
    expect(setItemCalled).toBe(false);
    expect(getItemCalled).toBe(false);
  });

  test('throws error if token is empty', () => {
    expect.assertions(1);
    const ERROR = 'Access token empty';
    auth.mockImplementation(async () => undefined);
    fetch.mockImplementation(() => {
      return Promise.resolve(mockData.responseOK);
    });
    return expect(testFetch(mockData.url)).rejects.toEqual(ERROR);
  });

  test('rethrows JWT errors', () => {
    expect.assertions(1);
    const ERROR = 'Some Error';
    auth.mockImplementation(async () => {
      throw ERROR;
    });
    fetch.mockImplementation(() => Promise.resolve(mockData.responseOK));
    return expect(testFetch(mockData.url)).rejects.toEqual(ERROR);
  });
});
