# sys-api

A modular System-API framework for NodeJS - on top of RestifyJS.

It is written in Coffeescript and compiled .js files are included.
You don't need Coffeescript for it to function.

[![Build Status](https://travis-ci.org/Burnett01/sys-api.svg?branch=master)](https://travis-ci.org/Burnett01/sys-api) [![npm version](https://badge.fury.io/js/sys-api.svg)](https://badge.fury.io/js/sys-api)

---

#### Features:

+ Authorization (optional bcrypt, anonymous)
+ CORS (Cross-Origin Resource Sharing)
+ HTTP/S (TLS)
+ Body Parser
+ Accept Parser
+ Date Parser
+ Query Parser
+ Jsonp
+ Gzip Response / Compression
+ Request Expiry
+ Throttle
+ Conditional Request
+ Extensive Routing
+ Logging (morgan/custom)
+ Plugins (extend your api)
+ Addons (extend sys-api' core)

---

# Table of contents
* [Routing](#routing)
* [Authorization](#authorization)
    * [Basic example](#basic-example)
    * [Bcrypt example](#bcrypt-example)
    * [Anonymous access](#anonymous-access)
* [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
* [HTTP/S - TLS](#https---tls)
* [BodyParser](#bodyparser)
* [Additional Restify plugins](#additional-restify-plugins)
* [Plugins](#plugins)
* [Core-Addons](#core-addons)
* [Demos / Examples](#demos-examples)
* [How to install](#how-to-install)
  * [Support](#support)
* [Unit-Tests](#unit-tests)
  * [Make](#make)
  * [NPM](#npm)
* [Contributing](#contributing)
* [License](#license)

---

### Routing

You can use a route in many different ways!

For example, this is how simple it can be:

```coffeescript
api.get('/hello', "Hello World")
#=> {"response":"Hello World"}
```

```coffeescript
api.get('/hello', (router) ->
    router.send("Hello World")
)
#=> {"response":"Hello World"}
```

```coffeescript
api.get('/hello', (router) ->
    router.res.send("Hello World")
    return router.next()
)
#=> "Hello World"
```

You can also use an object:

```coffeescript
api.get({ url: '/hello' }, "Hello World")
#=> {"response":"Hello World"}
```

Check the wiki for more: [Go to Wiki](https://github.com/Burnett01/sys-api/wiki/Routing)

---

### Authorization

Such as Restify, currently only HTTP Basic Auth and HTTP Signature are supported.

In addition, we allow bcyrpt encrypted passwords to be used in Basic Auth HTTP header,
and anonymous access.

#### Basic example:

```coffeescript
api.auth({
    enabled: true,
    method: 'basic',    
    bcrypt: false,
    anon: false,
    users: {
        testuser: {
            password: 'testpw'
        }   
    }
})
```

#### Bcrypt example:

> if bcrypt is enabled, pass the hash with the Basic Auth header.


```coffeescript
api.auth({
    enabled: true,
    method: 'basic',
    bcrypt: true,
    anon: false,
    users: {
        testuser: {
            # Whenever bcrypt is enabled, we must use the hash instead of the plain password.
            #
            # For example:
            #   Let's say the plain password "testpw" becomes this bcrypt hash: 
            #   "$2a$04$GRD1gvo20Gqskwk5g9qsgO0urOWDAO[...]"
            # ---------------------------------------------------------------------
            # So we must use the hash:
            password: '$2a$04$GRD1gvo20Gqskwk5g9qsgO0ur[...]'
            # ---------------------------------------------------------------------
            # Now our application (for instance PHP) generates a new hash
            # to be used in authorization procedure.
            # As soon as the application wants to perform authorization against the API,
            # the Basic Auth header must contain the hash in its base64 representation:
            # ---------------------------------------------------------------------
            # This is how a generic authorization header looks like:
            #   username:password
            #   -> test:testpw
            #   -> base64
            #   -> dGVzdDp0ZXN0cHc=
            #   ++ So the Authorization header becomes:
            #   Authorization: Basic dGVzdDp0ZXN0cHc=
            # ---------------------------------------------------------------------
            # This is how a the authorization header with bcrypt may look like:
            #   username:hash
            #   -> test:$2a$04$jdGtS8OCXCn.e2b1DI584OAA65r0[...]
            #   -> base64
            #   -> dGVzdDokMmEkMDQkamRHdFM4T0NYQ24uZTJiMURJNTg0T0FBNjV[...]
            #   ++ So the Authorization header becomes:
            #   Authorization: Basic dGVzdDokMmEkMDQkamRHdFM4T0NYQ24uZTJiMURJNTg0T0FBNjV[...]
        }   
    }
})
```

#### Anonymous access:

You may also allow anonymous access by using the ``anon`` property.

If anonymous access is enabled, valid and anonymous users have access.

```coffeescript
api.auth({
    enabled: true,
    method: 'basic',    
    bcrypt: false,
    anon: true,
    users: {
        testuser: {
            password: 'testpw'
        }   
    }
})
```

---

### CORS (Cross-Origin Resource Sharing)

```coffeescript
api.cors({
    enabled: true,
    settings: {
        origins: ['https://foo.com', 'http://bar.com'],  # defaults to ['*']
        credentials: true,  # defaults to false
        headers: ['x-foo']  # sets expose-headers
    }
})
```

---

### HTTP/S - TLS

Sys-API supports HTTP and HTTPS simultaneously.

You don't have to define things twice. Simply pass a key and certificate property,
and the API will handle that for you. Once configured, your API-instance will listen on your specified HTTP and HTTPS port.
Port 443 is the default port for HTTPS. If you wish to use any other port, simply pass a second argument to ```listen()```.

```coffeescript
api = new API({
    restify: {
        key: readFileSync('localhost.key'),
        certificate: readFileSync('localhost.cert')
    }
})

api.listen(80) #API is going to listen on HTTP(80) and HTTPS(443)

# OR

api.listen(80, 8443) #API is going to listen on port HTTP(80) and HTTPS(8443)
```

> If no key/certificate property is available, your API-instance won't support HTTPS.

---

### BodyParser

The BodyParser can be enabled with a single option.
Everything else is handled for you.
Once enabled, you can access the body with `obj.req.body` in your routes.

Check: https://github.com/Burnett01/sys-api/blob/master/examples/example.coffee#L53

```coffeescript
api.bodyParser({
    enabled: true
})
```

If you want to change more settings, simply pass an object:

```coffeescript
api.bodyParser({
    enabled: true,
    settings: {
        maxBodySize: 0,
        mapParams: true,
        mapFiles: false,
        overrideParams: false,
        multipartHandler: function(part) {
            part.on('data', function(data) {
                # do something with the multipart data
            });
        },
        multipartFileHandler: function(part) {
            part.on('data', function(data) {
                #do something with the multipart file data
            });
        },
        keepExtensions: false,
        uploadDir: os.tmpdir(),
        multiples: true
        hash: 'sha1'
    }
})
```

---

### Additional Restify plugins

In addition to the BodyParser, the following plugins are available:

 * Accept - ``api.acceptParser()``
 * Date Parser - ``api.dateParser()``
 * Query Parser - ``api.queryParser()``
 * Jsonp - ``api.jsonp()``
 * Gzip Response / Compression - ``api.gzipResponse()``
 * Request Expiry - ``api.requestExpiry()``
 * Throttle - ``api.throttle()``
 * Conditional Request - ``api.conditionalRequest()``

Documentation: http://restify.com/#bundled-plugins

---

### Plugins

As of version 0.2.0 you can create your own plugins.
They allow you to extend your API without changing Sys-API's source.

Plugins can also act as middlware:
```coffeescript
api = new API({
    'plugins.root' : '/home/plugins'
    'plugins.autoload' : true
})

api.get('/myplugin/test', api.myplugin.test)

api.listen(8000)
```

Check out: https://github.com/Burnett01/sys-api/wiki/Create-a-plugin

Check out: https://github.com/Burnett01/sys-api/wiki/Routing

---

### Core-Addons

Core-Addons are bound to the API and core-features. Such as plugins, they can be maintained from within an external file.
As of now there are three Core-Addons available (FS, OS, NET) but you can create you own.
They can also act as middleware.

Check out the wiki for instructions:

https://github.com/Burnett01/sys-api/wiki/Create-an-Addon-(core)

> Once you've finished your addon, please submit a pull-request. If it's useful, it'll be added.

---

### Demos / Examples:

You should definately check the examples:

Coffeescript: https://github.com/Burnett01/sys-api/blob/master/examples/example.coffee

Javascript:   https://github.com/Burnett01/sys-api/blob/master/examples/example.js

---

## How to install:

Just use `npm install sys-api` and use the content of the demo-file. 

#### Support

If you experience any problems try using `npm install sys-api --no-bin-links`

---

## Unit-Tests

The testing-framework used by this module is [Mocha](https://github.com/mochajs/mocha) with the BDD / TDD assertion library [Chai](https://github.com/chaijs/chai).

Various tests are performed to make sure this module runs as smoothly as possible.

* test/test.default.js `Performs 8 tests` | [Source](../master/test/test.default.js)

Output using [Mocha](https://github.com/mochajs/mocha) `spec` reporter:   

<img src="http://i.imgur.com/vhY4OZm.png" />

Default reporter: `list`

### Make

```make test```

### NPM

```npm test```

---

## Contributing

You're very welcome and free to contribute. Thank you.

---

## License

[MIT](LICENSE)
