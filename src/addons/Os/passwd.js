/*
Source: https://github.com/pkrumins/node-passwd
It was written by Peteris Krumins (peter@catonmat.net, @pkrumins on twitter).
His blog is at http://www.catonmat.net  --  good coders code, great reuse.

Edited by @Burnett01 - Now with SYNC-support
*/

var fs = require('fs');
var spawnSync = require('child_process').spawnSync;

function generateSalt (n) {
    var salt = [];
    var alphabet = "abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < n; i++) salt.push(alphabet[parseInt(Math.random()*alphabet.length)]);
    return salt.join('');
}

exports.shadowPass = function (pass) {
    var salt = generateSalt(8);
    var openssl = spawnSync('openssl', ['passwd', '-1', '-salt', salt, pass]);
    
    return openssl.stdout.toString().slice(0,-1);
};

exports.add = function (username, pass, opts) {
    var opts = opts || {};
    var shadowPass = exports.shadowPass(pass);

    var useraddOpts = [];
    if (opts.createHome) useraddOpts.push('-m');
    if (opts.group) useraddOpts = useraddOpts.concat(['-g', opts.group]);
    if (opts.shell) useraddOpts = useraddOpts.concat(['-s', opts.shell]);
    useraddOpts = useraddOpts.concat(['-p', shadowPass]);
    useraddOpts.push(username);
    var cmd = 'useradd';
    if (opts.sudo) {
        cmd = 'sudo';
        useraddOpts = ['useradd'].concat(useraddOpts);
    }
    return spawnSync(cmd, useraddOpts);
};

exports.del = function (username, opts) {
    var opts = opts || {};
    var cmd = 'userdel';
    var args = [username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['userdel'].concat(args);
    }
    return spawnSync(cmd, args);
};

exports.lock = function (username, opts) {
    var opts = opts || {};
    var cmd = 'usermod';
    var args = ['-L', username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['usermod'].concat(args);
    }
    return spawnSync(cmd, args);
};

exports.unlock = function (username, opts) {
    var opts = opts || {};
    var cb = cb || function () { };
    var cmd = 'usermod';
    var args = ['-U', username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['usermod'].concat(args);
    }
    return spawnSync(cmd, args);
};

exports.passwd = function (username, pass, opts) {
    var opts = opts || {};

    var shadowPass = exports.shadowPass(pass);
    var cmd = 'usermod';
    var args = ['-p', shadowPass, username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['usermod'].concat(args);
    }
    return spawnSync(cmd, args);
};

exports.getAll = getUsers;

exports.get = function (username) {
    var users = getUsers();
    
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.username == username) {
            return user;
        }
    }
};

function getUsers () {
    
    var users = fs.readFileSync('/etc/passwd')
    .toString()
    .split('\n')
    .filter(function (user) {
        return user.length && user[0] != '#';
    })
    .map(function (user) {
        var fields = user.split(':');
        return {
            username : fields[0],
            password : fields[1],
            userId : fields[2],
            groupId : fields[3],
            name : fields[4],
            homedir : fields[5],
            shell : fields[6]
        };
    });
    
    return users;
}
