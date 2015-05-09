require('../test_helper')
const createPiece = require('../../src/piece')
let piece, part, phrase, ev, gr, fn, dest, osc, /*waa,*/ section, strain, script

describe('piece', function () {

  beforeEach(() => {
    piece = createPiece()
    script = piece.script
    ;({ part, phrase, ev, gr, fn, dest, osc, /*waa,*/ section, strain } = piece)
  })

  it("exposes its parts (fnar fnar)", () => {
    script.parts.should.exist
  })

  it("can add a part with default name", () => {
    part()
    script.parts[0].should.exist
    script.parts[0].name.should.equal('part0')
  })

  it("can add a part with specified name", () => {
    part('foo')
    script.parts[0].name.should.equal('foo')
  })

  it("can add a phrase to a part with a default name", () => {
    part(phrase())
    script.parts[0].phrases[0].should.exist
    script.parts[0].phrases[0].name.should.equal('phrase0')
  })

  it('can add a phrase to a part with a specified name', () => {
    part(phrase('foo'))
    script.parts[0].phrases[0].name.should.equal('foo')
  })

  it('can add an event to a phrase', () => {
    part(phrase(ev(0, 'note', { pitch: 1 })))
    script.parts[0].phrases[0].evs
      .should.deep.equal([
        { pos: 0, type: 'note', data: { pitch: 1 } }
      ])
  })

  it('should order phrase event occurrences by position', () => {
    part(phrase(
      ev(2, 'note', { pitch: 2 }),
      ev(0, 'note', { pitch: 1 })
    ))
    script.parts[0].phrases[0].evs
      .should.deep.equal([
        { pos: 0, type: 'note', data: { pitch: 1 } },
        { pos: 2, type: 'note', data: { pitch: 2 } }
      ])
  })

  it('can create a phrase from a grid pattern', () => {
    part(phrase(gr('x--- x--- x--- x-x-', 1)))
    script.parts[0].phrases[0].evs
      .should.deep.equal([
        { pos: 0,   type: 'note', data: { pitch: 1 } },
        { pos: 1,   type: 'note', data: { pitch: 1 } },
        { pos: 2,   type: 'note', data: { pitch: 1 } },
        { pos: 3,   type: 'note', data: { pitch: 1 } },
        { pos: 3.5, type: 'note', data: { pitch: 1 } }
      ])
  })

  it('can create a grid pattern without specifying a phrase', () => {
    part(gr('x--- ---- ---- --x-', 1))
    script.parts[0].phrases[0].evs
      .should.deep.equal([
        { pos: 0,   type: 'note', data: { pitch: 1 } },
        { pos: 3.5, type: 'note', data: { pitch: 1 } }
      ])
  })

  it('can create a grid pattern of custom events', () => {
    part(gr('x--- ---- ---- --x-', 'kick'))
    script.parts[0].phrases[0].evs
      .should.deep.equal([
        { pos: 0,   type: 'kick' },
        { pos: 3.5, type: 'kick' }
      ])
  })

  it('can add a function to a part', () => {
    let f = () => {}
    part(fn(f))
    script.parts[0].fns[0].fn.should.equal(f)
  })

  it('can add a function for a specified event type to a part', () => {
    let f = () => {}
    part(fn('note', f))
    script.parts[0].fns[0].evType.should.equal('note')
    script.parts[0].fns[0].fn.should.equal(f)
  })

  it('can add a destination to a part', () => {
    let f = () => {}
    part(dest(f))
    script.parts[0].dests[0].fn.should.equal(f)
  })

  it('can add a destination for a specified event type to a part', () => {
    let f = () => {}
    part(dest('note', f))
    script.parts[0].dests[0].evType.should.equal('note')
    script.parts[0].dests[0].fn.should.equal(f)
  })

  // it('can set an OSC destination for a part', () => {
  //   part(osc.out('bar', 'baz'))
  //   script.parts[0].fns[0].fn.should.exist
  // })

  // it('can set a Web Audio API instrument for a part', () => {
  //   let f = () => {}    
  //   part(waa.instr(f))
  //   script.parts[0].fns[0].fn.should.equal(f)
  // })

  it('can add a section with a default name', () => {
    section()
    script.sections[0].should.exist
    script.sections[0].name.should.equal('section0')
  })

  it('can add a section with a specified name', () => {
    section('foo')
    script.sections[0].name.should.equal('foo')
  })

  it('can add a strain to a section', () => {
    part()
    section(strain('part0'))
    script.sections[0].strains[0].partName.should.equal('part0')
  })

})