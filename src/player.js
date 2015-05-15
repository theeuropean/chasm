const { flatten, cloneDeep } = require('lodash')
const renderer = require('./renderer')
const clock = require('./clock')

const LOOKAHEAD = 10
const INTERVAL = 8
const DEFAULT_BPM = 120

function player(script, options = {}) {
  
  const destsByPartName = getDestsByPartName()
  // const sectionNames = (script.sections || []).map(sec => sec.name)
  const bpm = options.bpm || DEFAULT_BPM
  const clk = clock(INTERVAL)
  const bpMs = bpm / 60000
  let rndr
  let lastQueueEnd

  clk.on('pulse', enqueue)
  
  function play() {
    if(clk.running) return
    rndr = renderer(script)
    lastQueueEnd = 0
    clk.run()
  }

  // function change(command) {
  //   const segments = command.split('/')
  //   const sectionName = segments.length && sectionNames.includes(segments[0]) && segments[0]
  //   if(sectionName) {
  //     if(segments[1] === 'play') {
  //       renderer.changeSection(sectionName)
  //     }
  //   }
  // }

  function stop() {
    if(!clk.running) return
    clk.stop()
  }

  function enqueue(t) {
    const fromMs = lastQueueEnd
    const toMs = t + LOOKAHEAD
    lastQueueEnd = toMs
    const from = fromMs * bpMs
    const to = toMs * bpMs
    // if(sections.length) console.log([fromMs, toMs, from, to].join(' '))
    const evs = rndr.render(from, to)
    if(!(evs && evs.length)) return
    for(let ev of evs) {
      let dests = destsByPartName.get(ev.source)
      if(!(dests && dests.length)) return
      dests
        .filter(dest => !dest.evType || ev.type === dest.evType)
        .forEach(dest => dest.dispatchFn(cloneDeep(ev)))
    }
  }

  // For every part dest, add a dispatch function by calling
  // the dest's higher-order initialization function
  // then return a map of part names to dest arrays
  function getDestsByPartName() {
    const parts = script.parts || []
    for(let part of parts) {
      if(part.dests) {
        for(let dest of part.dests) {
          dest.dispatchFn = dest.fn()
        }
      }
    }
    return new Map(
      parts.map(part => [part.name, part.dests])
    )
  }

  return { play, stop }

}

module.exports = player