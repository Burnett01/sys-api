net = require 'net'

module.exports = {
    net:
        net: net
        
        isIP: (router) ->
            router.send(net.isIP(router.req.params.ip))
            
        isIPv4: (router) ->
            router.send(net.isIPv4(router.req.params.ip))

        isIPv6: (router) ->
            router.send(net.isIPv6(router.req.params.ip))
}
