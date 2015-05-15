const { send: sendOSC } = require('./osc')
const { sortBy, isString, isFunction, flatten, compact } = require('lodash')

function piece(name, deps = {}) {

  const oscPrefix = name ? `/${ name }` : ''
  let parts = []
  let sections = []
  let phraseCount = 0
  let script = { name, parts, sections }

  function part(...args) {
    let name = `part${ parts.length }`
    let phrases = []
    let evs = []
    let fns = []
    let dests = []
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        name = arg
      }
      else if(arg.type === 'phrase') {
        phrases.push(arg)
      }
      else if(arg.type === 'ev') {
        evs.push(arg)
      }
      else if(arg.type === 'fn') {
        fns.push(arg)
      }
      else if(arg.type === 'dest') {
        dests.push(arg)
      }
    }
    if(evs.length) {
      phrases.push(phrase(evs))
    }
    let newPart = { name, phrases, fns, dests, type: 'part' }
    parts.push(newPart)
    phraseCount = 0
    return newPart
  }

  function phrase(...args) {
    let name = `phrase${ phraseCount }`
    let evs = []
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        name = arg
      }
      else if(arg.type === 'ev') {
        evs.push(arg.ev)
        evs = sortBy(evs, 'pos')
      }
    }    
    phraseCount++
    return { name, evs, type: 'phrase' }
  }

  function ev(pos, type, data) {
    const ev = { pos, type }
    if(data) ev.data = data
    return { ev, type: 'ev' }
  }

  function gr(patt, evCode) {
    let data
    let type
    if(isString(evCode)) {
      type = evCode
    }
    else {
      type = 'note'
      data = { pitch: evCode }
    }
    let evs = patt
      .replace(/ /g, '')
      .split('')
      .map((chr, i) => {
        if(chr === 'x') {
          return ev(i * (1/4), type, data)
        }
      });
    return compact(evs)
  }

  function fn(...args) {
    let evType
    let fn
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        evType = arg
      }
      else if(isFunction(arg)) {
        fn = arg
      }
    }
    return { fn, evType, type: 'fn' }
  }

  function dest(...args) {
    let evType
    let fn
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        evType = arg
      }
      else if(isFunction(arg)) {
        fn = arg
      }
    }
    return { fn, evType, type: 'dest' }
  }

  // function destOrFn(args, type) {
    
  // }

  function oscOut(...argNames) {
    const f = ev => {
      const address = `${ oscPrefix }/${ ev.source }/${ ev.type }`
      const args = argNames.map(an => ev.data[an])
      sendOSC({
        address,
        args,
        udpAddress: 'localhost',
        port: 24276
      })
    }
    return fn(f)
  }

  // function waaInstr(...args) {
  //   args = args.map()
  //   return fn()
  // }

  function section(...args) {
    let name = `section${ sections.length }`
    let strains = []
    for(let arg of args) {
      if(isString(arg)) {
        name = arg
      }
      else if(arg.type === 'strain') {
        strains.push(arg)
      }
    }
    let newSection = { name, strains, type: 'section' }
    sections.push(newSection)
    return newSection
  }

  function strain(partName) {
    return { partName, type: 'strain' }
  }

  // Private

  // function findPart(partName) {
  //   return parts.find(p => p.name === partName)
  // }

  return {
    part, phrase, ev, gr, fn, dest, section, strain, script,
    osc: { out: oscOut }
    // waa: { instr: waaInstr }
  }

}

module.exports = piece