import { send } from './osc'

module.exports = Piece

const { sortBy, isString, isFunction, flatten, compact } = require('lodash')

function Piece(name) {

  const oscPrefix = name ? `/${ name }` : ''
  let parts = []
  let sections = []
  let phraseCount = 0
  let script = { name, parts, sections }

  return { part, phrase, ev, gr, fn, toOSC, section, strain, script }

  function part(...args) {
    let name = `part${ parts.length }`
    let phrases = []
    let occs = []
    let fns = []
    let dest
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        name = arg
      }
      else if(arg.type === 'phrase') {
        phrases.push(arg)
      }
      else if(arg.type === 'occ') {
        occs.push(arg)
      }
      else if(arg.type === 'fn') {
        fns.push(arg)
      }
    }
    if(occs.length) {
      phrases.push(phrase(occs))
    }
    let newPart = { name, phrases, fns, dest, type: 'part' }
    parts.push(newPart)
    phraseCount = 0
    return newPart
  }

  function phrase(...args) {
    let name = `phrase${ phraseCount }`
    let occs = []
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        name = arg
      }
      else if(arg.type === 'occ') {
        occs.push(arg)
        occs = sortBy(occs, 'pos')
      }
    }    
    phraseCount++
    return { name, occs, type: 'phrase' }
  }

  function ev(pos, type, data) {
    const _ev = data ? { type, data } : { type }
    return { pos, ev: _ev, type: 'occ' }
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
    let occs = patt
      .replace(/ /g, '')
      .split('')
      .map((chr, i) => {
        if(chr === 'x') {
          return ev(i * (1/4), type, data)
        }
      });
    return compact(occs)
  }

  function fn(...args) {
    let eventType
    let fn
    for(let arg of flatten(args)) {
      if(isString(arg)) {
        eventType = arg
      }
      else if(isFunction(arg)) {
        fn = arg
      }
    }
    return { fn, eventType, type: 'fn' }
  }

  function toOSC(...argNames) {
    const f = (occ) => {
      const address = `${ oscPrefix }/${ occ.source }/${ occ.ev.type }`
      const args = argNames.map(an => occ.ev.data[an])
      send({
        address,
        args,
        udpAddress: 'localhost',
        port: 24276
      })
    }
    return fn(f)
  }

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

}