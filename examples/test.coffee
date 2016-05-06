API = require '../src/API'

api = new API({
    #'plugins.root' : '/plugins/'
    #'plugins.autoload' : true,
})

# Check https://github.com/Burnett01/sys-api/wiki/Create-a-plugin
# optionally pass an object to restify's createServer-function
# http://restify.com/#creating-a-server
# example:  api = new API({ restify: { name: 'MyApp' } })


# ´´´´´´´ SETUP ´´´´´´´

# => Authorization

api.auth({
    enabled: false,
    method: 'basic',
    bcrypt: true,
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

# => BodyParser

api.bodyParser({
    enabled: true
})


# ´´´´´´´ DEMO ROUTES ´´´´´´´

#<-- Desc: Health-Status | Path: /heartbeat -->#

# Simple GET-Response

api.get('/heartbeat', "dub")

# Simple POST-Response
# Access POST-values via req.body.value

api.post('/postman', (router) ->
    router.send(router.req.body)
)


# ´´´´´´´ ADDON ROUTES ´´´´´´´
# Each route correspondens to an addon
# Check the src/addon/ folder for more information

#<-- Addon: Net | Path: /net -->#

api.get('/net/isip/:ip', api.net.isIP)
api.get('/net/isv4/:ip', api.net.isIPv4)
api.get('/net/isv6/:ip', api.net.isIPv6)


#<-- Addon: FS | Path: /fs -->#

api.post('/fs/readfile', (router) ->
    api.fs.readFile(router.req.body.path, (err, content) ->
        router.next.ifError(err)
        router.send(content)
    )
)

#<-- Addon: OS | Path: /os/users -->#

api.get('/os/users/all', (router) ->
    api.os.users.all((err, users) ->
        router.next.ifError(err)
        router.send(users)
    )
)

api.get('/os/users/get/:user', (router) ->
    api.os.users.get(router.req.params.user, (err, user) ->
        router.next.ifError(err)
        router.send(user)
    )
)

api.post('/os/users/add', (router) ->
    opts = { 
        createHome: false, 
        sudo: true 
    }
    
    user = router.req.body.user
    pass = router.req.body.pass
    
    api.os.users.add(user, pass, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)

api.post('/os/users/lock', (router) ->
    opts = { 
        sudo: true 
    }
    
    user = router.req.body.user

    api.os.users.lock(user, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)

api.post('/os/users/unlock', (router) ->
    opts = { 
        sudo: true 
    }
    
    user = router.req.body.user

    api.os.users.unlock(user, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)

api.post('/os/users/del', (router) ->
    opts = { 
        sudo: true 
    }
    
    user = router.req.body.user

    api.os.users.del(user, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)


#<-- Addon: OS | Path: /os/groups -->#

api.get('/os/groups/all', (router) ->
    api.os.groups.all((err, groups) ->
        router.next.ifError(err)
        router.send(groups)
    )
)

api.get('/os/group/get/:group', (router) ->
    api.os.group.get(router.req.params.group, (err, group) ->
        router.next.ifError(err)
        router.send(group)
    )
)

api.post('/os/groups/add', (router) ->
    opts = { 
        #system: false, 
        sudo: true 
    }
    
    group = router.req.body.group

    api.os.groups.add(group, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)

api.post('/os/groups/del', (router) ->
    opts = { 
        sudo: true 
    }
    
    group = router.req.body.group

    api.os.groups.del(group, opts, (err, status) ->
        router.next.ifError(err)
        router.send(status)
    )
)


#<-- Addon: OS | Path: /os/system -->#

api.get('/os/system/all', { 
    "hostname": api.os.system.hostname(),
    "type": api.os.system.type(),
    "platform": api.os.system.platform(),
    "arch": api.os.system.arch(),
    "release": api.os.system.release(),
    "eol": api.os.system.eol,
    "uptime": api.os.system.uptime(),
    "loadavg": api.os.system.loadavg(),
    "memory": {
        "total": api.os.system.memory.total(),
        "free": api.os.system.memory.free()
    },
    "cpus" : api.os.system.cpus(),
    "networkInterfaces" : api.os.system.networkInterfaces()
})

api.get('/os/system/hostname', api.os.system.hostname())
api.get('/os/system/type', api.os.system.type())
api.get('/os/system/platform', api.os.system.platform())
api.get('/os/system/arch', api.os.system.arch())
api.get('/os/system/release', api.os.system.release())
api.get('/os/system/eol', api.os.system.eol)
api.get('/os/system/uptime', api.os.system.uptime())
api.get('/os/system/loadavg', api.os.system.loadavg())
api.get('/os/system/memory/total', api.os.system.memory.total())
api.get('/os/system/memory/free', api.os.system.memory.free())
api.get('/os/system/cpus', api.os.system.cpus())
api.get('/os/system/networkInterfaces', api.os.system.networkInterfaces())

api.get('/os/system/netfilter/ip_conntrack_count', (router) ->
    api.os.system.netfilter.ip_conntrack_count((err, data) ->
        router.next.ifError(err)
        router.send(data)
    )
)


# ´´´´´´´ HIT IT UP! ´´´´´´´

api.connect(8080)

