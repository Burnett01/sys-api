###
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2020 Steven Agyekum <agyekum@posteo.de>

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
###

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