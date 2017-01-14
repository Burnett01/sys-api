# sys-api
A modular System-API framework for NodeJS - on top of RestifyJS.

It is written in Coffeescript and compiled .js files are included.
You don't need Coffeescript for it to function.

[![Build Status](https://travis-ci.org/Cloud2Box/sys-api.svg?branch=master)](https://travis-ci.org/Cloud2Box/sys-api)
---

####Features:
+ Authorization (optional bcrypt)
+ CORS
+ HTTP/S (TLS)
+ BodyParser
+ AcceptParser
+ DateParser
+ QueryParser
+ Jsonp
+ GzipResponse
+ Throttle
+ ConditionalRequest
+ Extensive routing
+ Logging (morgan/custom)
+ Plugins (extend your api)
+ Addons (extend sys-api' core)

---

### Routing
There are tons of routing-variations!

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

OR use an object:

```coffeescript
api.get({ url: '/hello' }, "Hello World")
#=> {"response":"Hello World"}
```

Check the wiki for more: https://github.com/Cloud2Box/sys-api/wiki/Routing

---

### Authorization
Such as Restify, currently only HTTP Basic Auth and HTTP Signature are supported.

```coffeescript
api.auth({
    enabled: true,
    method: 'basic',
    bcrypt: false,
    users: {
        testuser: {
            password: 'testpw'
        }   
    }
})
```

> if bcrypt is enabled, pass an encrypted hash with your route.

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

### HTTP/S
Sys-API supports HTTP and HTTPS simultaneously.

You don't have to set up things twice. Simply pass a key and certificate property,
and the API will handle that for you. Once configured, your API-instance will listen on your specified HTTP and HTTPS port.
Port 443 is the default port for HTTPS. If you wish to use any other port, simply pass a second argument to ```connect()```.

```coffeescript
api = new API({
    restify: {
        key: readFileSync('localhost.key'),
        certificate: readFileSync('localhost.cert')
    }
})

api.connect(80) #API is going to listen on HTTP(80) and HTTPS(443)

# OR

api.connect(80, 8443) #API is going to listen on HTTP(80) and HTTPS(8443)
```

> If no key/certificate property is available, your API-instance won't listen to HTTPS.

---

### BodyParser
The BodyParser can be enabled with a single option.
Everything else is handled for you.
Once enabled, you can access the body with `obj.req.body` in your routes.

Check: https://github.com/Cloud2Box/sys-api/blob/master/examples/test.coffee#L53

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

api.connect(8000)
```

Check out: https://github.com/Cloud2Box/sys-api/wiki/Create-a-plugin

Check out: https://github.com/Cloud2Box/sys-api/wiki/Routing

### Core-Addons
Core-Addons are bound to the API and core-features. Such as plugins, they can be maintained from within an external file.
As of now there are three Core-Addons available (FS, OS, NET) but you can create you own.
They can also act as middleware.

Check out the wiki for instructions: https://github.com/Cloud2Box/sys-api/wiki/Create-an-Addon-(core)

> Once you've finished your addon, please submit a pull-request. If it's useful, it'll be added.



####Demos / Examples:
You should definately check the examples:

Coffeescript: https://github.com/Cloud2Box/sys-api/blob/master/examples/test.coffee

Javascript:   https://github.com/Cloud2Box/sys-api/blob/master/examples/test.js

##How to install:
Just use `npm install sys-api` and use the content of the demo-file. 

####Problems?
If you experience any problems try using `npm install sys-api --no-bin-links`
