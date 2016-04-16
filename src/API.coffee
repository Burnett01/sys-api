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
    
    error: restify.errors
    

    # Restify Methods
    
    head: (path, handlers...) ->
      @server.head(path, handlers)
        
    get: (path, handlers...) ->
      @server.get(path, handlers)
      
    post: (path, handlers...) ->
      @server.post(path, handlers)
     

    # Custom Methods

    response: (req, res, next, x) ->
        res.send({ data: x });
        return next();
        

module.exports = API
