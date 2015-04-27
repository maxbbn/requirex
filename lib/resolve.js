var Promise = require('bluebird');
var semver = require('semver');
var path = require('path');


module.exports = function (module){
  var match = module.match(/^(@?[^@]+)@?(.+)?$/);
  if (!match) {
    return Promise.reject(new Error('module name not match'));
  }

  var name = match[1];
  var v = match[2] || 'latest';

  var tag;

  if (!semver.valid(v)) {
    tag = v;
  }

  return this.info(name, v)
    .then(function (info) {
      return {
        name: info.name,
        version: info.version,
        tag: tag,
        path: path.join(this.root, info.name, info.version),
        dist: info.dist
      };
    }.bind(this));
};