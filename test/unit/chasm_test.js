'use strict';

var h = require('../test_helper');
var chasm = require('../../dist/chasm');

describe('chasm', function () {

  it('can get a player for a score', function () {
    chasm.getPlayerForScore(require('../test_song/test_song')).should.exist;
  });

});