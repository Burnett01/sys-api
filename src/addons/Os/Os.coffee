os      = require 'os'
passwd  = require './assets/passwd'
Fs = require '../Fs/Fs'

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
                
            netfilter:
                ip_conntrack_count: (cb) ->
                    Fs.fs.readFile("/proc/sys/net/ipv4/netfilter/ip_conntrack_count", (err, data) ->
                        cb(err, data)
                    )
        users:
            all: (cb) ->
                passwd.getAll((users) ->
                   cb(users)
                )
                
            get: (username, cb) ->
                passwd.get(username, (user) ->
                   cb(user)
                )
                
            add: (username, pass, opts, cb) ->
                passwd.add(username, pass, opts, (status) ->
                   cb(status)
                )
           
            lock: (username, opts, cb) ->
                passwd.lock(username, opts, (status) ->
                   cb(status)
                )
            
            unlock: (username, opts, cb) ->
                passwd.unlock(username, opts, (status) ->
                   cb(status)
                )
                
            del: (username, opts, cb) ->
                passwd.del(username, opts, (status) ->
                   cb(status)
                )
                

module.exports = Addon
