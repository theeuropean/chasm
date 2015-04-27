require('../test_helper')
const createPiece = require('../../src/piece')
let piece, part, phrase, ev, gr, fn, toOSC, section, strain, script

describe('piece', function () {

  beforeEach(() => {
    piece = createPiece()
    script = piece.script
    ;({ part, phrase, ev, gr, fn, toOSC, section, strain } = piece)
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

  it('can add an event occurrence to a phrase', () => {
    part(phrase(ev(0, 'note', { pitch: 1 })))
    script.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0, ev: { type: 'note', data: { pitch: 1 } }, type: 'occ' }
      ])
  })

  it('should order phrase event occurrences by position', () => {
    part(phrase(
      ev(2, 'note', { pitch: 2 }),
      ev(0, 'note', { pitch: 1 })
    ))
    script.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0, ev: { type: 'note', data: { pitch: 1 } }, type: 'occ' },
        { pos: 2, ev: { type: 'note', data: { pitch: 2 } }, type: 'occ' }
      ])
  })

  it('can create a phrase from a grid pattern', () => {
    let nn1 = { type: 'note', data: { pitch: 1 } }
    part(phrase(gr('x--- x--- x--- x-x-', 1)))
    script.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0,   ev: nn1, type: 'occ' },
        { pos: 1,   ev: nn1, type: 'occ' },
        { pos: 2,   ev: nn1, type: 'occ' },
        { pos: 3,   ev: nn1, type: 'occ' },
        { pos: 3.5, ev: nn1, type: 'occ' }
      ])
  })

  it('can create a grid pattern without specifying a phrase', () => {
    let nn1 = { type: 'note', data: { pitch: 1 } }
    part(gr('x--- ---- ---- --x-', 1))
    script.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0,   ev: nn1, type: 'occ' },
        { pos: 3.5, ev: nn1, type: 'occ' }
      ])
  })

  it('can create a grid pattern of custom events', () => {
    let kick = { type: 'kick' }
    part(gr('x--- ---- ---- --x-', 'kick'))
    script.parts[0].phrases[0].occs
      .should.deep.equal([
        { pos: 0,   ev: kick, type: 'occ' },
        { pos: 3.5, ev: kick, type: 'occ' }
      ])
  })

  it('can add a function to a part', () => {
    let f = () => {}
    part(fn(f))
    script.parts[0].fns[0].fn.should.equal(f)
  })

  it('can add a transform for a specified event type to a part', () => {
    let f = () => {}
    part(fn('note', f))
    script.parts[0].fns[0].eventType.should.equal('note')
    script.parts[0].fns[0].fn.should.equal(f)
  })

  it('can set an OSC destination for a part', () => {
    part(toOSC('bar', 'baz'))
    script.parts[0].fns[0].fn.should.exist
  })

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