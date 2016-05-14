module.exports =
    plugins: ->
        _ = @
        load_dir: (root) ->
            _.fs.readDir(root, true, (err, files) ->
                if err then return console.log(err)
                for file, index in files
                    console.log "[PLUGINS] Loaded plugin-" + file
                    _.include(require(file))
            )
        setup: (root) ->
            if typeof root is 'object'
                console.log "[PLUGINS] Loading plugins from multiple roots"
                for _dir in root
                    @.load_dir(_dir)
            else
                console.log "[PLUGINS] Loading plugins"
                @.load_dir(root)
            
        ###extended: ->
            @include
                enable: ->
                disable: ->###