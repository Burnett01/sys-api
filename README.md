# sys-api
A modular System-API for Linux - based on NodeJS and RestifyJS.

It is written in Coffeescript, but compiled .js files are included.

That means you can use it with and without coffee.

####Features:
+ Authorization (with bcrypt-handler)
+ CORS
+ BodyParser
+ Extensive routing
+ Addons (extend sys-api' core)
+ Plugins (extend your api)


### Routing
There are tons of routing-variations!

For example, this is how simple a route can be:

```coffeescript
api.get('/hello', "Hello World")
#=> {"response":"Hello World"}
```

Check the wiki for more: https://github.com/Cloud2Box/sys-api/wiki/Routing

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

if bcrypt is enabled, you will have to post an encrypted hash with your route.

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


### Core-Addons
Core-Addons are bound to the API and can be maintained from within an external file.
As of now there are three Core-Addons available (FS, OS, NET), but you can create you own.
Check out the wiki for instructions: https://github.com/Burnett01/sys-api/wiki/Create-an-Addon-(core)

Once you've finished your addon, please submit a pull-request. If it's useful, it'll be added.

### Plugins
That's right! As of version 0.2.0 you can create your own plugins apart from Core-Addons.
This allows you to extend your API without changing Sys-API's source.

Check out: https://github.com/Burnett01/sys-api/wiki/Create-a-plugin


####Demo / Example:
https://github.com/Burnett01/sys-api/blob/master/examples/test.coffee

##How to install:
Just use `npm install sys-api` and copy the demo-file in the examples folder into your main-index. 
Edit the demo-file and run the api.
