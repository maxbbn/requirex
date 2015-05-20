var expect = require('expect.js');
var nock = require('nock');
var path = require('path');
var fs = require('../lib/fs');

describe('RX', function () {
  var registry = 'https://r.cnpmjs.org';
  var RX = require('../lib/index');
  describe('#info', function () {

    before(function () {
      this.rx = new RX({
        root: 'ROOT',
        infoCacheTime: 1000,
        cli: 'cnpm',
        registry: registry
      });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should read info', function () {
      var scope = nock(registry)
        .get('/lodash')
        .replyWithFile(200, path.join(__dirname, './fixtures/lodash/info.json'));

      return this.rx.info('lodash')
        .then(function(info){
          expect(info.name).to.be('lodash');
          expect(scope.isDone()).to.be(true);
        });
    });

    it('should read from cache', function () {
      return this.rx.info('lodash')
        .then(function(info){
          expect(info.name).to.be('lodash');
        });
    });

    it('timeout 1000', function (done) {
      setTimeout(done, 1000);
    });

    it('should update again', function () {
      var scope = nock(registry)
        .get('/lodash')
        .replyWithFile(200, path.join(__dirname, './fixtures/lodash/info.json'));

      return this.rx.info('lodash')
        .then(function(info){
          expect(info.name).to.be('lodash');
          expect(scope.isDone(), 'isDone').to.be(true);
        });
    });
  });


  describe('#resolve', function () {

    before(function(){
      this.rx = new RX({
        root: 'ROOT'
      });
    });


    it('should resolve with version', function () {
      var m = this.rx.resolve('lodash@0.3.2');
      expect(m.name).to.be('lodash');
      expect(m.version).to.be('0.3.2');
      expect(m.tag).to.not.be.ok();
    });

    it('should resolve moduleName', function () {
      var m = this.rx.resolve('lodash');
      expect(m.name).to.be('lodash');
      expect(m.version).to.not.be.ok();
      expect(m.tag).to.be('latest');
    });



    it('should read info with tag', function () {
      var m = this.rx.resolve('lodash@beta');
      expect(m.name).to.be('lodash');
      expect(m.version).to.not.be.ok();
      expect(m.tag).to.be('beta');
    });
  });

  describe('#install', function () {
    before(function () {
      this.rx = new RX({
        root: 'ROOT',
        cli: 'cnpm',
        registry: registry
      });
    });

    this.timeout(20000);

    afterEach(function () {
      nock.cleanAll();
    });

    it('should install', function () {
      nock(registry)
        .get('/mkdirp')
        .replyWithFile(200, path.join(__dirname, 'fixtures/mkdirp/info.json'));
      nock(registry)
        .get('/mkdirp/download/mkdirp-0.5.0.tgz')
        .replyWithFile(200, path.join(__dirname, 'fixtures/mkdirp/mkdirp-0.5.0.tgz'));

      return this.rx.install('mkdirp');
    });
  });


  describe('lock', function () {
    before(function () {
      this.rx = new RX({
        root: 'ROOT'
      });
    });

    it('should read lock', function () {
      return this.rx.isLock({name: 'nameIsNotImportant'}).then(function(lock){
        expect(lock).to.be(false);
      });
    });

    it('should lock', function () {
      return this.rx.lock({
          name: 'nameIsNotImportant'
        })
        .then(function(){
          return this.rx.isLock({
            name: 'nameIsNotImportant'
          })
        }.bind(this))
        .then(function(lock){
          expect(lock).to.be(true);
        });
    });

    it('should unlock', function () {
      return this.rx.unlock({
          name: 'nameIsNotImportant'
        })
        .then(function(){
          return this.rx.isLock({
            name: 'nameIsNotImportant'
          })
        }.bind(this))
        .then(function(lock){
          expect(lock).to.be(false);
        });
    });

  });
});