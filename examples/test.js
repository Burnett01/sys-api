var API, api;

API = require('sys-api');

api = new API({
    /* 'plugins.root' : ['/plugins/', '/home/user/plugins/'] */
    /* 'plugins.autoload' : true, */
    /* 'logger' : 'dev' */
});

/*  Optionally pass an object to restify's createServer-function */
/*  http://restify.com/#creating-a-server */
/*  example:  api = new API({ restify: { name: 'MyApp' } }) */


/* ´´´´´´´ SETUP ´´´´´´´ */

/* => Authorization */

api.auth({
  enabled: false,
  method: 'basic',
  bcrypt: true,
  anon: false,
  users: {
    test: {
      password: 'testpw'
    }
  }
});

/* => CORS (Cross-Origin Resource Sharing) */

api.cors({
  enabled: false
});

/* => BodyParser */

api.bodyParser({
  enabled: true
});

/* ´´´´´´´ DEMO ROUTES ´´´´´´´ */

/* <-- Desc: Health-Status | Path: /heartbeat --> */

/* Simple GET-Response */

api.get('/heartbeat', "dub");

/* Simple POST-Response */
/* Access POST-values via req.body.value */

api.post('/postman', function(router) {
  return router.send(router.req.body);
});

/* ´´´´´´´ ADDON ROUTES ´´´´´´´ */
/* Each route correspondens to an addon */
/* Check the src/addon/ folder for more information */

/* <-- Addon: Net | Path: /net --> */

api.get('/net/isip/:ip', api.net.isIP);

api.get('/net/isv4/:ip', api.net.isIPv4);

api.get('/net/isv6/:ip', api.net.isIPv6);

/* <-- Addon: FS | Path: /fs --> */

api.post('/fs/readfile', function(router) {
  return api.fs.readFile(router.req.body.path, function(err, content) {
    router.next.ifError(err);
    return router.send(content);
  });
});

/* <-- Addon: OS | Path: /os/users --> */

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

/* <-- Addon: OS | Path: /os/groups --> */

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

/* <-- Addon: OS | Path: /os/system --> */

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

/* ´´´´´´´ HIT IT UP! ´´´´´´´ */

api.listen(8080);
