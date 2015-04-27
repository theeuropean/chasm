module.exports = createClock

const { bindAll } = require('lodash')
const EventEmitter = require('eventemitter2').EventEmitter2

function createClock(interval) {
  
  const { emit, on } = bindAll(new EventEmitter({ wildcard: false }))
  let running = false
  let timer
  let origin

  return {
    run, stop, on,
    get running() { return running }
  }

  function run() {
    if(running) return
    running = true
    origin = timeInMs()
    timer = setInterval(pulse, interval)
    setImmediate(pulse)
  }

  function stop() {
    if(!running) return
    running = false
    origin = null
    clearInterval(timer)
    timer = null
  }

  function pulse() {
    if(!running) return
    emit('pulse', timeInMs() - origin)
  }

  function timeInMs() {
    const [s, ns] = process.hrtime()
    return (s * 1000) + (ns / 1000000)
  }

}