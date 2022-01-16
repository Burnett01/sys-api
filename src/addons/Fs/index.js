/*
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2022 Steven Agyekum <agyekum@posteo.de>

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

var fs, path;

fs = require('fs');

path = require('path');

module.exports = {
  fs: {
    fs: fs,
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
