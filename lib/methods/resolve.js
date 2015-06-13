var semver = require('semver');
var path = require('path');

/**
 * resolve module by name
 * @param {String} module name of module
 * @returns {*}
 */
module.exports = function (module){
  var match = module.match(/^(@?[^@]+)@?(.+)?$/);

  if (!match) {
    throw new Error('module name not match');
  }

  var name = match[1];
  var v = match[2] || 'latest';
  var tag, version;

  if (!semver.valid(v)) {
    tag = v;
  } else {
    version = v;
  }
  return {
    name: name,
    version: version,
    tag: tag,
    absPath: path.join(this.options.root, name, tag ? path.join('dist-tags', tag) : version)
  }
};