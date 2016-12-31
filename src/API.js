
/*
The MIT License (MIT)

Product:      C2B System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2017 Cloud2Box - IT Dienstleistungen <info@cloud2box.net>
              2015-2017 Steven Agyekum <s-8@posteo.mx>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
    if (this.options['restify'] != null) {
      this.options.restify = this.options.restify;
    } else {
      this.options.restify = {};
    }
    this.options._restify = Object.assign({}, this.options.restify);
    delete this.options._restify.key;
    delete this.options._restify.certificate;
    this.instances = [];
    this.instances.push(new RESTIFY.createServer(this.options._restify));
    if ('key' in this.options.restify && 'certificate' in this.options.restify) {
      instance = new RESTIFY.createServer(this.options.restify);
      instance.server.tls = true;
      this.instances.push(instance);
    }
    this.server = (function(_this) {
      return function() {
        var args, j, k, len1, notls, ref, results, type;
        type = arguments[0], args = 3 <= arguments.length ? slice.call(arguments, 1, j = arguments.length - 1) : (j = 1, []), notls = arguments[j++];
        ref = _this.instances;
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          instance = ref[k];
          if (typeof notls === 'boolean') {
            if ((instance.server.tls != null) && notls === true) {
              continue;
            }
          } else if (typeof notls !== 'boolean' || notls === false) {
            args.push(notls);
          }
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

  API.prototype.connect = function(http, https) {
    var instance, j, len1, ref, results;
    ref = this.instances;
    results = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      instance = ref[j];
      results.push((function(http, https) {
        var port;
        port = instance.server.tls ? https != null ? https : 443 : http;
        return instance.listen(port, function() {
          return console.log('API listening on port %d', port);
        });
      })(http, https));
    }
    return results;
  };

  API.prototype.pre = function(fn) {
    return this.server("pre", fn);
  };

  API.prototype.use = function(fn) {
    return this.server("use", fn);
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

  API.prototype.acceptParser = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.acceptParser(options.settings));
    }
  };

  API.prototype.dateParser = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.dateParser(options.settings));
    }
  };

  API.prototype.queryParser = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.queryParser(options.settings));
    }
  };

  API.prototype.jsonp = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.jsonp(options.settings));
    }
  };

  API.prototype.gzipResponse = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.gzipResponse(options.settings), true);
    }
  };

  API.prototype.requestExpiry = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.requestExpiry(options.settings));
    }
  };

  API.prototype.throttle = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.throttle(options.settings));
    }
  };

  API.prototype.conditionalRequest = function(options) {
    options = options || {
      enabled: false
    };
    if (options.enabled === true) {
      return this.server("use", RESTIFY.conditionalRequest(options.settings));
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
            next: function(data) {
              if (data != null) {
                return next(data);
              } else {
                return next;
              }
            },
            send: function(data) {
              return _response(req, res, next, data);
            }
          }
        ]));
      }
      return results;
    }
  };

  API.prototype.head = function() {
    var cb, path;
    path = arguments[0], cb = 2 <= arguments.length ? slice.call(arguments, 1) : [];
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

  API.prototype.post = function() {
    var cb, path;
    path = arguments[0], cb = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.server("post", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.put = function() {
    var cb, path;
    path = arguments[0], cb = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.server("put", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.del = function() {
    var cb, path;
    path = arguments[0], cb = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.server("del", path, function(req, res, next) {
      return _request(cb, req, res, next);
    });
  };

  API.prototype.instances = API.instances;

  return API;

})(ClassHelper);

module.exports = API;
