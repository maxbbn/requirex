// 基于模块的锁

var path = require('path');
var fs = require('../fs');

exports._lockFile = function(module){
  return path.join(this.options.root, module.name, 'update.lock');
};

exports.lock = function(module){
  var lockFile = this._lockFile(module);
  return fs.mkdirpAsync(path.dirname(lockFile))
      .then(function(){
        return fs.writeFileAsync(lockFile, '', 'utf8')
      });
};

exports.unlock = function(module){
  var lockFile = this._lockFile(module);
  return fs.unlinkAsync(lockFile);
};

exports.isLock = function(module){
  var lockFile = this._lockFile(module);
  return fs.existsAsync(lockFile);
};