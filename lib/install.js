var tar = require('tar');
var request = require('request');
var zlib = require('zlib');
var spawn = require('child_process').spawn;

var queueManager = require('./queue-manager');

/**
 * install module
 * @param module
 * @param cb
 */
module.exports = function install(module) {

  return this.resolve(module)
    .then(function(mo) {
      var queue = queueManager.getQueue(['install', module.name, module.version].join('-'), function(job, cb){
        request(job.dist.tarball)
          .pipe(zlib.createGunzip())
          .pipe(tar.Extract({
            path: job.path,
            strip: 1
          }))
          .on('error', cb)
          .on('finish', function(){
            var args = ['install', '-d', '--production'];

            var cmd = this.cli;

            var child = spawn(cmd, args, {
              cwd: job.path,
              stdio: 'inherit'
            });

            child.on('error', cb);

            child.on('exit', function (code) {
              if (code > 0) {
                cb(new Error('exit with code ' + code));
              } else {
                cb(null);
              }
            });
          }.bind(this));
      }.bind(this));

      return queue.pushAsync(mo);

    }.bind(this))
};