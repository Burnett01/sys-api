var API, api;

API = require('sys-api');

api = new API({
    //'plugins.root' : '/plugins/'
    //'plugins.autoload' : true,
});

// Check https://github.com/Burnett01/sys-api/wiki/Create-a-plugin
// optionally pass an object to restify's createServer-function
// http://restify.com/#creating-a-server
// example:  api = new API({ restify: { name: 'MyApp' } })


// ´´´´´´´ SETUP ´´´´´´´

// => Authorization

api.auth({
  enabled: false,
  method: 'basic',
  bcrypt: true,
  users: {
    test: {
      password: 'testpw'
    }
  }
});

api.cors({
  enabled: false
});

api.bodyParser({
  enabled: true
});

api.get('/heartbeat', "dub");

api.post('/postman', function(router) {
  return router.send(router.req.body);
});

api.get('/net/isip/:ip', api.net.isIP);

api.get('/net/isv4/:ip', api.net.isIPv4);

api.get('/net/isv6/:ip', api.net.isIPv6);

api.post('/fs/readfile', function(router) {
  return api.fs.readFile(router.req.body.path, function(err, content) {
    router.next.ifError(err);
    return router.send(content);
  });
});

api.get('/os/users/all', function(router) {
  return api.os.users.all(function(err, users) {
    router.next.ifError(err);
    return router.send(users);
  });
});

api.get('/os/users/get/:user', function(router) {
  return api.os.users.get(router.req.params.user, function(err, user) {
    router.next.ifError(err);
    return router.send(user);
  });
});

api.post('/os/users/add', function(router) {
  var opts, pass, user;
  opts = {
    createHome: false,
    sudo: true
  };
  user = router.req.body.user;
  pass = router.req.body.pass;
  return api.os.users.add(user, pass, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

api.post('/os/users/lock', function(router) {
  var opts, user;
  opts = {
    sudo: true
  };
  user = router.req.body.user;
  return api.os.users.lock(user, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

api.post('/os/users/unlock', function(router) {
  var opts, user;
  opts = {
    sudo: true
  };
  user = router.req.body.user;
  return api.os.users.unlock(user, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

api.post('/os/users/del', function(router) {
  var opts, user;
  opts = {
    sudo: true
  };
  user = router.req.body.user;
  return api.os.users.del(user, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

api.get('/os/groups/all', function(router) {
  return api.os.groups.all(function(err, groups) {
    router.next.ifError(err);
    return router.send(groups);
  });
});

api.get('/os/group/get/:group', function(router) {
  return api.os.group.get(router.req.params.group, function(err, group) {
    router.next.ifError(err);
    return router.send(group);
  });
});

api.post('/os/groups/add', function(router) {
  var group, opts;
  opts = {
    sudo: true
  };
  group = router.req.body.group;
  return api.os.groups.add(group, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

api.post('/os/groups/del', function(router) {
  var group, opts;
  opts = {
    sudo: true
  };
  group = router.req.body.group;
  return api.os.groups.del(group, opts, function(err, status) {
    router.next.ifError(err);
    return router.send(status);
  });
});

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
  "cpus": api.os.system.cpus(),
  "networkInterfaces": api.os.system.networkInterfaces()
});

api.get('/os/system/hostname', api.os.system.hostname());

api.get('/os/system/type', api.os.system.type());

api.get('/os/system/platform', api.os.system.platform());

api.get('/os/system/arch', api.os.system.arch());

api.get('/os/system/release', api.os.system.release());

api.get('/os/system/eol', api.os.system.eol);

api.get('/os/system/uptime', api.os.system.uptime());

api.get('/os/system/loadavg', api.os.system.loadavg());

api.get('/os/system/memory/total', api.os.system.memory.total());

api.get('/os/system/memory/free', api.os.system.memory.free());

api.get('/os/system/cpus', api.os.system.cpus());

api.get('/os/system/networkInterfaces', api.os.system.networkInterfaces());

api.get('/os/system/netfilter/ip_conntrack_count', function(router) {
  return api.os.system.netfilter.ip_conntrack_count(function(err, data) {
    router.next.ifError(err);
    return router.send(data);
  });
});

api.connect(8080);
