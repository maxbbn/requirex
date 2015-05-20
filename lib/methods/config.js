var _ = require('lodash');


/**
 * get or set config
 * @optional
 */
module.exports = function config(options) {
  if (!options) {
    return this.options;
  }

  _.extend(this.options, options);
};