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
    let occs = []
    for(let partRenderer of unsectionedPartRenderers) {
      occs = occs.concat(partRenderer.render(from, to))
    }
    if(currentSectionRenderer) {
      occs = occs.concat(currentSectionRenderer.render(from, to))
    }
    return occs
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
    let occs = []
    for(let partRenderer of partRenderers) {
      occs = occs.concat(partRenderer.render(from, to))
    }
    return occs
  }

}

function PartRenderer(part) {

  const phrases = part.phrases || []
  const phraseRenderers = phrases.map(PhraseRenderer)
  setSourceForOccs()

  return { render }

  function render(from, to) {
    let occs = phraseRenderers[0].render(from, to)
    if(occs.length && part.fns && part.fns.length) {
      part.fns.forEach(fn => {
        occs
          .filter(occ => !fn.eventType || occ.ev.type === fn.eventType)
          .forEach(occ => merge(occ, fn.fn(occ)))
      })
    }
    return occs
  }

  function setSourceForOccs() {
    phrases.forEach(phr => phr.occs.forEach(occ => occ.source = part.name))
  }

}

function PhraseRenderer(phrase) {

  const length = 4

  return { render }

  function render(from, to) {
    let occs = []
    let _from = from
    let nextLoopBoundary = (Math.floor(from / length) + 1) * length
    while(nextLoopBoundary < to) {
      concatInPlace(occs, renderLoopRange(_from % length))
      _from = nextLoopBoundary
      nextLoopBoundary = nextLoopBoundary + length
    }
    concatInPlace(occs, renderLoopRange(_from % length, (to % length) || length)) 
    return occs
  }

  function renderLoopRange(from, to = length) {
    if(from < 0 || from > to || to > length) throw new ArgumentException()
    return phrase.occs
      .filter(occ => occ.pos >= from && occ.pos < to)
      .map(cloneDeep)    
  }

  function concatInPlace(destination, source) {
    Array.prototype.push.apply(destination, source)
    return destination
  }

  // function render(from, to) {
  //   // There's probably a cleverer/terser way of expressing this algorithm

  //   // Number of times around the loop, rounded up
  //   const loopCount = Math.ceil((to - from) / length)
  //   let occs = []

  //   for(let i = 0; i < loopCount; i++) {
  //     let thisFrom = from + (i * length)
  //     let thisTo = Math.min(thisFrom + length, to)
  //     occs = occs.concat(renderLoopSection(thisFrom, thisTo))
  //   }

  //   return occs
  // }

  // function renderLoopSection(from, to) {
  //   const fromLoopPos = from % length
  //   const toLoopPos = to % length

  //   // If toLoopPos < fromLoopPos this means that the selection window straddles
  //   // the end of the loop, so we need a different filter to return the correct
  //   // occs
  //   const filter = fromLoopPos < toLoopPos ?
  //     (occ => occ.pos >= fromLoopPos && occ.pos < toLoopPos) :
  //     (occ => occ.pos >= fromLoopPos || occ.pos < toLoopPos)
    
  //   return phrase.occs.filter(filter).map(cloneDeep)    
  // }

}

export default Renderer