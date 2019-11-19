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

const adobefetch = require('../index');
const adobefetchBrowser = require('../index.client');
const mockData = require('./mockData');

const { AUTH_MODES } = adobefetch;

const {
  clientId,
  technicalAccountId,
  orgId,
  clientSecret,
  privateKey,
  metaScopes
} = mockData.config;
const { tokenProvider } = mockData.providedConfig;

describe('Validate JWT config', () => {
  test('all parameters missing', () => {
    expect.assertions(1);
    return expect(() => adobefetch.config({})).toThrow(
      'Auth configuration missing.'
    );
  });
  test('missing clientId', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: {
          clientSecret,
          technicalAccountId,
          orgId,
          metaScopes,
          privateKey
        }
      })
    ).toThrow('Required parameter(s) clientId are missing');
  });
  test('missing clientSecret', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: { clientId, technicalAccountId, orgId, metaScopes, privateKey }
      })
    ).toThrow('Required parameter(s) clientSecret are missing');
  });
  test('missing technicalAccountId', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: { clientId, clientSecret, orgId, metaScopes, privateKey }
      })
    ).toThrow('Required parameter(s) technicalAccountId are missing');
  });
  test('missing orgId', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: {
          clientId,
          clientSecret,
          technicalAccountId,
          metaScopes,
          privateKey
        }
      })
    ).toThrow('Required parameter(s) orgId are missing');
  });
  test('missing metaScopes', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: { clientId, clientSecret, technicalAccountId, orgId, privateKey }
      })
    ).toThrow('Required parameter(s) metaScopes are missing');
  });
  test('missing privateKey', () => {
    expect.assertions(1);
    return expect(() =>
      adobefetch.config({
        auth: { clientId, clientSecret, technicalAccountId, orgId, metaScopes }
      })
    ).toThrow('Required parameter(s) privateKey are missing');
  });

  test('privateKey is of wrong type', () => {
    expect.assertions(1);
    const privateKey = new Object();
    return expect(() =>
      adobefetch.config({
        auth: {
          clientId,
          clientSecret,
          technicalAccountId,
          orgId,
          metaScopes,
          privateKey
        }
      })
    ).toThrow('Required parameter privateKey is invalid');
  });
});

describe('Validate Provided config', () => {
  test('all parameters missing', () => {
    return expect(() =>
      adobefetch.config({ mode: AUTH_MODES.Provided })
    ).toThrow('Auth configuration missing.');
  });
  test('missing clientId', () => {
    return expect(() =>
      adobefetch.config({
        auth: {
          mode: AUTH_MODES.Provided,
          orgId,
          tokenProvider
        }
      })
    ).toThrow('Required parameter(s) clientId are missing');
  });
  test('missing orgId', () => {
    return expect(() =>
      adobefetch.config({
        auth: {
          mode: AUTH_MODES.Provided,
          clientId,
          tokenProvider
        }
      })
    ).toThrow('Required parameter(s) orgId are missing');
  });
  test('missing tokenProvider', () => {
    return expect(() =>
      adobefetch.config({
        auth: {
          mode: AUTH_MODES.Provided,
          orgId,
          clientId
        }
      })
    ).toThrow('Required parameter(s) tokenProvider are missing');
  });

  test('tokenProvider should be a function', () => {
    return expect(() =>
      adobefetch.config({
        auth: {
          mode: AUTH_MODES.Provided,
          orgId,
          clientId,
          tokenProvider: 'NOT A FUNCTION'
        }
      })
    ).toThrow('Required parameter tokenProvider needs to be a function');
  });
});

describe('Validate No JWT config', () => {
  test('JWT mode not supported', () => {
    return expect(() =>
      adobefetchBrowser.config({
        auth: {
          mode: AUTH_MODES.JWT,
          clientSecret,
          technicalAccountId,
          orgId,
          metaScopes,
          privateKey
        }
      })
    ).toThrow('JWT authentication is not available in current setup.');
  });
});

describe('Other config tests', () => {
  test('Other modes not supported', () => {
    return expect(() =>
      adobefetch.config({
        auth: {
          mode: 'testmode'
        }
      })
    ).toThrow('Invalid authentication mode - testmode');
  });

  test('JWT mode is default', () => {
    let config = {
      clientId,
      technicalAccountId,
      orgId,
      clientSecret,
      privateKey,
      metaScopes
    };
    adobefetch.config({
      auth: config
    });
    expect(config.mode).toBe(AUTH_MODES.JWT);
  });

  test('Provided mode is default in nojwt', () => {
    let config = {
      clientId,
      orgId,
      tokenProvider
    };
    adobefetchBrowser.config({
      auth: config
    });
    expect(config.mode).toBe(AUTH_MODES.Provided);
  });
});
