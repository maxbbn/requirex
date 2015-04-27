var expect = require('expect.js');

describe('install', function () {
  var doInstall = require('../index').doInstall;
  var path = require('path');
  var fs = require('fs');
  var root = path.join('requirex-test');

  describe('lodash@2.4.0', function () {
    var fullName = 'lodash@2.4.0';
    var moduleName = fullName.replace(/@\d+.\d+.\d$/, '');
    var moduleDir = path.join(root, fullName);

    before(function (done) {
      this.timeout(30000);

      doInstall(fullName, {
        cwd: moduleDir
      }, done);

    });

    it('should pass install', function () {
      expect(fs.existsSync(moduleDir)).to.be(true);
      expect(fs.existsSync(path.join(moduleDir, 'node_modules', moduleName))).to.be(true);
    });
  });

});