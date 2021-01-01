(function() {
  /*
  The MIT License (MIT)

  Product:      System API (SysAPI)
  Description:  A modular System-API for NodeJS - RestifyJS

  Copyright (c) 2015-2021 Steven Agyekum <agyekum@posteo.de>

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
  var API, Addons, BCRYPT, ClassHelper, MORGAN, PluginHelper, RESTIFY, Validation,
    splice = [].splice;

  RESTIFY = require('restify');

  BCRYPT = require('bcryptjs');

  MORGAN = require('morgan');

  ClassHelper = require('./ClassHelper');

  PluginHelper = require('./PluginHelper');

  Validation = require('./lib/Validation-Engine');

  // Core-Addons definition
  Addons = ["./addons/Fs", "./addons/Os", "./addons/Net"];

  API = (function() {
    var _request, _response, addon, i, index, len;

    class API extends ClassHelper {
      constructor(options) {
        var instance;
        super();
        this.options = options;
        if (this.options['restify'] != null) {
          this.options.restify = this.options.restify;
        } else {
          this.options.restify = {};
        }
        // Clone the options.restify property and remove tls settings
        this.options._restify = Object.assign({}, this.options.restify);
        delete this.options._restify.key;
        delete this.options._restify.certificate;
        
        // Define an array for the RESTIFY.createServer instances
        this.instances = [];
        
        // Create a server with our cloned object (except tls settings)
        this.instances.push(new RESTIFY.createServer(this.options._restify));
        
        // Check whether our original options.restify object contains tls settings
        if ('key' in this.options.restify && 'certificate' in this.options.restify) {
          instance = new RESTIFY.createServer(this.options.restify);
          instance.server.tls = true;
          this.instances.push(instance);
        }
        
        // Define a wrapper function which runs a method-function on any instance
        this.server = (type, ...args) => {
          var j, len1, notls, ref, ref1, results;
          ref = args, [...args] = ref, [notls] = splice.call(args, -1);
          ref1 = this.instances;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            instance = ref1[j];
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
        // Check whether logger should be used
        if ('logger' in this.options) {
          this.server('use', MORGAN(this.options['logger']));
        }
        
        // Check whether plugins should be loaded
        if ('plugins.root' in this.options) {
          if ('plugins.autoload' in this.options && this.options['plugins.autoload'] === true) {
            API.plugins().setup(this.options['plugins.root']);
          }
        }
      }

      //#######  API Methods  ########
      listen(http, https) {
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
      }

      // Legacy function that got replaced by listen()
      connect(http, https) {
        return this.listen(http, https);
      }

      pre(fn) {
        return this.server("pre", fn);
      }

      use(fn) {
        return this.server("use", fn);
      }

      
      //#######  Bundled API Plugins  ########

      // Authorization parser
      auth(options) {
        var anon, users;
        options = options || {
          enabled: false
        };
        if (!options.enabled || options.method !== 'basic' || !'users' in options) {
          return;
        }
        this.server("use", RESTIFY.authorizationParser());
        users = options.users;
        anon = options.anon || false;
        return this.server("use", function(req, res, next) {
          var _hash;
          // Anonymous access
          if (anon && req.username === 'anonymous') {
            return next();
          }
          if (!users[req.username]) {
            return next(new API.error.NotAuthorizedError());
          }
          // Basic Authentication
          if (options.bcrypt !== true) {
            if (req.authorization.basic.password === users[req.username].password) {
              return next();
            } else {
              return next(new API.error.NotAuthorizedError());
            }
          } else {
            //fix for php-blowfish-hashes
            // Basic Authentication + Bcrypt
            _hash = req.authorization.basic.password.replace('$2y$', '$2a$');
            return BCRYPT.compare(users[req.username].password, _hash, function(err, valid) {
              if (valid === true) {
                return next();
              } else {
                return next(new API.error.NotAuthorizedError());
              }
            });
          }
        });
      }

      
      // Validation Engine
      validator(opts) {
        opts = opts || {
          enabled: false
        };
        if (!opts.enabled) {
          return;
        }
        delete opts.enabled;
        return this.server("use", Validation(opts));
      }

      // Cross-Origin Resource Sharing
      cors(opts) {
        return this.useRestifyPlugin("CORS", opts);
      }

      // Body parser
      bodyParser(opts) {
        return this.useRestifyPlugin("bodyParser", opts);
      }

      // Accept parser
      acceptParser(opts) {
        return this.useRestifyPlugin("acceptParser", opts);
      }

      // Date parser
      dateParser(opts) {
        return this.useRestifyPlugin("dateParser", opts);
      }

      // Query parser
      queryParser(opts) {
        return this.useRestifyPlugin("queryParser", opts);
      }

      // JOSN-P
      jsonp(opts) {
        return this.useRestifyPlugin("jsonp", opts);
      }

      // Gzip response
      gzipResponse(opts) {
        return this.useRestifyPlugin("gzipResponse", opts);
      }

      // Request expiry
      requestExpiry(opts) {
        return this.useRestifyPlugin("requestExpiry", opts);
      }

      // Throttle
      throttle(opts) {
        return this.useRestifyPlugin("throttle", opts);
      }

      
      // Audit logger
      auditLogger(opts) {
        return this.useRestifyPlugin("auditLogger", opts);
      }

      // Request logger
      requestLogger(opts) {
        return this.useRestifyPlugin("requestLogger", opts);
      }

      // Sanitize Path
      sanitizePath(opts) {
        return this.useRestifyPlugin("sanitizePath", opts);
      }

      // Serve Static
      serveStatic(opts) {
        return this.useRestifyPlugin("serveStatic", opts);
      }

      // Full Response
      fullResponse(opts) {
        return this.useRestifyPlugin("fullResponse", opts);
      }

      // JSON Body Parser
      jsonBodyParser(opts) {
        return this.useRestifyPlugin("jsonBodyParser", opts);
      }

      
      // Multipart Body Parser
      multipartBodyParser(opts) {
        return this.useRestifyPlugin("multipartBodyParser", opts);
      }

      // Url Encoded Body Parser
      urlEncodedBodyParser(opts) {
        return this.useRestifyPlugin("urlEncodedBodyParser", opts);
      }

      // Conditional request
      conditionalRequest(opts) {
        return this.useRestifyPlugin("conditionalRequest", opts);
      }

      useRestifyPlugin(plugin, opts) {
        var skipTLS;
        opts = opts || {
          enabled: false
        };
        if (!opts.enabled) {
          return;
        }
        delete opts.enabled;
        // Legacy support for .settings
        if (opts.settings) {
          opts = {...opts['settings']};
        }
        skipTLS = plugin === "gzipResponse";
        return this.server("use", RESTIFY[plugin](opts), skipTLS);
      }

      
      //#######  API HTTP-METHODS  ########
      //-> Forward HTTP-Methods to internal _request
      head(path, ...cb) {
        return this.server("head", path, function(req, res, next) {
          return _request(cb, req, res, next);
        });
      }

      get(path, ...cb) {
        return this.server("get", path, function(req, res, next) {
          return _request(cb, req, res, next);
        });
      }

      post(path, ...cb) {
        return this.server("post", path, function(req, res, next) {
          return _request(cb, req, res, next);
        });
      }

      put(path, ...cb) {
        return this.server("put", path, function(req, res, next) {
          return _request(cb, req, res, next);
        });
      }

      del(path, ...cb) {
        return this.server("del", path, function(req, res, next) {
          return _request(cb, req, res, next);
        });
      }

    };

    // Extend restify-errors
    API.extend({
      error: RESTIFY.errors
    });


// Include and expose Core-Addons
    for (index = i = 0, len = Addons.length; i < len; index = ++i) {
      addon = Addons[index];
      API.extend(require(addon));
      API.include(require(addon));
    }

    
    // Extend PluginHelper
    API.extend(PluginHelper);

    //#######  API Internal Functions  ########

    // Response wrapper
    _response = function(req, res, next, data) {
      res.send({
        response: data
      });
      return next();
    };

    
    // Request wrapper
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
              // Todo: add next.ifError
              send: function(data) {
                return _response(req,
            res,
            next,
            data);
              }
            }
          ]));
        }
        return results;
      }
    };

    
    //#######  Export all instances  ########
    API.prototype.instances = API.instances;

    return API;

  }).call(this);

  module.exports = API;

}).call(this);
