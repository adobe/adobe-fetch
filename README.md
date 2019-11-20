[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) 
[![Version](https://img.shields.io/npm/v/@adobe/fetch.svg)](https://npmjs.org/package/@adobe/fetch)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/fetch.svg)](https://npmjs.org/package/@adobe/fetch)
[![Build Status](https://travis-ci.com/adobe/adobe-fetch.svg?branch=master)](https://travis-ci.com/adobe/adobe-fetch)
[![codecov](https://codecov.io/gh/adobe/adobe-fetch/branch/master/graph/badge.svg)](https://codecov.io/gh/adobe/adobe-fetch)
[![Greenkeeper badge](https://badges.greenkeeper.io/adobe/adobe-fetch.svg)](https://greenkeeper.io/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/adobe/adobe-fetch.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/adobe/adobe-fetch/context:javascript)

# adobe-fetch

Call Adobe APIs

## Goals

Make calling Adobe APIs a breeze!  

This package will handle JWT authentication, token caching and storage.  
Otherwise it works exactly as [fetch](https://github.com/bitinn/node-fetch).

This library now works in the browser as well, see information below. 

### Installation

```
npm install --save @adobe/fetch
```

### Common Usage

```javascript

    const AdobeFetch = require('@adobe/fetch');
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

    const adobefetch = AdobeFetch.config(config);

    adobefetch("https://platform.adobe.io/some/adobe/api", { method: 'get'})
      .then(response => response.json())
      .then(json => console.log('Result: ',json));

```

#### Config Auth object

The `config.auth` object is where you pass in all the required and optional parameters to authenticate API calls.

| parameter          | integration name     | required | type                              | default                        |
| ------------------ | -------------------- | -------- | --------------------------------- | ------------------------------ |
| clientId           | API Key (Client ID)  | true     | String                            |                                |
| technicalAccountId | Technical account ID | true     | String                            |                                |
| orgId              | Organization ID      | true     | String                            |                                |
| clientSecret       | Client secret        | true     | String                            |                                |
| privateKey         |                      | true     | String                            |                                |
| passphrase         |                      | false    | String                            |                                |
| metaScopes         |                      | true     | Comma separated Sting or an Array |                                |
| ims                |                      | false    | String                            | <https://ims-na1.adobelogin.com> |

In order to determine which **metaScopes** you need to register for you can look them up by product in this [handy table](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md).

For instance, if you need to be authenticated to call API's for both GDPR and User Management you would [look them up](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md) and find that they are:

- GDPR: <https://ims-na1.adobelogin.com/s/ent_gdpr_sdk>
- User Management: <https://ims-na1.adobelogin.com/s/ent_user_sdk>

Then you would create an array of **metaScopes** as part of the `config` object. For instance:

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

However, if you omit the IMS URL, the package will automatically add it for you when making the call to generate the JWT. 

For example:

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

#### Alternative authentication methods

To use this library with an alternative authentication flow such as OAuth, or execute the JWT authentication flow outside of adobe-fetch, it is possible to use the **Provided** mode and provide the access token directly to adobe-fetch via an asynchronious function:

```javascript

    const AdobeFetch = require('@adobe/fetch');
    const { AUTH_MODES } = AdobeFetch;

    const adobefetch = AdobeFetch).config({ 
      auth: {
          mode: AUTH_MODES.Provided,
          clientId: 'asasdfasf',
          orgId: 'asdfasdfasdf@AdobeOrg',
          tokenProvider: async () => { ... Logic returning a valid access token object ... }
      }
    });

    adobefetch("https://platform.adobe.io/some/adobe/api", { method: 'get'})
      .then(response => response.json())
      .then(json => console.log('Result: ',json));

```

When the **adobefetch** call above happens for the first time, it will call the tokenProvider function provided and wait for it to return the access token. Access token is then cached and persisted, if it expires or is rejected by the API, the tokenProvider function will be called again to acquire a new token.

A valid token has the following structure:
```
  {
    token_type: 'bearer',
    access_token: <<<TOKEN>>>,
    expires_in: <<<EXPIRY_IN_MILLISECONDS>>>
  }
```

#### Using in the browser

In the browser only the **Provided** mode explained above is default, JWT is not supported.  

This is because the JWT workflow requires direct access to the private key and should be done in the server for security reasons.  With Provided mode the access token can be acquired via a standard OAuth authentication flow and then used by adobe-fetch to call Adobe APIs.

Using ```require('@adobe/fetch')``` in a web app will automatically use the browser version.  
You can also include the [bundled JS](dist/client.js) file directly in a script tag.


#### Predefined Headers

If you have HTTP headers that are required for each request, you can provide them in the configuration.
They will be then added automatically to each request.

You can provide either a value or a function. 
A function can be used when you need to generate a dynamic header value on each request.

For example:

```javascript
const config = {
  auth: {
    ... Auth Configuration ...
  },
  headers: {
    'x-sandbox-name': 'prod',
    'x-request-id': () => idGenerationFunc()
  }
};
```

The following headers are added automatically.
You can override these headers using a value or function as shown above, with the exception of **authorization**: 

- authorization **(Can not be overridden)**
- x-api-key
- x-request-id
- x-gw-ims-org-id

#### Custom Storage

By default, [node-persist](https://github.com/simonlast/node-persist) is used to store all the active tokens locally.  
Tokens will be stored under **/.node-perist/storage**

It is possible to use any other storage for token persistence. This is done by providing **read** and **write** methods as follows:  

```javascript
const config = {
  auth: {
      clientId: 'asasdfasf',
      
      ...
      
      storage: {
        read: function() {
          return new Promise(function(resolve, reject) {
            let tokens;
            
            // .. Some logic to read the tokens ..
            
            resolve(tokens);
          });
        },
        write: function(tokens) {
          return new Promise(function(resolve, reject) {
            
            // .. Some logic to save the tokens ..
            
            resolve();
          });
        }
      }
  }
};
```

Alternatively, use async/await:

```javascript
const config = {
  auth: {
      clientId: 'asasdfasf',
      
      ...
      
      storage: {
        read: async function() {
          return await myGetTokensImplementation();            
        },
        write: async function(tokens) {
          await myStoreTokensImplementation(tokens);
        }
      }
  }
};
```

## Logging

Every request will include a unique request identifier sent via the **x-request-id**.   
The request identifier can be overriden by providing it through the headers:
```javascript
fetch(url, {
  headers: { 'x-request-id': myRequestID }
});
```

We use [debug](https://github.com/visionmedia/debug) to log requests. In order to see all the debug output, including the request identifiers, run your app with the **DEBUG** environment variable including the **@adobe/fetch** scope as follows:
```
DEBUG=@adobe/fetch
```

### Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
