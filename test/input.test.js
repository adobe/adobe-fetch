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

let {
  clientId,
  technicalAccountId,
  orgId,
  clientSecret,
  privateKey,
  metaScopes
} = require('./mockData').config;

describe('Validate input', () => {
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
