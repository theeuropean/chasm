'use strict';

var h = require('../test_helper');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var clock = proxyquire('../../dist/clock', { 'nanotimer': ProxyTimer });
var timerCallback;
var timerInterval;

describe('clock', function () {

  it('pulses when run and not when stopped', function () {
    var c = clock();
    var spy = sinon.spy();
    c.on('pulse', spy);
    c.run();
    timerCallback();
    spy.should.have.callCount(1);
    timerCallback();
    spy.should.have.callCount(2);
    c.stop();
    timerCallback(); // <- this shouldn't happen as timer should be cancelled
    spy.should.have.callCount(2);
  });

  it('has a tempo and resolution that default to 120bpm at 24ppqn', function () {
    var c = clock();
    c.bpm.should.equal(120);
    c.ppqn.should.equal(24);
    c = clock({ ppqn: 4, bpm: 100 });
    c.bpm.should.equal(100);
    c.ppqn.should.equal(4);
  });

  it('pulses at the correct tempo and resolution', function () {
    // Stupid clock that pulses once a second
    var c = clock({ ppqn: 1, bpm: 60 });
    c.run();
    timerInterval.should.equal('1s');
  });

});

function ProxyTimer() {
  this.setInterval = function (callback, _, interval) {
    timerCallback = callback;
    timerInterval = interval;
  };
  this.clearInterval = function () {};
}