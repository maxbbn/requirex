var expect = require('expect.js');

describe.skip('requirex', function () {
  var reqirex = require('../');

  it('should install lodash@1.0.0-rc.1 with npm', function (done) {


    this.timeout(10000);

    reqirex('lodash@1.0.0-rc.1', function (err, lodash) {
      if (err) return done(err);
      expect(lodash.VERSION).to.be('1.0.0-rc.1');
      done();
    });
  });
});