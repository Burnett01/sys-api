##################################
#   SYS-API (c) 2015 - Burnett
##################################

restify = require 'restify'
bcrypt  = require 'bcrypt';

AddonHelper = require './AddonHelper'

Fs = require './addons/Fs/Fs'
Os  = require './addons/Os/Os'
Net = require './addons/Net/Net'

class API extends AddonHelper

    @include Fs
    @include Os
    @include Net

    constructor: (options) ->
        @server = new restify.createServer(options);

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
