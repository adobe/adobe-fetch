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

const CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxx';
const CLIENT_SECRET = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const ACCOUNT_ID = 'xxxxxxxxxxxxxxxxxxxxxx@techacct.adobe.com';
const ORG_ID = 'xxxxxxxxxxxxxxxxxxxxxx@AdobeOrg';
const PRIVATE_KEY = 'aalsdjfajsldjfalsjkdfa ,lsjf ,aljs';
const IMS = 'https://ims-na1.adobelogin.com';
const SCOPES = ['ent_dataservices_sdk'];
const TOKEN_KEY = `${CLIENT_ID}|${SCOPES.join(',')}`;
const MOCK_URL = 'https://mock.com/mock';

module.exports = {
  responseOK: {
    url: MOCK_URL,
    status: 200,
    statusText: 'OK',
    ok: true
  },
  responseForbidden: {
    url: MOCK_URL,
    status: 403,
    statusText: 'Forbidden',
    ok: false
  },
  responseUnauthorized: {
    url: MOCK_URL,
    status: 401,
    statusText: 'Unauthorized',
    ok: false
  },
  config: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    technicalAccountId: ACCOUNT_ID,
    orgId: ORG_ID,
    metaScopes: SCOPES,
    privateKey: PRIVATE_KEY,
    ims: IMS
  },
  token_key: TOKEN_KEY,
  token: {
    token_type: 'bearer',
    access_token: 'abcdef',
    expires_in: 86399956
  },
  token2: {
    token_type: 'bearer',
    access_token: 'mhmhmhmh',
    expires_in: 86399956
  },
  valid_token: {
    [TOKEN_KEY]: {
      token_type: 'bearer',
      access_token: 'abcabc',
      expires_in: 86399956,
      expires_at: Date.now() + 100000
    }
  },
  expiring_token: {
    [TOKEN_KEY]: {
      token_type: 'bearer',
      access_token: 'xyzxyz',
      expires_in: 86399956,
      expires_at: Date.now() - 100000
    }
  },
  url: MOCK_URL
};
