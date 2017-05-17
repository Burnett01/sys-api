/*
The MIT License (MIT)

Product:      System API (SysAPI)
Description:  A modular System-API for NodeJS - RestifyJS

Copyright (c) 2015-2017 Steven Agyekum <agyekum@posteo.de>

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

function checkInter(inter) {
    expect(interAPI).to.have.property('fs');
    expect(interAPI.fs).to.be.a('object');
    expect(interAPI.fs).to.have.property('fs');
    expect(interAPI.fs.fs).to.be.a('object');
    expect(interAPI.fs).to.have.property('path');
    expect(interAPI.fs.path).to.be.a('object');
    expect(interAPI.fs).to.have.property('readFile');
    expect(interAPI.fs.readFile).to.be.a('function');
    expect(interAPI.fs).to.have.property('readDir');
    expect(interAPI.fs.readDir).to.be.a('function');

    expect(interAPI).to.have.property('net');
    expect(interAPI.net).to.be.a('object');
    expect(interAPI.net).to.have.property('net');
    expect(interAPI.net.net).to.be.a('object');
    expect(interAPI.net).to.have.property('isIP');
    expect(interAPI.net.isIP).to.be.a('function');
    expect(interAPI.net).to.have.property('isIPv4');
    expect(interAPI.net.isIPv4).to.be.a('function');
    expect(interAPI.net).to.have.property('isIPv6');
    expect(interAPI.net.isIPv6).to.be.a('function');

    expect(interAPI).to.have.property('os');
    expect(interAPI.os).to.be.a('object');
    expect(interAPI.os).to.have.property('os');
    expect(interAPI.os.os).to.be.a('object');
    expect(interAPI.os).to.have.property('system');
    expect(interAPI.os.system).to.be.a('object');
    expect(interAPI.os.system).to.have.property('hostname');
    expect(interAPI.os.system.hostname).to.be.a('function');
    expect(interAPI.os.system).to.have.property('type');
    expect(interAPI.os.system.type).to.be.a('function');
    expect(interAPI.os.system).to.have.property('platform');
    expect(interAPI.os.system.platform).to.be.a('function');
    expect(interAPI.os.system).to.have.property('arch');
    expect(interAPI.os.system.arch).to.be.a('function');
    expect(interAPI.os.system).to.have.property('release');
    expect(interAPI.os.system.release).to.be.a('function');
    expect(interAPI.os.system).to.have.property('eol');
    expect(interAPI.os.system.eol).to.be.a('string');
    expect(interAPI.os.system).to.have.property('uptime');
    expect(interAPI.os.system.uptime).to.be.a('function');
    expect(interAPI.os.system).to.have.property('loadavg');
    expect(interAPI.os.system.loadavg).to.be.a('function');
    expect(interAPI.os.system).to.have.property('memory');
    expect(interAPI.os.system.memory).to.be.a('object');
    expect(interAPI.os.system.memory).to.have.property('total');
    expect(interAPI.os.system.memory.total).to.be.a('function');
    expect(interAPI.os.system.memory).to.have.property('free');
    expect(interAPI.os.system.memory.free).to.be.a('function');
    expect(interAPI.os.system).to.have.property('cpus');
    expect(interAPI.os.system.cpus).to.be.a('function');
    expect(interAPI.os.system).to.have.property('networkInterfaces');
    expect(interAPI.os.system.networkInterfaces).to.be.a('function');

    expect(interAPI.os).to.have.property('users');
    expect(interAPI.os.users).to.be.a('object');
    expect(interAPI.os.users).to.have.property('all');
    expect(interAPI.os.users.all).to.be.a('function');
    expect(interAPI.os.users).to.have.property('get');
    expect(interAPI.os.users.get).to.be.a('function');
    expect(interAPI.os.users).to.have.property('add');
    expect(interAPI.os.users.add).to.be.a('function');
    expect(interAPI.os.users).to.have.property('lock');
    expect(interAPI.os.users.lock).to.be.a('function');
    expect(interAPI.os.users).to.have.property('unlock');
    expect(interAPI.os.users.unlock).to.be.a('function');
    expect(interAPI.os.users).to.have.property('del');
    expect(interAPI.os.users.del).to.be.a('function');

    expect(interAPI.os).to.have.property('groups');
    expect(interAPI.os.groups).to.be.a('object');
    expect(interAPI.os.groups).to.have.property('all');
    expect(interAPI.os.groups.all).to.be.a('function');
    expect(interAPI.os.groups).to.have.property('get');
    expect(interAPI.os.groups.get).to.be.a('function');
    expect(interAPI.os.groups).to.have.property('add');
    expect(interAPI.os.groups.add).to.be.a('function');
    expect(interAPI.os.groups).to.have.property('del');
    expect(interAPI.os.groups.del).to.be.a('function');
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
