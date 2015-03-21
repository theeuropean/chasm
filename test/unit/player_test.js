'use strict';

var h = require('../test_helper');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var _ = require('lodash');
var oscSendSpy = sinon.spy();
var player = proxyquire('../../dist/player', {
  './clock': mockClock,
  './osc': { send: oscSendSpy }
});
var piece = require('../../dist/piece');
var clockCallback;

describe('player', function () {

  it('can play a piece', function () {
    var p = piece('simple song')
      .part()
        .phrase()
          .gr('x--- x--- x--- x---', 1)
        .toOSC('', 'pitch');
    var pl = player(p);
    pl.play();
    _.times(97, clockCallback);
    oscSendSpy.should.have.callCount(5);
    oscSendSpy.should.have.always.have.been.calledWith({
      address: '/part0/note',
      args: [1],
      port: 24276,
      udpAddress: 'localhost'
    });
  });

});

function mockClock() {
  return {
    on: function (_, callback) {
      clockCallback = callback;
    },
    run: function () {},
    stop: function () {}
  };
}