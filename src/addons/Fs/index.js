var fs, path;

fs = require('fs');

path = require('path');

module.exports = {
  fs: {
    path: path,
    readFile: function(path, cb) {
      return fs.readFile(path, 'utf8', function(err, data) {
        return cb(err, data);
      });
    },
    readDir: function(base, dirsonly, cb) {
      var cur_path, file, files, i, index, len, ret, stat;
      ret = [];
      files = fs.readdirSync(base);
      if (!files) {
        return cb("error retrving", null);
      }
      for (index = i = 0, len = files.length; i < len; index = ++i) {
        file = files[index];
        cur_path = path.join(base, file);
        stat = fs.statSync(cur_path);
        if (dirsonly && stat.isDirectory()) {
          ret.push(cur_path);
        }
      }
      return cb(null, ret);
    }
  }
};