import { flatten } from 'lodash'
import Renderer from './renderer'
import Clock from './clock'
// import { send } from './osc'

const LOOKAHEAD = 10
const INTERVAL = 8
const DEFAULT_BPM = 120

function Player(script, options = {}) {

  // const dests = new Map(
  //   (script.parts || []).map(part => [part.name, part.dest])
  // )
  // const sectionNames = (script.sections || []).map(sec => sec.name)
  const bpm = options.bpm || DEFAULT_BPM
  const clock = Clock(INTERVAL)
  const bpMs = bpm / 60000
  // const oscPrefix = script.name ? `/${ script.name }` : ''
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
    const occs = renderer.render(from, to)
    // occs.forEach(sendOSC)
  }

  // function sendOSC(occ) {
  //   const address = `${ oscPrefix }/${ occ.source }/${ occ.ev.type }`
  //   const args = dests.get(occ.source).argNames.map(an => occ.ev.data[an])
  //   send({
  //     address,
  //     args,
  //     udpAddress: 'localhost',
  //     port: 24276
  //   })
  // }

}

export default Player