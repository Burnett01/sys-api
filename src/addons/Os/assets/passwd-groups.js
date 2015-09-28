/*
    Source: https://github.com/pkrumins/node-passwd
    It was written by Peteris Krumins (peter@catonmat.net, @pkrumins on twitter).
    His blog is at http://www.catonmat.net  --  good coders code, great reuse.
    
    Edited by @Burnett01 - Now with /etc/group (group(5)) support
    Source: https://github.com/Burnett01/node-passwd
*/

var fs = require('fs');
var spawn = require('child_process').spawn;

function generateSalt (n) {
    var salt = [];
    var alphabet = "abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < n; i++) salt.push(alphabet[parseInt(Math.random()*alphabet.length)]);
    return salt.join('');
}

exports.shadowPass = function (pass, cb) {
    var salt = generateSalt(8);
    var openssl = spawn('openssl', ['passwd', '-1', '-salt', salt, pass]);
    openssl.stdout.on('data', function (buf) {
        cb(buf.toString().slice(0,-1));
    });
};


/*  ++++++++++++++++++++++
    ++++ User Methods ++++
    ++++++++++++++++++++++
*/

exports.addUser = function (username, pass, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };
    exports.shadowPass(pass, function (shadowPass) {
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
        var passwd = spawn(cmd, useraddOpts);
        passwd.on('exit', function (code, signal) {
            if(code == 0){
                cb(null, code);
            }else{
                cb("Couldn't create user. Code: " + code, null);
            }
        });
    });
};

exports.delUser = function (username, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };
    var cmd = 'userdel';
    var args = [username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['userdel'].concat(args);
    }
    var passwd = spawn(cmd, args);
    passwd.on('exit', function (code, signal) {
        if(code == 0){
            cb(null, code);
        }else{
            cb("Couldn't remove user. Code: " + code, null);
        }
    });
};

exports.lockUser = function (username, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };
    var cmd = 'usermod';
    var args = ['-L', username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['usermod'].concat(args);
    }
    var passwd = spawn(cmd, args);
    passwd.on('exit', function (code, signal) {
        if(code == 0){
            cb(null, code);
        }else{
            cb("Couldn't lock user. Code: " + code, null);
        }
    });
};

exports.unlockUser = function (username, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };
    var cmd = 'usermod';
    var args = ['-U', username];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['usermod'].concat(args);
    }
    var passwd = spawn(cmd, args);
    passwd.on('exit', function (code, signal) {
        if(code == 0){
            cb(null, code);
        }else{
            cb("Couldn't unlock user. Code: " + code, null);
        }
    });
};

exports.passwd = function (username, pass, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { }
    exports.shadowPass(pass, function (shadowPass) {
        var cmd = 'usermod';
        var args = ['-p', shadowPass, username];
        if (opts.sudo) {
            cmd = 'sudo';
            args = ['usermod'].concat(args);
        }
        var passwd = spawn(cmd, args);
        passwd.on('exit', function (code, signal) {
            cb(code);
        });
    });
};

exports.getAllUsers = _getUsers;

exports.getUser = function (username, cb) {
    _getUsers(function (err, users) {
        if (err) cb(err, null);
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.username == username) {
                cb(null, user);
                return;
            }
        };
        cb('User was not found!', null);
    });
};

function _getUsers (cb) {
    fs.readFile('/etc/passwd', function (err, users) {
        if (err) cb(err, null);
        cb(null,
            users
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
            })
        );
    });
}


/*  +++++++++++++++++++++++
    ++++ Group Methods ++++
    +++++++++++++++++++++++
*/

exports.addGroup = function (name, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };

    var groupaddOpts = [];
    if (opts.system) groupaddOpts.push('-r');

    groupaddOpts.push(name);
    var cmd = 'groupadd';
    if (opts.sudo) {
        cmd = 'sudo';
        groupaddOpts = ['groupadd'].concat(groupaddOpts);
    }
    var passwd = spawn(cmd, groupaddOpts);
    passwd.on('exit', function (code, signal) {
        if(code == 0){
            cb(null, code);
        }else{
            cb("Couldn't create group. Code: " + code, null);
        }
    });
    
};

exports.delGroup = function (name, opts, cb) {
    var opts = opts || {};
    var cb = cb || function () { };
    var cmd = 'groupdel';
    var args = [name];
    if (opts.sudo) {
        cmd = 'sudo';
        args = ['groupdel'].concat(args);
    }
    var passwd = spawn(cmd, args);
    passwd.on('exit', function (code, signal) {
        if(code == 0){
            cb(null, code);
        }else{
            cb("Couldn't remove group. Code: " + code, null);
        }
    });
};

exports.getAllGroups = _getGroups;

exports.getGroup = function (name, cb) {
    _getGroups(function (err, groups) {
        if (err) cb(err, null);
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if (group.name == name) {
                cb(null, group);
                return;
            }
        };
        cb('Group was not found!', null);
    });
};

function _getGroups (cb) {
    fs.readFile('/etc/group', function (err, groups) {
        if (err) cb(err, null);
        cb(null,
            groups
            .toString()
            .split('\n')
            .filter(function (group) {
                return group.length && group[0] != '#';
            })
            .map(function (group) {
                var fields = group.split(':');
                return {
                    name : fields[0],
                    password : fields[1],
                    id : fields[2],
                    members : fields[3].split(',')
                };
            })
        );
    });
}
