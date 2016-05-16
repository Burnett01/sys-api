var API, Addons, BCRYPT, ClassHelper, MORGAN, PluginHelper, RESTIFY,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

RESTIFY = require('restify');

BCRYPT = require('bcryptjs');

MORGAN = require('morgan');

ClassHelper = require('./ClassHelper');

PluginHelper = require('./PluginHelper');

Addons = ["./addons/Fs", "./addons/Os", "./addons/Net"];

API = (function(superClass) {
  var _request, _response, addon, i, index, len;

  extend(API, superClass);

  API.extend({
    error: RESTIFY.errors
  });

  for (index = i = 0, len = Addons.length; i < len; index = ++i) {
    addon = Addons[index];
    API.extend(require(addon));
    API.include(require(addon));
  }

  API.extend(PluginHelper);

  function API(options) {
    var instance;
    this.options = options;
    this.options.restify = {};
    if (typeof this.options['restify'] !== void 0) {
      this.options.restify = this.options.restify;
    }
    this.options._restify = Object.assign({}, this.options.restify);
    delete this.options._restify.key;
    delete this.options._restify.certificate;
    this.instances = [];
    this.instances.push(new RESTIFY.createServer(this.options._restify));
    if ('key' in this.options.restify && 'certificate' in this.options.restify) {
      instance = new RESTIFY.createServer(this.options.restify);
      instance.server.ssl = true;
      this.instances.push(instance);
    }
    this.server = (function(_this) {
      return function() {
        var args, j, len1, ref, results, type;
        type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        ref = _this.instances;
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          instance = ref[j];
          results.push(instance[type].apply(instance, args));
        }
        return results;
      };
    })(this);
    if ('logger' in this.options) {
      this.server('use', MORGAN(this.options['logger']));
    }
    if ('plugins.root' in this.options) {
      if ('plugins.autoload' in this.options && this.options['plugins.autoload'] === true) {
        API.plugins().setup(this.options['plugins.root']);
      }
    }
  }

  API.prototype.connect = function(port) {
    var instance, j, len1, ref, results;
    ref = this.instances;
    results = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      instance = ref[j];
      results.push((function(port) {
        port = instance.server.ssl ? 443 : port;
        return instance.listen(port, function() {
          return console.log('API listening on port %d', port);
        });
      })(port));
    }
    return results;
  };

  API.prototype.auth = function(options) {
    var users;
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      this.server("use", RESTIFY.authorizationParser());
      if (options.method === 'basic' || options.hasOwnProperty('users')) {
        users = options.users;
        return this.server("use", function(req, res, next) {
          var _hash;
          if (req.username === 'anonymous' || !users[req.username]) {
            next(new API.error.NotAuthorizedError());
          }
          if (options.bcrypt === true) {
            _hash = req.authorization.basic.password.replace('$2y$', '$2a$');
            return BCRYPT.compare(users[req.username].password, _hash, function(err, valid) {
              if (valid === true) {
                return next();
              } else {
                return next(new API.error.NotAuthorizedError());
              }
            });
          } else {
            if (req.authorization.basic.password === users[req.username].password) {
              return next();
            } else {
              return next(new API.error.NotAuthorizedError());
            }
          }
        });
      }
    }
  };

  API.prototype.cors = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.CORS(options.settings));
    }
  };

  API.prototype.bodyParser = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.bodyParser(options.settings));
    }
  };

  _response = function(req, res, next, data) {
    res.send({
      response: data
    });
    return next();
  };

  _request = function(callbacks, req, res, next) {
    var callback, j, len1, results;
    if (typeof callbacks[0] === 'string' || typeof callbacks[0] === 'object') {
      return _response(req, res, next, callbacks[0]);
    }
    if (callbacks.length) {
      results = [];
      for (j = 0, len1 = callbacks.length; j < len1; j++) {
        callback = callbacks[j];
        results.push(callback.apply(null, [
          {
            req: req,
            res: res,
            next: next,
            send: function(response) {
              return _response(req, res, next, response);
            }
          }
        ]));
      }
      return results;
    }
  };

  API.prototype.head = function(path, cb) {
    return this.server("head", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.get = function() {
    var cb, path;
    path = arguments[0], cb = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.server("get", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.post = function(path, cb) {
    return this.server("post", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.instances = API.instances;

  return API;

})(ClassHelper);

module.exports = API;
