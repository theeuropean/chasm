const { flatten, cloneDeep, merge, findIndex } = require('lodash')

function renderer(script) {
  script = cloneDeep(script)
  const parts = script.parts || []
  const sections = script.sections || []
  const partRenderers = new Map(
    parts.map(part => [part.name, partRenderer(part)])
  )
  const sectionRenderers = new Map(
    sections.map(section => [section.name, sectionRenderer(section, partRenderers)])
  )
  const unsectionedpartRenderers = getUnsectionedpartRenderers()
  let currentsectionRenderer
  if(sections.length) changeSection(sections[0].name)

  function render(from, to) {
    // if(sections.length) console.log([fromMs, toMs, from, to].join(' '))
    let evs = []
    for(let partRenderer of unsectionedpartRenderers) {
      evs = evs.concat(partRenderer.render(from, to))
    }
    if(currentsectionRenderer) {
      evs = evs.concat(currentsectionRenderer.render(from, to))
    }
    return evs
  }

  function changeSection(sectionName) {
    currentsectionRenderer = sectionRenderers.get(sectionName)
  }

  function getUnsectionedpartRenderers() {
    // REFACTOR this is incomprehensible
    const sectionedPartNames = flatten(sections.map(
      sect => sect.strains.map(strn => strn.partName)
    ))
    return Array.from(partRenderers)
      .filter(([name, ]) => !sectionedPartNames.includes(name))
      .map(([, renderer]) => renderer)
  }

  return { render, changeSection }
}

function sectionRenderer(section, allpartRenderers) {
  const strains = section.strains || []
  const partNames = strains.map(strain => strain.partName)
  const partRenderers = Array.from(allpartRenderers)
    .filter(([name, ]) => partNames.includes(name))
    .map(([, renderer]) => renderer)

  function render(from, to) {
    let evs = []
    for(let partRenderer of partRenderers) {
      evs = evs.concat(partRenderer.render(from, to))
    }
    return evs
  }

  return { render }
}

function partRenderer(part) {
  const phrases = part.phrases || []
  const phraseRenderers = phrases.map(phraseRenderer)
  setSourceForevs()

  function render(from, to) {
    let evs = phraseRenderers[0].render(from, to)
    if(evs.length && part.fns && part.fns.length) {
      part.fns.forEach(fn => {
        evs
          .filter(ev => !fn.evType || ev.type === fn.evType)
          .forEach(ev => merge(ev, fn.fn(ev)))
      })
    }
    return evs
  }

  function setSourceForevs() {
    phrases.forEach(phr => phr.evs.forEach(ev => ev.source = part.name))
  }

  return { render }
}

function phraseRenderer(phrase) {
  const length = 4

  // There's probably a cleverer/terser way of expressing this algorithm
  function render(from, to) {
    let evs = []
    let _from = from
    let nextLoopBoundary = (Math.floor(from / length) + 1) * length
    while(nextLoopBoundary < to) {
      concatInPlace(evs, renderLoopRange(_from % length))
      _from = nextLoopBoundary
      nextLoopBoundary = nextLoopBoundary + length
    }
    concatInPlace(evs, renderLoopRange(_from % length, (to % length) || length)) 
    return evs
  }

  function renderLoopRange(from, to = length) {
    if(from < 0 || from > to || to > length) throw new ArgumentException()
    return phrase.evs
      .filter(ev => ev.pos >= from && ev.pos < to)
      .map(cloneDeep)    
  }

  function concatInPlace(destination, source) {
    Array.prototype.push.apply(destination, source)
    return destination
  }

  return { render }
}

module.exports = renderer