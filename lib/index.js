var path = require('path');
var os = require('os');
var _ = require('lodash');

function RX(options){
  if (!this instanceof  RX) {
    return new RX(options);
  }
  this.options = {
    cli: 'npm',
    registry: 'http://registry.npmjs.com/',
    root: path.join(os.tmpdir(), 'requirex-root'),
    infoTimeout: 10000, //10 s
    infoCacheTime: 36000, // 1h
    installTimeout: 1000 * 60 * 10 // 10min
  };

  options && this.config(options);
}

RX.prototype.info = require('./methods/info');
RX.prototype.install = require('./methods/install');
RX.prototype.resolve = require('./methods/resolve');
RX.prototype.config = require('./methods/config');
//RX.prototype.require = require('./methods/require');

_.extend(RX.prototype, require('./methods/lock'), require('./methods/link'));

module.exports = RX;