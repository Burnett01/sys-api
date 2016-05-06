# sys-api
A modular System-API for Linux - written in Coffeescript, based on NodeJS and RestifyJS

### Restify-functions
Restify-functions are core-features, thus hardcoded.
Each function represents an actual restifyJS-plugin (http://mcavage.me/node-restify/#bundled-plugins)

####Available functions:
+ Authorization (with custom bcrypt-handler)
+ CORS
+ BodyParser
+ Extensive Routing

### Routing
There are tons of routing-variations!
Check the wiki: https://github.com/Cloud2Box/sys-api/wiki/Routing

### Core-Addons
Core-Addons are bound to the API and can be maintained from within an external file.
As of now there are three Core-Addons available (FS, OS, NET), but you can create you own.
Check out the wiki for instructions: https://github.com/Burnett01/sys-api/wiki/Create-an-Addon-(core)

Once you've finished your addon, please submit a pull-request. If it's useful, it'll be added.

### Plugins
That's right! As of version 0.2.0 you can create your own plugins apart from Core-Addons.
This allows you to extend your API without changing Sys-API's source.

Check out: https://github.com/Burnett01/sys-api/wiki/Create-a-plugin


####Demo / Example:
https://github.com/Burnett01/sys-api/blob/master/examples/test.coffee

##How to install:
Just use `npm install sys-api` and copy the demo-file in the examples folder into your main-index. 
Edit the demo-file and run the api.
