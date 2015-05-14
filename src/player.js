import { flatten, cloneDeep } from 'lodash'
import Renderer from './renderer'
import Clock from './clock'

const LOOKAHEAD = 10
const INTERVAL = 8
const DEFAULT_BPM = 120

function Player(script, options = {}) {

  const destsByPartName = new Map(
    (script.parts || []).map(part => [part.name, part.dests])
  )
  // const sectionNames = (script.sections || []).map(sec => sec.name)
  const bpm = options.bpm || DEFAULT_BPM
  const clock = Clock(INTERVAL)
  const bpMs = bpm / 60000
  let renderer
  let lastQueueEnd

  clock.on('pulse', enqueue)
  
  return { play, stop }

  function play() {
    if(clock.running) return
    renderer = Renderer(script)
    lastQueueEnd = 0
    clock.run()
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
    if(!clock.running) return
    clock.stop()
  }

  function enqueue(t) {
    const fromMs = lastQueueEnd
    const toMs = t + LOOKAHEAD
    lastQueueEnd = toMs
    const from = fromMs * bpMs
    const to = toMs * bpMs
    // if(sections.length) console.log([fromMs, toMs, from, to].join(' '))
    const evs = renderer.render(from, to)
    if(!(evs && evs.length)) return
    evs.forEach(ev => {
      destsByPartName.get(ev.source)
        .filter(dest => !dest.evType || ev.type === dest.evType)
        .forEach(dest => dest.fn())
    })


      part.fns.forEach(fn => {
        evs
          .filter(ev => !fn.evType || ev.type === fn.evType)
          .forEach(ev => merge(ev, fn.fn(ev)))
      })
    }
  }

}

export default Player