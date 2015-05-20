os      = require 'os'
passwd  = require './passwd'

Addon =
    os:
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
            all: () ->
                f = passwd.getAll()
                return if Object.keys(f).length == 0 then { err: "Couldn't load users" } else f
                
            get: (username) ->
                f = passwd.get(username)
                return if f == undefined then { err: "User was not found!" } else f
                
            add: (username, pass, opts) ->
                f = passwd.add(username, pass, opts)
                return if f.status != 0 then { err: f.stderr.toString() } else f.status
            
            lock: (username, opts) ->
                f = passwd.lock(username, opts)
                return if f.status != 0 then { err: f.stderr.toString() } else f.status
                
            unlock: (username, opts) ->
                f = passwd.unlock(username, opts)
                return if f.status != 0 then { err: f.stderr.toString() } else f.status
                
            del: (username, opts) ->
                f = passwd.del(username, opts)
                return if f.status != 0 then { err: f.stderr.toString() } else f.status
                
           

module.exports = Addon
