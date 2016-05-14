fs   = require 'fs'
path = require 'path'

module.exports = {
    fs: 
        fs: fs    
        path: path
        
        readFile: (path, cb) ->
            fs.readFile(path, 'utf8', (err, data)  ->
                cb(err, data)
            )
            
         readDir: (base, dirsonly, cb) ->
            ret = []
            files = fs.readdirSync(base)
            if !files then return cb("error retrving", null)
            for file, index in files
                cur_path = path.join(base, file);
                stat = fs.statSync(cur_path)
                if(dirsonly && stat.isDirectory())
                    ret.push(cur_path)
                    
            cb(null, ret)   
    
}

            