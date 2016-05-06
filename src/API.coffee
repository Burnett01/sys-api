##################################
#   SYS-API (c) 2016- Burnett
##################################

restify = require 'restify'
bcrypt  = require 'bcryptjs';

ClassHelper = require './ClassHelper'

# Define Core-Addons
Addons = [
    "./addons/Fs",
    "./addons/Os",
    "./addons/Net"
]
    
class API extends ClassHelper
    
    # Include and expose Core-Addons
    for addon, index in Addons
        @extend(require(addon))
        @include(require(addon))

    @extend({ error: restify.errors})
    
    # Plugin-Handler
    plugins =
        registerAll: (root) ->
            console.log "Loading plugins.."
            
            API.fs.readDir(root, true, (err, files) ->
                if err then return console.log(err)
                for file, index in files
                    console.log "[LOADED] plugin-" + file
                    API.include(require(file))
            )


    constructor: (options) ->
        @options = options

        if(typeof @options['restify'] == undefined)
            @options.restify = {}
            
        @server = new restify.createServer(@options.restify);
        
        if('plugins.root' of @options)
            if('plugins.autoload' of @options && @options['plugins.autoload'] == true)
                plugins.registerAll(@options['plugins.root'])
       

    connect: (port) ->
        @server.listen port, () ->
            console.log('API listening on port %d', port);
        
    auth: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server.use(restify.authorizationParser())
            
            if options.method == 'basic' || options.hasOwnProperty('users')
                users = options.users
                
                @server.use((req, res, next) ->
                    
                    if req.username == 'anonymous' || !users[req.username]
                        next(new restify.NotAuthorizedError())

                    if options.bcrypt == true
                    
                        _hash = req.authorization.basic.password.replace('$2y$', '$2a$'); #fix for php-blowfish-hashes
    
                        bcrypt.compare(users[req.username].password, _hash, (err, valid) ->
                            
                            if valid == true then return next() else next(new restify.NotAuthorizedError())
                        )
                        
                    else
                        
                        if req.authorization.basic.password == users[req.username].password then return next() else next(new restify.NotAuthorizedError())
                )

    # Restify Plugins

    cors: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server.use(restify.CORS(options.settings))
            
    bodyParser: (options) ->
        options = options || { enabled: false }
        
        if options.enabled == true
            @server.use(restify.bodyParser(options.settings))
    
    error: (message) ->
        new restify.errors.InternalServerError()
    

    # Internal Functions
    
    _response = (req, res, next, data) ->
        res.send({ response: data })
        return next()
      
    _request = (callback, req, res, next, args) ->
        if typeof callback is 'string' or typeof callback is 'object'
            _response(req, res, next, callback)
            
        else if typeof callback is 'function'
            return callback.apply(null, [{ req:req, res:res, next:next, send: (response) -> 
                _response(req, res, next, response)
            }].concat(args));
        else
            next(new restify.errors.InternalServerError(typeof callback + " is not a valid callback-method!"))
            
    
    # More Methods
    
    head: (path, cb) ->
      @server.head(path, (req, res, next) -> 
        _request(cb, req, res, next)
      )
  
    get: (path, cb, args...) ->
      @server.get(path, (req, res, next) -> 
        _request(cb, req, res, next, args)
      )
      
    post: (path, cb) ->
      @server.post(path, (req, res, next) -> 
        _request(cb, req, res, next)
      )

        

module.exports = API
