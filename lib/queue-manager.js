var async = require('async');
var Promise = require('bluebird');

var queues = {};
exports.getQueue = function(name, worker, concurrency) {
  if (queues[name]) {
    return queues[name];
  }

  queues[name] = Promise.promisifyAll(async.queue(worker, concurrency), {
    filter: function(name){
      return name === 'push' || name === 'unshift';
    }
  });
  return queues[name];
};