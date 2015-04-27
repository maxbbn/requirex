var expect = require('expect.js');

describe
('parse-name', function () {
  var parseModule = require('../index').parseModule;

  describe('lodash@1.1.1', function () {
    it('should parse normal name', function (done) {
      parseModule('lodash@1.1.1', {
        root: '/root'
      }, function (err, module) {
        if (err) {
          done(err);
          return;
        }
        expect(module.name).to.eql('lodash');
        expect(module.version).to.eql('1.1.1');
        expect(module.origin).to.eql('lodash@1.1.1');
        expect(module.origin).to.eql('lodash@1.1.1');
        expect(module.installRoot).to.eql('/root/lodash@1.1.1');
        expect(module.packageRoot).to.eql('/root/lodash@1.1.1/node_modules/lodash');
        done();
      });
    });
  });

  describe('@ali/some-module@0.0.100', function () {
    it('should parse normal name', function (done) {
      parseModule('@ali/some-module@0.0.100', {
        root: '/root'
      }, function (err, module) {
        if (err) {
          done(err);
          return;
        }
        expect(module.name).to.eql('@ali/some-module');
        expect(module.version).to.eql('0.0.100');
        expect(module.origin).to.eql('@ali/some-module@0.0.100');
        expect(module.installRoot).to.eql('/root/@ali/some-module@0.0.100');
        expect(module.packageRoot).to.eql('/root/@ali/some-module@0.0.100/node_modules/@ali/some-module');
        done();
      });
    });
  });

});