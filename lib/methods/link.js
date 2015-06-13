var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var debug = require('debug')('rx-linkTag');

/**
 * link tag dir to version dir
 * @param name
 * @param version
 * @param where
 * @returns {*}
 */
exports.linkTag = function (name, version, where) {
  if (!name || !version || !where) {
    return Promise.reject(new Error('#linkTag no name or version or dist provide'))
  }
  var src = path.resolve(this.options.root, name, version);

  return fs.existsAsync(src)
    .then(function (exists) {
      if (!exists) {
        throw new Error('module is not installed [' + [name, version].join('@') + ']')
      }
    })
    .then(function(){
      return fs
        .mkdirpAsync(path.dirname(where))
    })
    .then(function(){
      return fs
        .lstatAsync(where)
    })
    .then(function(stats){
      if (stats.isSymbolicLink() || stats.isFile()) {
        debug('clean old link');
        return fs.unlinkAsync(where);
      } else {
        throw new Error(where + ' is not link or file, please remove it first');
      }
    })
    .catch(function(err){
      if (err.code !== 'ENOENT') {
        throw err;
      }
    })
    .then(function(){
      debug('link');
      return fs
        .symlinkAsync(src, where, 'dir');
    })
};