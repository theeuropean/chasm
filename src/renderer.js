import { flatten, cloneDeep, merge, findIndex } from 'lodash'

function Renderer(script) {

  script = cloneDeep(script)
  const parts = script.parts || []
  const sections = script.sections || []
  const partRenderers = new Map(
    parts.map(part => [part.name, PartRenderer(part)])
  )
  const sectionRenderers = new Map(
    sections.map(section => [section.name, SectionRenderer(section, partRenderers)])
  )
  const unsectionedPartRenderers = getUnsectionedPartRenderers()
  let currentSectionRenderer
  if(sections.length) changeSection(sections[0].name)

  return { render, changeSection }

  function render(from, to) {
    // if(sections.length) console.log([fromMs, toMs, from, to].join(' '))
    let evs = []
    for(let partRenderer of unsectionedPartRenderers) {
      evs = evs.concat(partRenderer.render(from, to))
    }
    if(currentSectionRenderer) {
      evs = evs.concat(currentSectionRenderer.render(from, to))
    }
    return evs
  }

  function changeSection(sectionName) {
    currentSectionRenderer = sectionRenderers.get(sectionName)
  }

  function getUnsectionedPartRenderers() {
    // REFACTOR this is incomprehensible
    const sectionedPartNames = flatten(sections.map(
      sect => sect.strains.map(strn => strn.partName)
    ))
    return Array.from(partRenderers)
      .filter(([name, ]) => !sectionedPartNames.includes(name))
      .map(([, renderer]) => renderer)
  }

}

function SectionRenderer(section, allPartRenderers) {

  const strains = section.strains || []
  const partNames = strains.map(strain => strain.partName)
  const partRenderers = Array.from(allPartRenderers)
    .filter(([name, ]) => partNames.includes(name))
    .map(([, renderer]) => renderer)

  return { render }

  function render(from, to) {
    let evs = []
    for(let partRenderer of partRenderers) {
      evs = evs.concat(partRenderer.render(from, to))
    }
    return evs
  }

}

function PartRenderer(part) {

  const phrases = part.phrases || []
  const phraseRenderers = phrases.map(PhraseRenderer)
  setSourceForevs()

  return { render }

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

}

function PhraseRenderer(phrase) {

  const length = 4

  return { render }

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

}

export default Renderer