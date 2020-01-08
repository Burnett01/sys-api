List of notable changes:
---

## 08.01.2020

+ Sys-API now supports validation out of the box.

The validator is based on ``restify-validation-engine`` and
instead of including ``restify-validation-engine`` as a dependency, <br />
I copied the code and updated it to support new features:

Simply enable the validator by using:

```
api.validator({
    enabled: true
})
```

To use custom validators simply issue:

```
api.validator({
    enabled: true,
    customValidators : {
        ......
    }
})
```

After enabling it, you can use the ``validate:`` property in your routes:

```
api.get({
    url: '/test',
    validate: { 
        params: { 
            name: {
                required: true
            }
        }
    }}, r => r.send('Passed validation))
```

You can find the validation documentation [at this repository](https://github.com/paulvarache/restify-validation-engine)


These are my additional features that the validator-engine supports:

```
+ The validate property now allows an array of scope objects so
that you can fully utilize ES6 spread features:

const validators = {
    name: {
        required: true 
    },
    other: {
        .....
    }
}

api.get({
    url: '/test',
    validate: [ 
        { body: { ...validators }},
        { params: { ...... } }
    ]}, r => {
        r.next
        r.send
        r.req
        r.res
    })

+ The req object is now forwarded to custom validators.
This allows you to use custom validation functions as middleware.

const myValidator = (name, req) => {
    // do something with req
    // ....
    // check for valid name
    return (name == 'cool')
}

api.validator({
    enabled: true,
    customValidators: {
        myValidator
    }
})

api.get({
    url: '/test',
    validate: { 
        params: { 
            name: {
                required: true,
                myValidator: 'Invalid name'
            }
        }
    }}, r => r.send('Passed validation))
```

+ We merged the ``.settings:`` key for bundled plugin configs to the top-level:

In previous versions you would configure a bundled plugin like:

```
api.bodyParser({
    enabled: true,
    settings: {
        .....
    }
})
```

This is no longer needed. Simply pass the configuration directly:

```
api.bodyParser({
    enabled: true,
    .....
})
```

To keep backward-compatibility, your api can continue using the ``.settings:`` key
but we recommend updating your code.


## 06.01.2020

+ You may now use more Restify Bundled Plugins.

New:

```
Audit Logger - api.auditLogger()
Request Logger - api.requestLogger()
Sanitize Path - api.sanitizePath()
Serve Static - api.serveStatic()
Full Response - api.fullResponse()
JSON Body Parser - api.jsonBodyParser()
Multipart Body Parser - api.multipartBodyParser()
URL Encoded Body Parser - api.urlEncodedBodyParser()
```

[Check all bundled plugins here](https://github.com/Burnett01/sys-api#additional-restify-plugins)

## 04.05.2019

+ Dropped support for Node ``4`` and Node ``5``

## 17.04.2017

+ The ``connect()`` method was renamed to ``listen()``.
+ Added ``anon`` property to allow anonymous access

To keep compatibility you can still use the old name.

## 14.01.2017

+ Moved passwd-groups plugin to package.json (dependencies). It is no longer included but available in this project.


## 20.09.2016

+ (Fixed) In previous versions, the third argument (notls) of the internal server() wrapper did not register bundled-plugins. This is fixed now.

## 30.07.2016

+ Added all restify bundled plugins
(acceptParser, dateParser, queryParser,  jsonp, gzipResponse, throttle, conditionalRequest)
+ Added pre() and use() methods which can be used by your api instance
+ The internal @server() wrapper takes a third argument (boolean) to skip use of a fn on a TLS instance. For example: If the gzipResponse plugin is used, it will not work on the TLS instance since GZIP in combination with TLS is prone to the BEAST attack. This API automatically protects you by skipping GZIP when used for TLS

## 27.07.2016

+ Ability to use custom HTTPS port (https://github.com/Burnett01/sys-api/wiki/HTTP-&-HTTPS-(TLS))

---

[more]

https://github.com/Burnett01/sys-api/commits/master