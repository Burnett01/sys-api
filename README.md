# sys-api
A modular System-API for Linux - written in Coffeescript, based on NodeJS and RestifyJS

### Plugins
Plugins are core-features, thus hardcoded.
Each plugin represents an actual restifyJS-plugin (http://mcavage.me/node-restify/#bundled-plugins)

####Available plugins:
+ Authorization (with custom bcrypt-handler)
+ CORS
+ BodyParser

### Addons
Addons are sub-features and can be maintained from within an external file.
Check out the wiki for instructions: https://github.com/Burnett01/sys-api/wiki/Addons-(core)

####Available addons:
Check out the addons-folder and demo-file
https://github.com/Burnett01/sys-api/tree/master/src/addons
https://github.com/Burnett01/sys-api/blob/master/examples/test.coffee

##How to install:
Just use `npm install sys-api` and copy the demo-file in the examples folder into your main-index. 
Edit the demo-file and run the api.