'use strict';

var h = require('../test_helper');
var sinon = require('sinon');
var osc = require('osc-min');
var dgram = require('dgram');
var chasm = require('../../dist/chasm');
var server = dgram.createSocket('udp4');

describe('playing a simple song over osc', function () {

  it('works', function (done) {
    server.bind(24276, function () {

      var spy = sinon.spy();

      server.on('message', function (msg) {
        var oscMsg = osc.fromBuffer(msg);
        spy(oscMsg.address, oscMsg.args);
      });

      chasm.piece('simple song')
        .part()
          .phrase()
            .gr('x--- x--- x--- x---', 1)
          .toOSC('', 'pitch');

      chasm.play('simple song');

      setTimeout(function () {
        chasm.stop();
        spy.should.have.callCount(4);
        spy.should.have.always.have.been.calledWith(
          '/part0/note',
          [ { type: 'float', value: 1 } ]
        );
        done();
      }, 1900);

    });
  });

});