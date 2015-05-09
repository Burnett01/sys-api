SysAPI = require '../src/sys-api'

api = new SysAPI({})

respond = (req, res, next) ->
    res.send('hello ' + req.params.name)
    next()
    
api.get('/hello/:name', respond)

api.connect(8080)
