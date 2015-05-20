var Promise = require('bluebird');
var fs = require('fs');
fs.mkdirp = require('mkdirp');

fs = Promise.promisifyAll(fs);

fs.existsAsync = function(file){
  return new Promise(function(resolve){
    fs.exists(file, resolve);
  });
};

module.exports = fs;