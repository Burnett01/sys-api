os      = require 'os'
pwdg    = require './assets/passwd-groups'
Fs      = require '../Fs/Fs'

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
                pwdg.getAllUsers((users) ->
                   cb(users)
                )
                
            get: (username, cb) ->
                pwdg.getUser(username, (user) ->
                   cb(user)
                )
                
            add: (username, pass, opts, cb) ->
                pwdg.addUser(username, pass, opts, (status) ->
                   cb(status)
                )
           
            lock: (username, opts, cb) ->
                pwdg.lockUser(username, opts, (status) ->
                   cb(status)
                )
            
            unlock: (username, opts, cb) ->
                pwdg.unlockUser(username, opts, (status) ->
                   cb(status)
                )
                
            del: (username, opts, cb) ->
                pwdg.delUser(username, opts, (status) ->
                   cb(status)
                )
                
        groups:
            all: (cb) ->
                pwdg.getAllGroups((groups) ->
                   cb(groups)
                )
                
            get: (name, cb) ->
                pwdg.getGroup(name, (group) ->
                   cb(group)
                )
                
            add: (name, opts, cb) ->
                pwdg.addGroup(name, opts, (status) ->
                   cb(status)
                )
                
            del: (name, opts, cb) ->
                pwdg.delGroup(name, opts, (status) ->
                   cb(status)
                )
                

module.exports = Addon
