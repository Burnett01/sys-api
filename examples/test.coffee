SysAPI = require '../src/sys-api'

api = new SysAPI({})

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

api.connect(8080)

