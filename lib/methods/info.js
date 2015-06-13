var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var path = require('path');
var fs = require('../fs');

/**
 * Get the info of an module from registry
 * with fs cache
 * @param name
 * @optional
 */
module.exports = function info(name) {
  var cacheFile = path.join(this.options.root, name, 'package.cache.json');
  var infoTimeout = this.options.infoTimeout;
  var infoCacheTime = this.options.infoCacheTime;
  var registry = this.options.registry.replace(/\/$/, '');

  function doUpdate() {
    var url = [registry, name];
    return request.getAsync({
        url: url.join('/'),
        json: true,
        timeout: infoTimeout
      })
      .spread(function (res, body) {
        if (res.statusCode !== 200) {
          throw new Error((body && body.error) || body || 'Registry return code ' + res.statusCode);
        }
        return res.body;
      })
      .then(function(body){

        return fs.mkdirpAsync(path.dirname(cacheFile))
          .then(function(){
            return fs.writeFileAsync(cacheFile, JSON.stringify(body, null, 2))
          })
          .then(function(){
            return body;
          })
      });
  }

  return fs.statAsync(cacheFile)
    .then(function(stat){
      if (Date.now() - stat.mtime >= infoCacheTime) {
        return doUpdate().bind(this);
      }

      return fs.readFileAsync(cacheFile)
        .then(JSON.parse)
        .catch(function(){
          return doUpdate().bind(this);
        });

    }.bind(this), function(err){
      if (err.code === 'ENOENT') {
        return doUpdate().bind(this);
      }
      throw err;
    }.bind(this));
};