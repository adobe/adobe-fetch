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
const adobefetch = require('../index');
const storage = require('node-persist');
const fetch = require('node-fetch');
const mockData = require('./mockData');
const { Headers } = require.requireActual('node-fetch');

jest.mock('@adobe/jwt-auth');
jest.mock('node-persist');
jest.mock('node-fetch');

function expectHeader(key, value) {
  fetch.mockImplementation((url, options) => {
    expect(options.headers).toBeDefined();
    expect(options.headers[key]).toBe(value);
    return Promise.resolve(mockData.responseOK);
  });
}

describe('Validate headers behavior', () => {
  beforeEach(() => {
    // Default node-persist init/get/set - Do nothing
    storage.init.mockImplementation(() => Promise.resolve());
    storage.getItem = jest.fn(() => Promise.resolve(undefined));
    storage.setItem = jest.fn(() => Promise.resolve());

    // Default auth - Return default token.
    auth.mockImplementation(() => Promise.resolve(mockData.token));
  });

  test('adds predefined headers', () => {
    expect.assertions(2);
    expectHeader('someheader', 'test');

    const testFetch = adobefetch.config({
      auth: mockData.config,
      headers: { someHeader: 'test' }
    });
    return testFetch(mockData.url);
  });

  test('predefined headers case insensitive', () => {
    expect.assertions(2);
    expectHeader('x-api-key', 'test');
    const testFetch = adobefetch.config({
      auth: mockData.config,
      headers: { ['X-API-KEY']: 'test' }
    });
    return testFetch(mockData.url);
  });

  test('predefined headers can be overridden', () => {
    expect.assertions(2);
    expectHeader('someheader', 'test2');

    const testFetch = adobefetch.config({
      auth: mockData.config,
      headers: { someHeader: 'test' }
    });
    return testFetch(mockData.url, { headers: { someHEADER: 'test2' } });
  });

  test('predefined headers can be overridden (Headers interface)', () => {
    expect.assertions(2);
    expectHeader('someheader', 'test2');

    const headers = new Headers();
    headers.set('someheader', 'test2');

    const testFetch = adobefetch.config({
      auth: mockData.config,
      headers: { someHeader: 'test' }
    });
    return testFetch(mockData.url, { headers: headers });
  });

  test('headers can be added (Headers interface)', () => {
    expect.assertions(2);
    expectHeader('someheader', 'test');

    const headers = new Headers();
    headers.set('someheader', 'test');

    const testFetch = adobefetch.config({
      auth: mockData.config
    });
    return testFetch(mockData.url, { headers: headers });
  });
});
