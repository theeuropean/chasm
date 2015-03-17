"use strict";
module.exports = createClock;
var Timer = require('nanotimer');
var EventEmitter = require('eventemitter2').EventEmitter2;
var create = require('lodash').create;
function createClock() {
  var $__2,
      $__3;
  var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
      ppqn = ($__2 = $__1.ppqn) === void 0 ? 24 : $__2,
      bpm = ($__3 = $__1.bpm) === void 0 ? 120 : $__3;
  var pulseLength = (60 / bpm) / ppqn;
  var running = false;
  var timer = new Timer();
  function run() {
    if (running)
      return;
    running = true;
    timer.setInterval(pulse, null, (pulseLength + "s"));
  }
  function stop() {
    if (!running)
      return;
    running = false;
    timer.clearInterval();
  }
  function pulse() {
    if (!running)
      return;
    self.emit('pulse');
  }
  var self = create(EventEmitter.prototype, {
    run: run,
    stop: stop,
    get bpm() {
      return bpm;
    },
    get ppqn() {
      return ppqn;
    }
  });
  return self;
}
;
