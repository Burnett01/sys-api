/*
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2017 Steven Agyekum <agyekum@posteo.de>

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

module.exports = {
  plugins: function() {
    var _;
    _ = this;
    return {
      load_dir: function(root) {
        return _.fs.readDir(root, true, function(err, files) {
          var file, i, index, len, results;
          if (err) {
            return console.log(err);
          }
          results = [];
          for (index = i = 0, len = files.length; i < len; index = ++i) {
            file = files[index];
            console.log("[PLUGINS] Loaded plugin-" + file);
            results.push(_.include(require(file)));
          }
          return results;
        });
      },
      setup: function(root) {
        var _dir, i, len, results;
        if (typeof root === 'object') {
          console.log("[PLUGINS] Loading plugins from multiple roots");
          results = [];
          for (i = 0, len = root.length; i < len; i++) {
            _dir = root[i];
            results.push(this.load_dir(_dir));
          }
          return results;
        } else {
          console.log("[PLUGINS] Loading plugins");
          return this.load_dir(root);
        }
      }

      /*extended: ->
          @include
              enable: ->
              disable: ->
       */
    };
  }
};
