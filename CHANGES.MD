List of notable changes:
---

## 17.04.2017

+ The ``connect()`` method was renamed to ``listen()``.
+ Added ``anon`` property to allow anonymous access

To keep compatibility you can still use the old name.

## 14.01.2017

+ Moved passwd-groups plugin to package.json (dependencies). It is no longer included but available in this project.


## 20.09.2016

+ (Fixed) In previous versions, the third argument (notls) of the internal server() wrapper did not register bundled-plugins. This is fixed now.

## 30.07.2016

+ Added all restify bundled plugins
(acceptParser, dateParser, queryParser,  jsonp, gzipResponse, throttle, conditionalRequest)
+ Added pre() and use() methods which can be used by your api instance
+ The internal @server() wrapper takes a third argument (boolean) to skip use of a fn on a TLS instance. For example: If the gzipResponse plugin is used, it will not work on the TLS instance since GZIP in combination with TLS is prone to the BEAST attack. This API automatically protects you by skipping GZIP when used for TLS

## 27.07.2016

+ Ability to use custom HTTPS port (https://github.com/Burnett01/sys-api/wiki/HTTP-&-HTTPS-(TLS))

---

[more]

https://github.com/Burnett01/sys-api/commits/master