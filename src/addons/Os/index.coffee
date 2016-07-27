os      = require 'os'
pwdg    = require './assets/passwd-groups'
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