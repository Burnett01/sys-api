fs   = require 'fs'
path = require 'path'

Addon =
    fs:     
        readFile: (path, cb) ->
            fs.readFile(path, (err, data)  ->
                cb(err, data)
            )
            
            

module.exports = Addon
