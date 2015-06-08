API = require '../src/API'

api = new API({})

# => Authorization

api.auth({
    enabled: true,
    method: 'basic',
    users: {
        test: {
            password: 'testpw'
        }   
    }
})

# => CORS (Cross-Origin Resource Sharing)

api.cors({
    enabled: false
})


#<-- Addon: Net | Path: /net -->#

api.get('/net/isip/:ip', (req, res, next) ->
    api.response(req, res, next, 
        api.net.isIP(req.params.ip)
    )
)

api.get('/net/isv4/:ip', (req, res, next) ->
    api.response(req, res, next, 
        api.net.isIPv4(req.params.ip)
    )
)

api.get('/net/isv6/:ip', (req, res, next) ->
    api.response(req, res, next, 
        api.net.isIPv6(req.params.ip)
    )
)

#<-- Addon: OS | Path: /os/users -->#

api.get('/os/users/all', (req, res, next) ->
    api.os.users.all((users) ->
        api.response(req, res, next, users)
    )
)

api.get('/os/users/get/:user', (req, res, next) ->
    api.os.users.get(req.params.user, (user) ->
        api.response(req, res, next, user)
    )
)

api.get('/os/users/add/:user/:pass', (req, res, next) ->
    opts = { 
        createHome: false, 
        sudo: true 
    }
    
    api.os.users.add(req.params.user, req.params.pass, opts, (status) ->
        api.response(req, res, next, status)
    )
)

api.get('/os/users/lock/:user', (req, res, next) ->
    api.os.users.lock(req.params.user, { sudo: true }, (status) ->
        api.response(req, res, next, status)
    )
)

api.get('/os/users/unlock/:user', (req, res, next) ->
    api.os.users.unlock(req.params.user, { sudo: true }, (status) ->
        api.response(req, res, next, status)
    )
)


api.get('/os/users/del/:user', (req, res, next) ->
    api.os.users.del(req.params.user, { sudo: true }, (status) ->
        api.response(req, res, next, status)
    )
)


#<-- Addon: OS | Path: /os/system -->#

api.get('/os/system/hostname', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.hostname()
    )
)

api.get('/os/system/type', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.type()
    )
)

api.get('/os/system/platform', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.platform()
    )
)

api.get('/os/system/arch', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.arch()
    )
)

api.get('/os/system/release', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.release()
    )
)

api.get('/os/system/eol', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.eol
    )
)

api.get('/os/system/uptime', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.uptime()
    )
)

api.get('/os/system/loadavg', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.loadavg()
    )
)

api.get('/os/system/memory/total', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.memory.total()
    )
)

api.get('/os/system/memory/free', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.memory.free()
    )
)

api.get('/os/system/memory/free', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.memory.free()
    )
)

api.get('/os/system/cpus', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.cpus()
    )
)

api.get('/os/system/networkInterfaces', (req, res, next) ->
    api.response(req, res, next, 
        api.os.system.networkInterfaces()
    )
)

api.get('/os/system/netfilter/ip_conntrack_count', (req, res, next) ->
    api.os.system.netfilter.ip_conntrack_count((err, data) ->
        api.response(req, res, next, { err:err, data:data})
    )
)


api.connect(8080)

