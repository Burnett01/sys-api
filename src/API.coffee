##################################
#   SYS-API (c) 2015 - Burnett
##################################

restify = require 'restify'

AddonHelper = require './AddonHelper'

Sys = require './addons/Sys/Sys'
Net = require './addons/Net/Net'

class SysAPI extends AddonHelper

    @include Sys
    @include Net
    
    constructor: (options) ->
        @server = new restify.createServer(options);
        @pre()

    connect: (port) ->
        @server.listen port, () ->
            console.log('API listening on port %d', port);
        
    auth: (options) ->
        options = options || {enabled:false}
        
        if options.enabled == true
            @server.use(restify.authorizationParser())
            
            if options.method == 'basic' || options.hasOwnProperty('users')
                users = options.users
                
                @server.use((req, res, next) ->
                    if req.username == 'anonymous' || !users[req.username] || req.authorization.basic.password != users[req.username].password
                        next(new restify.NotAuthorizedError())
                    else
                    next()
                )
 
    head: (path, handlers...) ->
      @server.head(path, handlers)
        
    get: (path, handlers...) ->
      @server.get(path, handlers)
      
    post: (path, handlers...) ->
      @server.post(path, handlers)
     
      
    respond: (req, res, next, v) ->
        res.send({ response: v })
        next()
      
 
    pre: () ->
        return
        #console.log('Invoked PRE-SCRIPTS')
        #return


module.exports = SysAPI
