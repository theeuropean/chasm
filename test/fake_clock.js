module.exports = createFakeClockFactory

const _ = require('lodash')

function createFakeClockFactory() {

  let interval
  let callback
  let t

  return { runFor, continueFor, create }

  function runFor(seconds) {
    t = 0
    continueFor(seconds)
  }

  function continueFor(seconds) {
    const count = Math.floor((seconds * 1000) / interval)
    _.times(count, () => {
      callback(t)
      t = t + interval
    })    
  }

  function create(_interval) {
    interval = _interval
    return {
      on: function (_, _callback) {
        callback = _callback
      },
      run: function () {},
      stop: function () {}
    }
  }

}