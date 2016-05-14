# sys-api
A modular System-API for NodeJS - RestifyJS.

It is written in Coffeescript, but compiled .js files are included.
Thus you can use it with or without coffeescript.

####Features:
+ Authorization (with bcrypt-handler)
+ CORS
+ HTTP/S
+ BodyParser
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
This API supports HTTP and HTTPS at the same time.

You don't have to set up things twice. Simply pass a key and certificate property,
and the API will handle that for you. Once configured, your API-instance will listen to your specified HTTP port and the HTTPS port (443).

```coffeescript
api = new API({
    restify: {
        key: readFileSync('localhost.key'),
        certificate: readFileSync('localhost.cert')
    }
})
api.connect(80)
```

> If no key/certificate property is available, your API-instance won't listen to HTTPS.

---

### BodyParser
The BodyParser can be enabled with one option.
Everything else is handled internally for you.
Once enabled, you can access the body with obj.req.body in your routes.

Check: https://github.com/Cloud2Box/sys-api/blob/master/examples/test.coffee#L53

```coffeescript
api.bodyParser({
    enabled: true
})
```

If you want to change more settings of the BodyParser, simply pass an settings-object:

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

### Plugins
As of version 0.2.0 you can create your own plugins apart from Core-Addons.
This allows you to extend your API without changing Sys-API's source.

Plugins can also act like middlware:
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
They can also act like middleware.

Check out the wiki for instructions: https://github.com/Cloud2Box/sys-api/wiki/Create-an-Addon-(core)

> Once you've finished your addon, please submit a pull-request. If it's useful, it'll be added.



####Demos / Examples:
https://github.com/Cloud2Box/sys-api/blob/master/examples/test.coffee
https://github.com/Cloud2Box/sys-api/blob/master/examples/test.js

##How to install:
Just use `npm install sys-api` and copy the content of the demo-file. 
