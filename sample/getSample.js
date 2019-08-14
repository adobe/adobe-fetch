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

async function main() {
  const adobefetch = require('../index.js').config({
    auth: {
      clientId: process.env.APIKEY,
      clientSecret: process.env.SECRET,
      technicalAccountId: process.env.ACCOUNT_ID,
      orgId: process.env.ORG_ID,
      metaScopes: process.env.META_SCOPES.split(','),
      privateKey: process.env.PRIVATE_KEY
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
