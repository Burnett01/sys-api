sys     = require 'sys'
passwd  = require './passwd'

Sys =
    sys:
        users:
            add: () ->
            del: (user) ->
            get: (user) ->
                
            all: () ->
                passwd.getAll()

module.exports = Sys
