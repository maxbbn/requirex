var _ = require('lodash');
var path = require('path');
var os = require('os');

function RX(options){
  this.options = _.defaults(options || {}, {
    cli: 'npm',
    registry: 'http://registry.npmjs.com/',
    root: path.join(os.tmpdir(), 'requirex-root'),
    infoTimeout: 10000, //10 s
    installTimeout: 1000 * 60 * 10 // 10min
  });

  this.registry = this.options.registry;
  this.root = this.options.root;
  this.cli = this.options.cli;
}

RX.prototype.info = require('./info');
RX.prototype.install = require('./install');
RX.prototype.resolve = require('./resolve');


module.exports = RX;