var API, Addons, ClassHelper, bcrypt, restify,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

restify = require('restify');

bcrypt = require('bcryptjs');

ClassHelper = require('./ClassHelper');

Addons = ["./addons/Fs", "./addons/Os", "./addons/Net"];

API = (function(superClass) {
  var _request, _response, addon, i, index, len, plugins;

  extend(API, superClass);

  for (index = i = 0, len = Addons.length; i < len; index = ++i) {
    addon = Addons[index];
    API.extend(require(addon));
    API.include(require(addon));
  }

  API.extend({
    error: restify.errors
  });

  plugins = {
    registerAll: function(root) {
      console.log("Loading plugins..");
      return API.fs.readDir(root, true, function(err, files) {
        var file, j, len1, results;
        if (err) {
          return console.log(err);
        }
        results = [];
        for (index = j = 0, len1 = files.length; j < len1; index = ++j) {
          file = files[index];
          console.log("[LOADED] plugin-" + file);
          results.push(API.include(require(file)));
        }
        return results;
      });
    }
  };

  function API(options) {
    this.options = options;
    if (typeof this.options['restify'] === void 0) {
      this.options.restify = {};
    }
    this.server = new restify.createServer(this.options.restify);
    if ('plugins.root' in this.options) {
      if ('plugins.autoload' in this.options && this.options['plugins.autoload'] === true) {
        plugins.registerAll(this.options['plugins.root']);
      }
    }
  }

  API.prototype.connect = function(port) {
    return this.server.listen(port, function() {
      return console.log('API listening on port %d', port);
    });
  };

  API.prototype.auth = function(options) {
    var users;
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      this.server.use(restify.authorizationParser());
      if (options.method === 'basic' || options.hasOwnProperty('users')) {
        users = options.users;
        return this.server.use(function(req, res, next) {
          var _hash;
          if (req.username === 'anonymous' || !users[req.username]) {
            next(new restify.NotAuthorizedError());
          }
          if (options.bcrypt === true) {
            _hash = req.authorization.basic.password.replace('$2y$', '$2a$');
            return bcrypt.compare(users[req.username].password, _hash, function(err, valid) {
              if (valid === true) {
                return next();
              } else {
                return next(new restify.NotAuthorizedError());
              }
            });
          } else {
            if (req.authorization.basic.password === users[req.username].password) {
              return next();
            } else {
              return next(new restify.NotAuthorizedError());
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
      return this.server.use(restify.CORS(options.settings));
    }
  };

  API.prototype.bodyParser = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server.use(restify.bodyParser(options.settings));
    }
  };

  API.prototype.error = function(message) {
    return new restify.errors.InternalServerError();
  };

  _response = function(req, res, next, data) {
    res.send({
      response: data
    });
    return next();
  };

  _request = function(callback, req, res, next, args) {
    if (typeof callback === 'string' || typeof callback === 'object') {
      return _response(req, res, next, callback);
    } else if (typeof callback === 'function') {
      return callback.apply(null, [
        {
          req: req,
          res: res,
          next: next,
          send: function(response) {
            return _response(req, res, next, response);
          }
        }
      ].concat(args));
    } else {
      return next(new restify.errors.InternalServerError(typeof callback + " is not a valid callback-method!"));
    }
  };

  API.prototype.head = function(path, cb) {
    return this.server.head(path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.get = function() {
    var args, cb, path;
    path = arguments[0], cb = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    return this.server.get(path, function(req, res, next) {
      return _request(cb, req, res, next, args);
    });
  };

  API.prototype.post = function(path, cb) {
    return this.server.post(path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  return API;

})(ClassHelper);

module.exports = API;
