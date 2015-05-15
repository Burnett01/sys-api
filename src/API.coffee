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
        
    get: (path, handlers...) ->
      @server.get(path, handlers)
      
    get_res: (path, v) ->
      @server.get(path, (req, res, next) ->
        res.send({ response: v })
        next()
      )
      
    head: (path, handlers...) ->
      @server.head(path, handlers)
      
    respond: (req, res, next, v) ->
        res.send({ response: v })
        next()
      
 
    pre: () ->
        #console.log('Invoked PRE-SCRIPTS')
        #return


module.exports = SysAPI
