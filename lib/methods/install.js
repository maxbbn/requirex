var tar = require('tar');
var request = require('request');
var zlib = require('zlib');
var spawn = require('../spawn-command');
var queueManager = require('../queue-manager');
var path = require('path');

/**
 * install module
 * @param module
 * @param module.name
 * @param module.version
 */
module.exports = function install(module) {

  var m = this.resolve(module);

  return this.info(m.name)
    .then(function (info) {
      var version = m.tag ? info['dist-tags'][m.tag] : m.version;
      if (!version) {
        throw new Error('module.tag (' + m.tag + ') is not found');
      }
      var mo = info.versions[version];

      if (!mo) {
        throw new Error('version (' + version + ') is not found in ' + m.name);
      }

      return this
        .isLock(m)
        .then(function (locked) {
          if (locked) {
            throw new Error('module is locked!');
          }
          return this.lock(m);
        }.bind(this))

        .then(function () {
          return queueManager
            .getQueue(['install', m.name].join('-'), installJob(this.options.cli, this.options.root))
            .pushAsync(mo)
        }.bind(this))
        .then(function(){
          if (m.tag) {
            return this.linkTag(m.name, mo.version, m.absPath);
          }
        }.bind(this))
        .finally(function(){
          return this.unlock(m)
        }.bind(this));
    }.bind(this));

};

function installJob(npmCli, root) {
  return function (job, cb) {
    var moduleBase = path.join(root, job.name);
    var versionBase = path.join(moduleBase, job.version);
    request(job.dist.tarball)
      .pipe(zlib.createGunzip())
      .pipe(tar.Extract({
        path: versionBase,
        strip: 1
      }))
      .on('error', cb)
      .on('finish', function () {
        var args = ['install', '-d', '--production'];

        var child = spawn(npmCli, args, {
          cwd: versionBase,
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
      });
  }
}