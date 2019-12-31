###
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2020 Steven Agyekum <agyekum@posteo.de>

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

os      = require 'os'
pwdg    = require 'passwd-groups'
Fs      = require '../Fs'

module.exports = {
    os:
        os: os
    
        system:
            hostname: () ->
                os.hostname()
                
            type: () ->
                os.type()
                
            platform: () ->
                os.platform()
                
            arch: () ->
                os.arch()
                
            release: () ->
                os.release()
                
            eol: os.EOL
                
            uptime: () ->
                os.uptime()
                
            loadavg: () ->
                os.loadavg()
                
            memory:
                total: () ->
                    os.totalmem()
                
                free: () ->
                    os.freemem()
                    
            cpus: () ->
                os.cpus()
                
            networkInterfaces: () ->
                os.networkInterfaces()

        users:
            all: (cb) ->
                pwdg.getAllUsers((err, users) ->
                   cb(err, users)
                )
                
            get: (username, cb) ->
                pwdg.getUser(username, (err, user) ->
                   cb(err, user)
                )
                
            add: (username, pass, opts, cb) ->
                pwdg.addUser(username, pass, opts, (err, status) ->
                   cb(err, status)
                )
           
            lock: (username, opts, cb) ->
                pwdg.lockUser(username, opts, (err, status) ->
                   cb(err, status)
                )
            
            unlock: (username, opts, cb) ->
                pwdg.unlockUser(username, opts, (err, status) ->
                   cb(err, status)
                )
                
            del: (username, opts, cb) ->
                pwdg.delUser(username, opts, (err, status) ->
                   cb(err, status)
                )
                
        groups:
            all: (cb) ->
                pwdg.getAllGroups((err, groups) ->
                   cb(err, groups)
                )
                
            get: (name, cb) ->
                pwdg.getGroup(name, (err, group) ->
                   cb(err, group)
                )
                
            add: (name, opts, cb) ->
                pwdg.addGroup(name, opts, (err, status) ->
                   cb(err, status)
                )
                
            del: (name, opts, cb) ->
                pwdg.delGroup(name, opts, (err, status) ->
                   cb(err, status)
                )
                
}