var Fs, os, pwdg;

os = require('os');

pwdg = require('./assets/passwd-groups');

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
