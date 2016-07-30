###
The MIT License (MIT)

Product:      C2B System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2016 Cloud2Box - IT Dienstleistungen <info@cloud2box.net>
              2015-2016 Steven Agyekum <s-8@posteo.mx>

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
        
        # Create a server with the cloned-object (without tls settings)
        @instances.push(new RESTIFY.createServer(@options._restify))
        
        # Check whether our original options.restify object contains tls settings
        if 'key' of @options.restify and 'certificate' of @options.restify
            instance = new RESTIFY.createServer(@options.restify)
            instance.server.tls = true
            @instances.push(instance)
            
        # Define a wrapper function, which runs any restify-method-function on all instances
        @server = (type, args..., notls) =>
            for instance in @instances
                if instance.server.tls? and typeof notls == 'boolean' and notls == true
                    continue
                if typeof notls == 'function'
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

    connect: (http, https) ->
        for instance in @instances
            ((http, https) ->
                port = 
                    if instance.server.tls
                        if https? then https else 443 
                    else http

                instance.listen port, () ->
                    console.log('API listening on port %d', port)
            )(http, https)

    pre: (fn) ->
        @server("pre", fn)

    use: (fn) ->
        @server("use", fn)

    
    ########  Bundled API Plugins  ########
    
    auth: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.authorizationParser())
            
            if options.method == 'basic' || options.hasOwnProperty('users')
                users = options.users
                
                @server("use", (req, res, next) ->
                    if req.username == 'anonymous' || !users[req.username]
                        next(new API.error.NotAuthorizedError())

                    if options.bcrypt == true
                        #fix for php-blowfish-hashes
                        _hash = req.authorization.basic.password.replace('$2y$', '$2a$')
    
                        BCRYPT.compare(users[req.username].password, _hash, (err, valid) ->
                            if valid == true then return next() else next(new API.error.NotAuthorizedError())
                        )
                        
                    else
                        if req.authorization.basic.password == users[req.username].password
                            return next()
                        else
                            next(new API.error.NotAuthorizedError())
                )

    cors: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.CORS(options.settings))
            
    bodyParser: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.bodyParser(options.settings))

    acceptParser: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.acceptParser(options.settings))

    dateParser: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.dateParser(options.settings))

    queryParser: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.queryParser(options.settings))

    jsonp: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.jsonp(options.settings))

    gzipResponse: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.gzipResponse(options.settings), true)

    requestExpiry: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.requestExpiry(options.settings))

    throttle: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.throttle(options.settings))

    conditionalRequest: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server("use", RESTIFY.conditionalRequest(options.settings))



    ########  API Internal Functions  ########
    
    _response = (req, res, next, data) ->
        res.send({ response: data })
        next()
      
    _request = (callbacks, req, res, next) ->
        if typeof callbacks[0] is 'string' or typeof callbacks[0] is 'object'
            return _response(req, res, next, callbacks[0])

        if callbacks.length
            for callback in callbacks
                callback.apply(null, [{ req:req, res:res, next:next, send: (response) -> 
                    _response(req, res, next, response)
                }]);
    
    
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
