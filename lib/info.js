var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));

/**
 * get the info of an module from registry
 * @param name
 * @param v tag or version
 * @optional
 */
module.exports = function info(name, v) {
  var parts = [this.registry.replace(/\/$/, ''), name, v || 'latest'];
  return request.getAsync({
    url: parts.join('/'),
    json: true,
    timeout: this.options.infoTimeout
  }).spread(function (res, body) {
    if (res.statusCode !== 200) {
      throw new Error((body && body.error) || body || 'Registry return code ' + res.statusCode);
    }
    return res.body;
  });
};