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
const fetch = require('node-fetch');
const adobefetch = require('../index');
const adobefetchBrowser = require('../index.client');
const mockData = require('./mockData');

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: key => delete store[key],
    clear: () => (store = {})
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

jest.mock('@adobe/jwt-auth');
jest.mock('node-fetch');

describe('Validate custom storage', () => {
  test('need a read method', () => {
    expect.assertions(1);
    const authConfig = Object.assign(
      {
        storage: {
          write: async () => {}
        }
      },
      mockData.config
    );

    return expect(() =>
      adobefetch.config({
        auth: authConfig
      })
    ).toThrow('Storage read method missing');
  });

  test('need a write method', () => {
    expect.assertions(1);
    const authConfig = Object.assign(
      {
        storage: {
          read: async () => {}
        }
      },
      mockData.config
    );

    return expect(() =>
      adobefetch.config({
        auth: authConfig
      })
    ).toThrow('Storage write method missing');
  });

  test('reads custom async', async () => {
    expect.assertions(2);
    const authConfig = Object.assign(
      {
        storage: {
          read: async () => {
            return mockData.valid_token;
          },
          write: async () => {}
        }
      },
      mockData.config
    );

    const token = mockData.valid_token[mockData.token_key];

    fetch.mockImplementation((url, options) => {
      expect(options.headers).toBeDefined();
      expect(options.headers['authorization']).toBe(
        `Bearer ${token.access_token}`
      );
      return Promise.resolve(mockData.responseOK);
    });
    await adobefetch.config({
      auth: authConfig
    })(mockData.url);
  });

  test('reads custom promise', async () => {
    expect.assertions(2);
    const authConfig = Object.assign(
      {
        storage: {
          read: () => {
            return Promise.resolve(mockData.valid_token);
          },
          write: async () => {}
        }
      },
      mockData.config
    );

    const token = mockData.valid_token[mockData.token_key];

    fetch.mockImplementation((url, options) => {
      expect(options.headers).toBeDefined();
      expect(options.headers['authorization']).toBe(
        `Bearer ${token.access_token}`
      );
      return Promise.resolve(mockData.responseOK);
    });
    await adobefetch.config({
      auth: authConfig
    })(mockData.url);
  });

  test('writes custom async', async () => {
    expect.assertions(1);
    let cached = {};

    auth.mockImplementation(() => Promise.resolve(mockData.token));
    fetch.mockImplementation(() => {
      return Promise.resolve(mockData.responseOK);
    });

    const authConfig = Object.assign(
      {
        storage: {
          read: async () => {
            return cached;
          },
          write: async tokens => {
            cached = tokens;
          }
        }
      },
      mockData.config
    );

    await adobefetch.config({
      auth: authConfig
    })(mockData.url);

    expect(cached).toStrictEqual({ [mockData.token_key]: mockData.token });
  });

  test('writes custom promise', async () => {
    expect.assertions(1);
    let cached = {};

    auth.mockImplementation(() => Promise.resolve(mockData.token));
    fetch.mockImplementation(() => {
      return Promise.resolve(mockData.responseOK);
    });

    const authConfig = Object.assign(
      {
        storage: {
          read: () => {
            return Promise.resolve(cached);
          },
          write: tokens => {
            cached = tokens;
            return Promise.resolve();
          }
        }
      },
      mockData.config
    );

    await adobefetch.config({
      auth: authConfig
    })(mockData.url);

    expect(cached).toStrictEqual({ [mockData.token_key]: mockData.token });
  });
});

describe('Validate local storage', () => {
  test('reads from local storage', async () => {
    expect.assertions(2);

    const token = mockData.valid_token[mockData.token_provided_key];

    fetch.mockImplementation((url, options) => {
      expect(options.headers).toBeDefined();
      expect(options.headers['authorization']).toBe(
        `Bearer ${token.access_token}`
      );
      return Promise.resolve(mockData.responseOK);
    });

    window.localStorage.clear();
    window.localStorage.setItem('tokens', JSON.stringify(mockData.valid_token));

    await adobefetchBrowser.config({
      auth: mockData.providedConfig
    })(mockData.url);
  });

  test('write to local storage', async () => {
    expect.assertions(1);

    const token = mockData.valid_token[mockData.token_provided_key];

    window.localStorage.clear();

    fetch.mockImplementation(() => Promise.resolve(mockData.responseOK));

    await adobefetchBrowser.config({
      auth: mockData.customProvidedConfig(
        () => mockData.valid_token[mockData.token_provided_key]
      )
    })(mockData.url);

    const tokens = JSON.parse(window.localStorage.getItem('tokens'));
    expect(tokens[mockData.token_provided_key]).toStrictEqual(token);
  });
});
