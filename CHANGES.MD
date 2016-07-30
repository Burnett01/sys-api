List of notable changes:
---

## 30.07.2016

+ Added all restify bundled plugins
(acceptParser, dateParser, queryParser,  jsonp, gzipResponse, throttle, conditionalRequest)
+ Added pre() and use() methods which can be used by your api instance
+ The internal @server() wrapper takes a third argument (boolean) to skip use of a fn on a TLS instance. For example: If the gzipResponse plugin is used, it will not work on the TLS instance since GZIP in combination with TLS is prone to the BEAST attack. This API automatically protects you by skipping GZIP when used for TLS

## 27.07.2016

+ Ability to use custom HTTPS port (https://github.com/Cloud2Box/sys-api/wiki/HTTP-&-HTTPS-(TLS))

---

[more]

https://github.com/Cloud2Box/sys-api/commits/master