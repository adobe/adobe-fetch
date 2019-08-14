[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# adobeio-fetch

Call Adobe APIs

## Goals

Make calling Adobe APIs a breeze!  

This package will handle JWT authentication, token caching and storage.  
Otherwise it works exactly as [fetch](https://github.com/bitinn/node-fetch)

### Installation

```
npm install --save @adobe/PENDING
```

### Common Usage

```javascript

    const fs = require('fs');
    
    const config = { 
      auth: {
          clientId: 'asasdfasf',
          clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
          technicalAccountId: 'asdfasdfas@techacct.adobe.com',
          orgId: 'asdfasdfasdf@AdobeOrg',
          metaScopes: ['ent_dataservices_sdk']
      }
    };
    
    config.auth.privateKey = fs.readFileSync('private.key');

    const adobefetch = require('@adobe/PENDING').config(config);

    adobefetch("https://platform.adobe.io/some/adobe/api", { method: 'get'})
      .then(response => response.json())
      .then(json => console.log('Result: ',json));

```

#### Config object

The config object is where you pass in all the required and optional parameters to authenticate API calls.

| parameter          | integration name     | required | type                              | default                        |
| ------------------ | -------------------- | -------- | --------------------------------- | ------------------------------ |
| clientId           | API Key (Client ID)  | true     | String                            |                                |
| technicalAccountId | Technical account ID | true     | String                            |                                |
| orgId              | Organization ID      | true     | String                            |                                |
| clientSecret       | Client secret        | true     | String                            |                                |
| privateKey         |                      | true     | String                            |                                |
| passphrase         |                      | false    | String                            |                                |
| metaScopes         |                      | true     | Comma separated Sting or an Array |                                |
| ims                |                      | false    | String                            | https://ims-na1.adobelogin.com |

In order to determine which **metaScopes** you need to register for you can look them up by product in this [handy table](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md).

For instance if you need to be authenticated to call API's for both GDPR and User Management you would [look them up](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md) and find that they are:

- GDPR: https://ims-na1.adobelogin.com/s/ent_gdpr_sdk
- User Management: https://ims-na1.adobelogin.com/s/ent_user_sdk

They you would create an array of **metaScopes** as part of the config object. For instance:

```javascript
const config = {
  auth: {
      clientId: 'asasdfasf',
      clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
      technicalAccountId: 'asdfasdfas@techacct.adobe.com',
      orgId: 'asdfasdfasdf@AdobeOrg',
      metaScopes: [
        'https://ims-na1.adobelogin.com/s/ent_gdpr_sdk',
        'https://ims-na1.adobelogin.com/s/ent_user_sdk'
      ]
  }
};
```

However, if you omit the IMS url the package will automatically add it for you when making the call to generate the JWT. For example:

```javascript
const config = {
  auth: {
      clientId: 'asasdfasf',
      clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
      technicalAccountId: 'asdfasdfas@techacct.adobe.com',
      orgId: 'asdfasdfasdf@AdobeOrg',
      metaScopes: ['ent_gdpr_sdk', 'ent_user_sdk']
  }
};
```

This is the recommended approach.

### Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.MD) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
