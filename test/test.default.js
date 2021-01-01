/*
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2021 Steven Agyekum <agyekum@posteo.de>

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

var expect = require("chai").expect;
var API = require('../src/API');

var api = new API({
    /* 'plugins.root' : ['/plugins/', '/home/user/plugins/'] */
    /* 'plugins.autoload' : true, */
    /* 'logger' : 'dev' */
});

var interAPI = API;

const myValidator = arg => {}

api.validator({
    enabled: true,
    customValidators: {
        myValidator
    }
})

function checkInter(inter) {
    expect(inter).to.have.property('fs');
    expect(inter.fs).to.be.a('object');
    expect(inter.fs).to.have.property('fs');
    expect(inter.fs.fs).to.be.a('object');
    expect(inter.fs).to.have.property('path');
    expect(inter.fs.path).to.be.a('object');
    expect(inter.fs).to.have.property('readFile');
    expect(inter.fs.readFile).to.be.a('function');
    expect(inter.fs).to.have.property('readDir');
    expect(inter.fs.readDir).to.be.a('function');

    expect(inter).to.have.property('net');
    expect(inter.net).to.be.a('object');
    expect(inter.net).to.have.property('net');
    expect(inter.net.net).to.be.a('object');
    expect(inter.net).to.have.property('isIP');
    expect(inter.net.isIP).to.be.a('function');
    expect(inter.net).to.have.property('isIPv4');
    expect(inter.net.isIPv4).to.be.a('function');
    expect(inter.net).to.have.property('isIPv6');
    expect(inter.net.isIPv6).to.be.a('function');

    expect(inter).to.have.property('os');
    expect(inter.os).to.be.a('object');
    expect(inter.os).to.have.property('os');
    expect(inter.os.os).to.be.a('object');
    expect(inter.os).to.have.property('system');
    expect(inter.os.system).to.be.a('object');
    expect(inter.os.system).to.have.property('hostname');
    expect(inter.os.system.hostname).to.be.a('function');
    expect(inter.os.system).to.have.property('type');
    expect(inter.os.system.type).to.be.a('function');
    expect(inter.os.system).to.have.property('platform');
    expect(inter.os.system.platform).to.be.a('function');
    expect(inter.os.system).to.have.property('arch');
    expect(inter.os.system.arch).to.be.a('function');
    expect(inter.os.system).to.have.property('release');
    expect(inter.os.system.release).to.be.a('function');
    expect(inter.os.system).to.have.property('eol');
    expect(inter.os.system.eol).to.be.a('string');
    expect(inter.os.system).to.have.property('uptime');
    expect(inter.os.system.uptime).to.be.a('function');
    expect(inter.os.system).to.have.property('loadavg');
    expect(inter.os.system.loadavg).to.be.a('function');
    expect(inter.os.system).to.have.property('memory');
    expect(inter.os.system.memory).to.be.a('object');
    expect(inter.os.system.memory).to.have.property('total');
    expect(inter.os.system.memory.total).to.be.a('function');
    expect(inter.os.system.memory).to.have.property('free');
    expect(inter.os.system.memory.free).to.be.a('function');
    expect(inter.os.system).to.have.property('cpus');
    expect(inter.os.system.cpus).to.be.a('function');
    expect(inter.os.system).to.have.property('networkInterfaces');
    expect(inter.os.system.networkInterfaces).to.be.a('function');

    expect(inter.os).to.have.property('users');
    expect(inter.os.users).to.be.a('object');
    expect(inter.os.users).to.have.property('all');
    expect(inter.os.users.all).to.be.a('function');
    expect(inter.os.users).to.have.property('get');
    expect(inter.os.users.get).to.be.a('function');
    expect(inter.os.users).to.have.property('add');
    expect(inter.os.users.add).to.be.a('function');
    expect(inter.os.users).to.have.property('lock');
    expect(inter.os.users.lock).to.be.a('function');
    expect(inter.os.users).to.have.property('unlock');
    expect(inter.os.users.unlock).to.be.a('function');
    expect(inter.os.users).to.have.property('del');
    expect(inter.os.users.del).to.be.a('function');

    expect(inter.os).to.have.property('groups');
    expect(inter.os.groups).to.be.a('object');
    expect(inter.os.groups).to.have.property('all');
    expect(inter.os.groups.all).to.be.a('function');
    expect(inter.os.groups).to.have.property('get');
    expect(inter.os.groups.get).to.be.a('function');
    expect(inter.os.groups).to.have.property('add');
    expect(inter.os.groups.add).to.be.a('function');
    expect(inter.os.groups).to.have.property('del');
    expect(inter.os.groups.del).to.be.a('function');
}

