##################################
#   SYS-API (c) 2015 - Burnett
##################################

restify = require 'restify'

class SysAPI

    constructor: (options) ->

        @server = new restify.createServer(options);

        @pre()

    connect: (port) ->
        @server.listen port, () ->
            console.log('API listening on port %d', port);
        
    get: (path, handlers...) ->
      @server.get(path, handlers)
      
    head: (path, handlers...) ->
      @server.head(path, handlers)


    pre: () ->
        #console.log('Invoked PRE-SCRIPTS')
        #return

module.exports = SysAPI
