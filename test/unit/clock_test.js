'use strict';

var h = require('../test_helper');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var createClock = proxyquire('../../dist/clock', { 'nanotimer': ProxyTimer });
var timerCallback;

describe('clock', function () {

  it('pulses after first interval when run', function () {
    var audioContext = { currentTime: 0 };
    var clock = createClock(audioContext);
    var spy = sinon.spy();
    clock.on('pulse', spy);
    clock.run();
    timerCallback();
    spy.should.have.callCount(1);
    clock.stop();
  });

  it('has a tempo and resolution that default to 120bpm at 24ppqn', function () {
    var audioContext = { currentTime: 0 };
    var clock = createClock(audioContext);
    clock.bpm.should.equal(120);
    clock.ppqn.should.equal(24);
  });

  it('takes tempo and resolution in its constructor', function () {
    var audioContext = { currentTime: 0 };
    var clock = createClock(audioContext, { ppqn: 4, bpm: 100 });
    clock.bpm.should.equal(100);
    clock.ppqn.should.equal(4);
    clock = createClock(audioContext, { ppqn: 4 });
    clock.bpm.should.equal(120);
    clock.ppqn.should.equal(4);
    clock = createClock(audioContext, { bpm: 100 });
    clock.bpm.should.equal(100);
    clock.ppqn.should.equal(24);
  });

  it('pulses at the correct tempo and resolution', function () {
    // Stupid clock that pulses once a second
    var audioContext = { currentTime: 0 };
    var clock = createClock(audioContext, { ppqn: 1, bpm: 60 });
    var spy = sinon.spy();
    clock.on('pulse', spy);
    clock.run();
    
    timerCallback();
    spy.should.have.callCount(1);
    
    // advance half a pulse, call count should be unchanged
    audioContext.currentTime = 0.5;
    timerCallback();
    spy.should.have.callCount(1);

    // advance just under half a pulse, call count should go up
    audioContext.currentTime = 0.999;
    timerCallback();
    spy.should.have.callCount(2);

    clock.stop();

    // advance a coudple of pulses, call count should be unchanged
    audioContext.currentTime = 3;
    timerCallback(); // <- this shouldn't happen as timer should be cancelled
    spy.should.have.callCount(2);
  });

});

function ProxyTimer() {
  this.setInterval = function (callback) {
    timerCallback = callback;
  };
  this.clearInterval = function () {};
}