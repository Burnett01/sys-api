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
