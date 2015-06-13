var _ = require('lodash');
var fs = require('../fs');
var Promise = require('bluebird');
var path = require('path');


/**
 * require by module name
 * @optional
 */
module.exports = function require(module) {
  var options = this.options;
  var moduleInfo = this.resolve(module);
  var getVersion;

  if(moduleInfo.tag) {
    getVersion = fs.readFileAsync(path.join(options.root, moduleInfo.name, '.tag-' + moduleInfo.tag), 'utf8')
  } else {
    getVersion = Promise.resolve(moduleInfo.version)
  }

  return getVersion
    .then(function(version){
      var modulePath = path.join(options.root, moduleInfo.name, version);
      return fs.existsAsync(path.join(modulePath, 'package.json'))
        .then(function(exists){
          if (exists) {
            return  require(modulePath);
          } else {
            throw new Error('module is not install');
          }
        })
    });
};