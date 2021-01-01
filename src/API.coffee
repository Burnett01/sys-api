###
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2021 Steven Agyekum <agyekum@posteo.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###

RESTIFY = require 'restify'
BCRYPT  = require 'bcryptjs';
MORGAN  = require 'morgan'

ClassHelper = require './ClassHelper'
PluginHelper = require './PluginHelper'
Validation = require './lib/Validation-Engine'

# Core-Addons definition
Addons = [
    "./addons/Fs",
    "./addons/Os",
    "./addons/Net"
]

class API extends ClassHelper

    # Extend restify-errors
    @extend({ error: RESTIFY.errors })
    
    # Include and expose Core-Addons
    for addon, index in Addons
        @extend(require(addon))
        @include(require(addon))
    
    # Extend PluginHelper
    @extend(PluginHelper)

    constructor: (options) ->
        super()

        @options = options

        if @options['restify']?
            @options.restify = @options.restify
        else
            @options.restify = {}

        # Clone the options.restify property and remove tls settings
        @options._restify = Object.assign({}, @options.restify)
        delete @options._restify.key
        delete @options._restify.certificate
        
        # Define an array for the RESTIFY.createServer instances
        @instances = []
        
        # Create a server with our cloned object (except tls settings)
        @instances.push(new RESTIFY.createServer(@options._restify))
        
        # Check whether our original options.restify object contains tls settings
        if 'key' of @options.restify and 'certificate' of @options.restify
            instance = new RESTIFY.createServer(@options.restify)
            instance.server.tls = true
            @instances.push(instance)
            
        # Define a wrapper function which runs a method-function on any instance
        @server = (type, args..., notls) =>
            for instance in @instances
                if typeof notls == 'boolean'
                    if instance.server.tls? and notls == true
                        continue
                else if typeof notls != 'boolean' || notls == false
                    args.push(notls)
                
                instance[type].apply(instance, args)

        # Check whether logger should be used
        if 'logger' of @options        
            @server('use', MORGAN(@options['logger']))        
             
        # Check whether plugins should be loaded
        if 'plugins.root' of @options
            if 'plugins.autoload' of @options && @options['plugins.autoload'] == true
                API.plugins().setup(@options['plugins.root'])


    ########  API Methods  ########

    listen: (http, https) ->
        for instance in @instances
            ((http, https) ->
                port = 
                    if instance.server.tls
                        if https? then https else 443 
                    else http

                instance.listen port, () ->
                    console.log('API listening on port %d', port)

            )(http, https)

    # Legacy function that got replaced by listen()
    connect: (http, https) -> @listen(http, https)

    pre: (fn) ->
        @server("pre", fn)

    use: (fn) ->
        @server("use", fn)

    
    ########  Bundled API Plugins  ########
    
    # Authorization parser
    auth: (options) ->
        options = options || { enabled: false }
        
        if !options.enabled || options.method != 'basic'|| !'users' of options
            return

        @server("use", RESTIFY.authorizationParser())

        users = options.users
        anon = options.anon or false

        @server("use", (req, res, next) ->
            # Anonymous access
            if anon && req.username == 'anonymous'
                return next()
            # Invalid username
            if !users[req.username]
                return next(new API.error.NotAuthorizedError())
            # Basic Authentication
            if options.bcrypt != true
                if req.authorization.basic.password == users[req.username].password
                    return next()
                else
                    next(new API.error.NotAuthorizedError())
            # Basic Authentication + Bcrypt
            else
                #fix for php-blowfish-hashes
                _hash = req.authorization.basic.password.replace('$2y$', '$2a$')

                BCRYPT.compare(users[req.username].password, _hash, (err, valid) ->
                    if valid == true then return next()
                    else next(new API.error.NotAuthorizedError())
                )
        )
    
    # Validation Engine
    validator: (opts) ->
        opts = opts || { enabled: false }
        if !opts.enabled then return
        delete opts.enabled
        @server("use", Validation(opts))

    # Cross-Origin Resource Sharing
    cors: (opts) ->
        @useRestifyPlugin("CORS", opts)

    # Body parser
    bodyParser: (opts) ->
        @useRestifyPlugin("bodyParser", opts)

    # Accept parser
    acceptParser: (opts) ->
        @useRestifyPlugin("acceptParser", opts)

    # Date parser
    dateParser: (opts) ->
        @useRestifyPlugin("dateParser", opts)

    # Query parser
    queryParser: (opts) ->
        @useRestifyPlugin("queryParser", opts)

    # JOSN-P
    jsonp: (opts) ->
        @useRestifyPlugin("jsonp", opts)

    # Gzip response
    gzipResponse: (opts) ->
        @useRestifyPlugin("gzipResponse", opts)

    # Request expiry
    requestExpiry: (opts) ->
        @useRestifyPlugin("requestExpiry", opts)

    # Throttle
    throttle: (opts) ->
        @useRestifyPlugin("throttle", opts)
    
    # Audit logger
    auditLogger: (opts) ->
        @useRestifyPlugin("auditLogger", opts)

    # Request logger
    requestLogger: (opts) ->
        @useRestifyPlugin("requestLogger", opts)

    # Sanitize Path
    sanitizePath: (opts) ->
        @useRestifyPlugin("sanitizePath", opts)

    # Serve Static
    serveStatic: (opts) ->
        @useRestifyPlugin("serveStatic", opts)

    # Full Response
    fullResponse: (opts) ->
        @useRestifyPlugin("fullResponse", opts)

    # JSON Body Parser
    jsonBodyParser: (opts) ->
        @useRestifyPlugin("jsonBodyParser", opts)
    
    # Multipart Body Parser
    multipartBodyParser: (opts) ->
        @useRestifyPlugin("multipartBodyParser", opts)

    # Url Encoded Body Parser
    urlEncodedBodyParser: (opts) ->
        @useRestifyPlugin("urlEncodedBodyParser", opts)

    # Conditional request
    conditionalRequest: (opts) ->
        @useRestifyPlugin("conditionalRequest", opts)

    
    useRestifyPlugin: (plugin, opts) ->
        opts = opts || { enabled: false }
        if !opts.enabled then return
        delete opts.enabled
        # Legacy support for .settings
        if opts.settings
            opts = { ...opts['settings'] }
        skipTLS = plugin == "gzipResponse"
        @server("use", RESTIFY[plugin](opts), skipTLS)


    ########  API Internal Functions  ########
    
    # Response wrapper
    _response = (req, res, next, data) ->
        res.send({ response: data })
        next()
    
    # Request wrapper
    _request = (callbacks, req, res, next) ->
        if typeof callbacks[0] is 'string' or typeof callbacks[0] is 'object'
            return _response(req, res, next, callbacks[0])
        
        if callbacks.length
            for callback in callbacks
                callback.apply(null, [{ 
                    req: req
                    res: res 
                    next: (data) -> if data? then next(data) else next
                    # Todo: add next.ifError
                    send: (data) -> _response(req, res, next, data)
                }])
    
    
    ########  API HTTP-METHODS  ########
    #-> Forward HTTP-Methods to internal _request
    
    head: (path, cb...) ->
        @server("head", path, (req, res, next) -> 
            _request(cb, req, res, next)
        )
  
    get: (path, cb...) ->
        @server("get", path, (req, res, next) -> 
            _request(cb, req, res, next)
        )
      
    post: (path, cb...) ->
        @server("post", path, (req, res, next) -> 
            _request(cb, req, res, next)
        )
      
    put: (path, cb...) ->
        @server("put", path, (req, res, next) -> 
            _request(cb, req, res, next)
        )
              
    del: (path, cb...) ->
        @server("del", path, (req, res, next) -> 
            _request(cb, req, res, next)
        )
        
    ########  Export all instances  ########
    instances: @instances
    
    
module.exports = API
