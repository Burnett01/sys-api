##################################
#   SYS-API (c) 2015 - Burnett
##################################

restify = require 'restify'
passwd = require './passwd'

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
      
      
    users:
        getAll: () ->
            passwd.getAll (users) ->
                for d, i in users
                    console.log d, i


    pre: () ->
        #console.log('Invoked PRE-SCRIPTS')
        #return

module.exports = SysAPI
