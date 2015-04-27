var expect = require('expect.js');
var nock = require('nock');
var path = require('path');

describe.only('RX', function () {
  var RX = require('../lib/index');
  var rx = new RX({
    root: 'ROOT',
    infoTimeout: 200000,
    cli: 'cnpm',
    registry: 'https://r.cnpmjs.org'
  });

  describe('#info', function () {

    before(function () {
      nock(rx.registry)
        .get('/lodash/latest')
        .replyWithFile(200, path.join(__dirname, './fixtures/lodash/latest.json'))
    });

    after(function () {
      nock.cleanAll();
    });

    it('should read info', function () {
      return rx.info('lodash')
        .then(function(info){
          expect(info.name).to.be('lodash');
        })
    });
  });


  describe('#resolve', function () {
    this.timeout(8000);

    before(function () {

      nock('https://r.cnpmjs.org')
        .get('/lodash/latest').times(2)
        .replyWithFile(200, path.join(__dirname, 'fixtures/lodash/latest.json'))
        .get('/lodash/0.3.2')
        .replyWithFile(200, path.join(__dirname, 'fixtures/lodash/0.3.2.json'))
    });

    after(function () {
      nock.cleanAll();
    });

      it('should resolve with version', function () {
      return rx.resolve('lodash@0.3.2')
        .then(function(module){
          expect(module).to.be.an('object');
          expect(module.name).to.be('lodash');
          expect(module.version).to.be('0.3.2');
          expect(module.tag).to.be.an('undefined');
        })
    });

    it('should read info', function () {
      return rx.resolve('lodash')
        .then(function(module){
          expect(module).to.be.an('object');
          expect(module.name).to.be('lodash');
          expect(module.version).to.match(/^\d+\.\d+\.\d+$/);
          expect(module.tag).to.be('latest');
        })
    });

    it('should read info with tag', function () {
      return rx.resolve('lodash@latest')
        .then(function(module){
          expect(module).to.be.an('object');
          expect(module.name).to.be('lodash');
          expect(module.version).to.match(/^\d+\.\d+\.\d+$/);
          expect(module.tag).to.be('latest');
        })
    });
  });

  describe('#install', function () {
    this.timeout(20000);
    before(function () {
      nock(rx.registry)
        .get('/mkdirp/latest')
        .replyWithFile(200, path.join(__dirname, 'fixtures/mkdirp/latest.json'));

      nock('https://r.cnpmjs.org')
        .get('/mkdirp/download/mkdirp-0.5.0.tgz')
        .replyWithFile(200, path.join(__dirname, 'fixtures/mkdirp/mkdirp-0.5.0.tgz'))
    });

    after(function () {
      nock.cleanAll();
    });

    it('should install', function () {
      return rx.install('mkdirp');
    });
  });
});