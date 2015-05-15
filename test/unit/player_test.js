const h = require('../test_helper')
const proxyquire = require('proxyquire')
const _ = require('lodash')
const sinon = require('sinon')
const clock = require('../fake_clock')()
let player
let renderer

describe('player', () => {

  beforeEach(() => {
    renderer = { render: sinon.stub() }
    player = proxyquire('../../src/player', {
      './clock': clock.create,
      './renderer': () => renderer
    })
  })

  it('can play a piece', () => {
    let p = player('')
    p.play()
    clock.runFor(0.1)
    renderer.render.should.have.callCount(12)
    renderer.render.should.have.been.calledWith(0.18, 0.196)
  })

  it('can initialise and pipe its output to a dest function', () => {
    const spy = sinon.spy()
    const factory = sinon.stub()
    factory.returns(spy)
    const script = {
      parts: [
        {
          name: 'part0',
          dests: [{ fn: factory }]
        }
      ]
    }
    renderer.render.returns([{ type: 'foo', source: 'part0' }])
    let p = player(script)
    factory.should.have.been.calledOnce;
    p.play()
    clock.runFor(0.01)
    spy.should.have.been.calledWith({ type: 'foo', source: 'part0' })
  })

  // it('prefixes osc messages with piece name if it has one', () => {
  //   let script = _.cloneDeep(h.ONE_PART_SCRIPT)
  //   script.name = "foo"
  //   let p = player(script)
  //   p.play()
  //   clock.runFor(1)
  //   oscSpy.should.have.always.been.calledWith({
  //     address: '/foo/part0/note',
  //     args: [1],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })
  // })

  // it('can play a section of a piece with sections', () => {
  //   let p = player(h.TWO_PART_TWO_SECTION_SCRIPT)
  //   p.play()
  //   clock.runFor(2.1) // 2.1 seconds is just over one bar at 120bpm
  //   oscSpy.should.have.callCount(5)
  //   oscSpy.should.always.have.been.calledWith({
  //     address: '/part0/note',
  //     args: [1],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })
  //   p.change('section1/play')
  //   oscSpy.reset()
  //   clock.continueFor(2)
  //   oscSpy.should.have.callCount(4)
  //   oscSpy.should.have.always.been.calledWith({
  //     address: '/part1/note',
  //     args: [2],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })    
  // })
  
  // it('can play a piece with a function', () => {
  //   let script = _.cloneDeep(h.ONE_PART_SCRIPT)
  //   script.parts[0].fns.push({
  //     fn: input => {
  //       input.ev.data.pitch++
  //       return input
  //     }
  //   })
  //   let p = player(script)
  //   p.play()
  //   clock.runFor(2.1) // 2.1 seconds is just over one bar at 120bpm
  //   oscSpy.should.have.callCount(5)
  //   oscSpy.should.have.always.been.calledWith({
  //     address: '/part0/note',
  //     args: [2],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })
  // })

  // it('can filter the events going into a function', () => {
  //   let script = _.cloneDeep(h.ONE_PART_SCRIPT)
  //   script.parts[0].phrases[0].occs.push(
  //     { pos: 0, ev: { type: 'foo', data: { pitch: 99 } } }
  //   )
  //   script.parts[0].fns.push({
  //     fn: input => {
  //       input.ev.data.pitch++
  //       return input
  //     },
  //     eventType: 'note'
  //   })
  //   script.parts[0].fns.push({
  //     fn: input => {
  //       input.ev.data.pitch--
  //       return input
  //     },
  //     eventType: 'foo'
  //   })
  //   let p = player(script)
  //   p.play()
  //   clock.runFor(2.1) // 2.1 seconds is just over one bar at 120bpm
  //   oscSpy.should.have.callCount(7)
  //   oscSpy.should.have.been.calledWith({
  //     address: '/part0/note',
  //     args: [2],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })
  //   oscSpy.should.have.been.calledWith({
  //     address: '/part0/foo',
  //     args: [98],
  //     port: 24276,
  //     udpAddress: 'localhost'
  //   })
  // })

})