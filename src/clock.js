module.exports = createClock;

let Timer = require('nanotimer');
let EventEmitter = require('eventemitter2').EventEmitter2;
let {
  create
} = require('lodash');

function createClock({ ppqn = 24, bpm = 120 } = {}) {
  
  let pulseLength = (60 / bpm) / ppqn;
  let running = false;
  // let lookahead = 0.003;
  // let nextPulse;
  // let lastPing = nextPing;
  let timer = new Timer();

  function run() {
    if(running) return;
    running = true;
    // nextPulse = audioContext.currentTime;
    // timer.setInterval(poll, null, '1ms');
    timer.setInterval(pulse, null, `${ pulseLength }s`);
  }

  function stop() {
    if(!running) return;
    running = false;
    timer.clearInterval();
  }

  // function poll() {
  //   if(!running) return;
  //   var t = audioContext.currentTime;
  //   if((t + lookahead) > nextPulse) {
  //     // t = nextPulse;
  //     nextPulse = nextPulse + pulseLength;
  //     pulse();
  //   };
  // }

  function pulse() {
    if(!running) return;
    self.emit('pulse');
  }

  // function logElapsed() {
  //   var ct = context.currentTime;
  //   console.log(ct - lastPing);
  //   lastPing = ct;
  // }

  let self = create(EventEmitter.prototype, {
    run,
    stop,
    get bpm() { return bpm; },
    get ppqn() { return ppqn; }
  });

  return self;

};