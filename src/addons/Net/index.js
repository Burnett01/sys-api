var net;

net = require('net');

module.exports = {
  net: {
    net: net,
    isIP: function(router) {
      return router.send(net.isIP(router.req.params.ip));
    },
    isIPv4: function(router) {
      return router.send(net.isIPv4(router.req.params.ip));
    },
    isIPv6: function(router) {
      return router.send(net.isIPv6(router.req.params.ip));
    }
  }
};
