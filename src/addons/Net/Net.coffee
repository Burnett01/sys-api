net = require 'net'

Net =
    net:
        isIP: (input) ->
            net.isIP(input)
            
        isIPv4: (input) ->
            net.isIPv4(input)
            
        isIPv6: (input) ->
            net.isIPv6(input)
   
module.exports = Net
