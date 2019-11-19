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

require('dotenv').config();

/*

GET sample: To use this sample, create an environment (.env) file with the following information:

APIKEY=<Client ID>
SECRET=<Client Secret>
ACCOUNT_ID=<Technical Account ID>
ORG_IG=<IMS Org>
META_SCOPES=<Comma separated scopes list>
PRIVATE_KEY=<Private key. Use \n for line delimiters>
SAMPLE_URL=<API URL>

Alternatively, change the code below to use fs.readFileSync to read the private key from a file.
 */

const AdobeFetch = require('../index.js');
const { AUTH_MODES } = AdobeFetch;

async function main() {
  const adobefetch = AdobeFetch.config({
    auth: {
      mode: AUTH_MODES.JWT,
      clientId: process.env.APIKEY,
      clientSecret: process.env.SECRET,
      technicalAccountId: process.env.ACCOUNT_ID,
      orgId: process.env.ORG_ID,
      metaScopes: process.env.META_SCOPES.split(','),
      privateKey: process.env.PRIVATE_KEY // Alternative: require('fs').readFileSync('path/to/key')
    }
  });

  try {
    const response = await adobefetch(process.env.SAMPLE_URL, {
      method: 'get'
    });
    const json = await response.json();
    console.log('Result: ', json);
  } catch (err) {
    console.log('Error while fetching:', err);
  }
}

main();
