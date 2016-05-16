###############################################
#             SYS-API
#  @Description: A modular System-API
#  @Author: (c) Cloud2Box IT-Dienstleistungen
#  @Website: www.cloud2box.net
###############################################

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
        
        @options.restify = {}
        
        if(typeof @options['restify'] != undefined)
            @options.restify = @options.restify
        
        # Clone the options.restify property and remove ssl settings
        @options._restify = Object.assign({}, @options.restify)
        delete @options._restify.key
        delete @options._restify.certificate
        
        # Define an array for the RESTIFY.createServer instances
        @instances = []
        
        # Create a server with the cloned-object (without ssl settings)
        @instances.push(new RESTIFY.createServer(@options._restify))
        
        # Check whether our original options.restify object contains ssl settings
        if('key' of @options.restify and 'certificate' of @options.restify)
            instance = new RESTIFY.createServer(@options.restify)
            instance.server.ssl = true
            @instances.push(instance)
            
        # Define a wrapper function, which runs any restify-method-function on all instances
        @server = (type, args...) =>
            for instance in @instances
                instance[type].apply(instance, args)
        
        # Check whether logger should be used
        if('logger' of @options)        
            @server('use', MORGAN(@options['logger']))        
             
        # Check whether plugins should be loaded
        if('plugins.root' of @options)
            if('plugins.autoload' of @options && @options['plugins.autoload'] == true)
                API.plugins().setup(@options['plugins.root'])


    connect: (port) ->
        for instance in @instances
            ((port) ->
                port = if instance.server.ssl then 443 else port
                instance.listen port, () ->
                    console.log('API listening on port %d', port)
            )(port)

    
    ########  API PLUGINS  ########
    
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
    
    head: (path, cb) ->
      @server("head", path, (req, res, next) -> 
        _request(cb, req, res, next)
      )
  
    get: (path, cb...) ->
      @server("get", path, (req, res, next) -> 
        _request(cb, req, res, next)
      )
      
    post: (path, cb) ->
      @server("post", path, (req, res, next) -> 
        _request(cb, req, res, next)
      )

        
    ########  Export the instances  ########
    instances: @instances
    
    
module.exports = API
