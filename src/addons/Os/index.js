/*
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2019 Steven Agyekum <agyekum@posteo.de>

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

var Fs, os, pwdg;

os = require('os');

pwdg = require('passwd-groups');

Fs = require('../Fs');

module.exports = {
  os: {
    os: os,
    system: {
      hostname: function() {
        return os.hostname();
      },
      type: function() {
        return os.type();
      },
      platform: function() {
        return os.platform();
      },
      arch: function() {
        return os.arch();
      },
      release: function() {
        return os.release();
      },
      eol: os.EOL,
      uptime: function() {
        return os.uptime();
      },
      loadavg: function() {
        return os.loadavg();
      },
      memory: {
        total: function() {
          return os.totalmem();
        },
        free: function() {
          return os.freemem();
        }
      },
      cpus: function() {
        return os.cpus();
      },
      networkInterfaces: function() {
        return os.networkInterfaces();
      }
    },
    users: {
      all: function(cb) {
        return pwdg.getAllUsers(function(err, users) {
          return cb(err, users);
        });
      },
      get: function(username, cb) {
        return pwdg.getUser(username, function(err, user) {
          return cb(err, user);
        });
      },
      add: function(username, pass, opts, cb) {
        return pwdg.addUser(username, pass, opts, function(err, status) {
          return cb(err, status);
        });
      },
      lock: function(username, opts, cb) {
        return pwdg.lockUser(username, opts, function(err, status) {
          return cb(err, status);
        });
      },
      unlock: function(username, opts, cb) {
        return pwdg.unlockUser(username, opts, function(err, status) {
          return cb(err, status);
        });
      },
      del: function(username, opts, cb) {
        return pwdg.delUser(username, opts, function(err, status) {
          return cb(err, status);
        });
      }
    },
    groups: {
      all: function(cb) {
        return pwdg.getAllGroups(function(err, groups) {
          return cb(err, groups);
        });
      },
      get: function(name, cb) {
        return pwdg.getGroup(name, function(err, group) {
          return cb(err, group);
        });
      },
      add: function(name, opts, cb) {
        return pwdg.addGroup(name, opts, function(err, status) {
          return cb(err, status);
        });
      },
      del: function(name, opts, cb) {
        return pwdg.delGroup(name, opts, function(err, status) {
          return cb(err, status);
        });
      }
    }
  }
};
