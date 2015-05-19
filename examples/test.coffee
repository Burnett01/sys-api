SysAPI = require '../src/API'

api = new SysAPI({})

### Authorization ###

api.auth({
    enabled: true,
    method: 'basic',
    users: {
        test: {
            password: 'testpw'
        }   
    }
})

###->>>>>   NET   <<<<<-###
api.get('/net/isip/:ip', (req, res, next) ->
    api.respond(req, res, next, 
        api.net.isIP(req.params.ip)
    )
)

api.get('/net/isv4/:ip', (req, res, next) ->
    api.respond(req, res, next, 
        api.net.isIPv4(req.params.ip)
    )
)

api.get('/net/isv6/:ip', (req, res, next) ->
    api.respond(req, res, next, 
        api.net.isIPv6(req.params.ip)
    )
)

###->>>>>   SYS   <<<<<-###
api.get('/sys/users/all', (req, res, next) ->
    api.respond(req, res, next, 
        api.sys.users.all()
    )
)

api.get('/sys/users/get/:user', (req, res, next) ->
    api.respond(req, res, next, 
        api.sys.users.get(req.params.user)
    )
)

api.connect(8080)

