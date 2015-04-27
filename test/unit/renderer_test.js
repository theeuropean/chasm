const h = require('../test_helper')
const Renderer = require('../../src/renderer')
const { cloneDeep, pluck } = require('lodash')
// const sinon = require('sinon')
// const spy = sinon.spy()
// const clock = require('../fake_clock')()
let script
// let renderer

describe('Renderer', () => {

  // NOTE `beforeEach(oscSpy.reset)` does not work :(
  // beforeEach(() => spy.reset())

  it('can render a piece with one part & no sections', () => {
    const renderer = Renderer(h.ONE_PART_SCRIPT)
    renderer.render(0, 5).should.deep.equal([
      { pos: 0,     source: 'part0', ev: h.N1 },
      { pos: 1,     source: 'part0', ev: h.N1 },
      { pos: 2,     source: 'part0', ev: h.N1 },
      { pos: 3.75,  source: 'part0', ev: h.N1 },      
      { pos: 0,     source: 'part0', ev: h.N1 }
    ])
  })

  it('can render a piece correctly with various different ranges', () => {
    const renderer = Renderer(h.ONE_PART_SCRIPT)
    posArr(0, 4).should.deep.equal([0, 1, 2, 3.75])
    posArr(1, 2).should.deep.equal([1])
    posArr(0, 10).should.deep.equal([0, 1, 2, 3.75, 0, 1, 2, 3.75, 0, 1])
    posArr(4, 12).should.deep.equal([0, 1, 2, 3.75, 0, 1, 2, 3.75])

    function posArr(from, to) {
      return pluck(renderer.render(from, to), 'pos')
    }
  })

  it('can play a section of a piece with sections', () => {
    const renderer = Renderer(h.TWO_PART_TWO_SECTION_SCRIPT)
    renderer.render(0, 5).should.deep.equal([
      { pos: 0,     source: 'part0', ev: h.N1 },
      { pos: 1,     source: 'part0', ev: h.N1 },
      { pos: 2,     source: 'part0', ev: h.N1 },
      { pos: 3.75,  source: 'part0', ev: h.N1 },      
      { pos: 0,     source: 'part0', ev: h.N1 }
    ])
    renderer.changeSection('section1')
    renderer.render(5, 9).should.deep.equal([
      { pos: 1,     source: 'part1', ev: h.N2 },
      { pos: 2,     source: 'part1', ev: h.N2 },
      { pos: 3.75,  source: 'part1', ev: h.N2 },      
      { pos: 0,     source: 'part1', ev: h.N2 }
    ])
  })

  it('can play a piece with a function', () => {
    const script = cloneDeep(h.ONE_PART_SCRIPT)
    script.parts[0].fns.push({
      fn: input => {
        input.ev.data.pitch++
        return input
      }
    })
    const renderer = Renderer(script)
    pluck(renderer.render(0, 4), 'ev.data.pitch').should.deep.equal([2, 2, 2, 2])
  })

  it('can filter the events going into a function', () => {
    const script = cloneDeep(h.ONE_PART_SCRIPT)
    script.parts[0].phrases[0].occs.unshift(
      { pos: 0, ev: { type: 'foo', data: { pitch: 99 } } }
    )
    script.parts[0].fns.push({
      fn: input => {
        input.ev.data.pitch++
        return input
      },
      eventType: 'note'
    })
    script.parts[0].fns.push({
      fn: input => {
        input.ev.data.pitch--
        return input
      },
      eventType: 'foo'
    })
    const renderer = Renderer(script)
    pluck(renderer.render(0, 4), 'ev.data.pitch')
      .should.deep.equal([98, 2, 2, 2, 2])
  })

})