describe('Sys-API [CORE] Tests', function() {

    it('checks whether API class extends Restify error classes', function(done) {

        expect(interAPI).to.have.property('error');
        expect(interAPI.error).to.be.a('object');

        done();
    });

    it('checks API class for core addons', function(done) {

        checkInter(interAPI);

        done();
    });

    it('checks API class for plugin helper', function(done) {

        expect(interAPI).to.have.property('plugins');
        expect(interAPI.plugins).to.be.a('function');
        expect(interAPI.plugins()).to.have.property('load_dir');
        expect(interAPI.plugins().load_dir).to.be.a('function');
        expect(interAPI.plugins()).to.have.property('setup');
        expect(interAPI.plugins().setup).to.be.a('function');

        done();
    });


});

describe('Sys-API [api-instance] Tests', function() {

    it('checks api-instance class for core addons', function(done) {

        interAPI = api;

        checkInter(interAPI);

        done();
    });

    it('checks api-instance for methods', function(done) {

        expect(interAPI).to.have.property('listen');
        expect(interAPI.listen).to.be.a('function');
        expect(interAPI).to.have.property('connect');
        expect(interAPI.connect).to.be.a('function');
        expect(interAPI).to.have.property('pre');
        expect(interAPI.pre).to.be.a('function');
        expect(interAPI).to.have.property('use');
        expect(interAPI.use).to.be.a('function');
       
        done();
    });

    it('checks api-instance for bundled plugins (methods)', function(done) {

        expect(interAPI).to.have.property('auth');
        expect(interAPI.auth).to.be.a('function');
        expect(interAPI).to.have.property('validator');
        expect(interAPI.validator).to.be.a('function');
        expect(interAPI).to.have.property('cors');
        expect(interAPI.cors).to.be.a('function');
        expect(interAPI).to.have.property('bodyParser');
        expect(interAPI.bodyParser).to.be.a('function');
        expect(interAPI).to.have.property('acceptParser');
        expect(interAPI.acceptParser).to.be.a('function');
        expect(interAPI).to.have.property('dateParser');
        expect(interAPI.dateParser).to.be.a('function');
        expect(interAPI).to.have.property('queryParser');
        expect(interAPI.queryParser).to.be.a('function');
        expect(interAPI).to.have.property('jsonp');
        expect(interAPI.jsonp).to.be.a('function');
        expect(interAPI).to.have.property('gzipResponse');
        expect(interAPI.gzipResponse).to.be.a('function');
        expect(interAPI).to.have.property('requestExpiry');
        expect(interAPI.requestExpiry).to.be.a('function');
        expect(interAPI).to.have.property('throttle');
        expect(interAPI.throttle).to.be.a('function');
        expect(interAPI).to.have.property('conditionalRequest');
        expect(interAPI.conditionalRequest).to.be.a('function');
        expect(interAPI).to.have.property('auditLogger');
        expect(interAPI.auditLogger).to.be.a('function');
        expect(interAPI).to.have.property('requestLogger');
        expect(interAPI.requestLogger).to.be.a('function');
        expect(interAPI).to.have.property('sanitizePath');
        expect(interAPI.sanitizePath).to.be.a('function');
        expect(interAPI).to.have.property('serveStatic');
        expect(interAPI.serveStatic).to.be.a('function');
        expect(interAPI).to.have.property('fullResponse');
        expect(interAPI.fullResponse).to.be.a('function');
        expect(interAPI).to.have.property('jsonBodyParser');
        expect(interAPI.jsonBodyParser).to.be.a('function');
        expect(interAPI).to.have.property('multipartBodyParser');
        expect(interAPI.multipartBodyParser).to.be.a('function');
        expect(interAPI).to.have.property('urlEncodedBodyParser');
        expect(interAPI.urlEncodedBodyParser).to.be.a('function');
 
        done();
    });

    it('checks api-instance for HTTP methods', function(done) {

        expect(interAPI).to.have.property('head');
        expect(interAPI.head).to.be.a('function');
        expect(interAPI).to.have.property('get');
        expect(interAPI.get).to.be.a('function');
        expect(interAPI).to.have.property('post');
        expect(interAPI.post).to.be.a('function');
        expect(interAPI).to.have.property('put');
        expect(interAPI.put).to.be.a('function');
        expect(interAPI).to.have.property('del');
        expect(interAPI.del).to.be.a('function');
        
        done();
    });

    it('checks api-instance for ".instances" property', function(done) {

        expect(interAPI).to.have.property('instances');
        expect(interAPI.instances).to.be.a('array');
        
        done();
    });

});
