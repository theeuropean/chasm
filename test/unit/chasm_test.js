require('../test_helper')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
let player
let createPlayer
let chasm

describe('chasm', () => {

  // chasm has global state, so force reload for each test
  before(() => proxyquire.noPreserveCache())

  beforeEach(() => {
    player = {
      play: sinon.spy(),
      stop: sinon.spy()
    }
    createPlayer = sinon.stub().returns(player)
    let Piece = sinon.stub()
    Piece
      .onFirstCall().returns({ script: { name: 'foo' } })
      .onSecondCall().returns({ script: { name: 'bar' } })
    chasm = proxyquire('../../src/chasm', {
      './piece': Piece,
      './player': createPlayer
    })
  })

  after(() => proxyquire.preserveCache())

  it('can add and retrieve a named piece', () => {
    chasm.piece('foosong')
    chasm.piece('foosong').script.name.should.equal('foo')
  })

  it('can add a piece whose name defaults to piece + index', () => {
    chasm.piece()
    chasm.piece()
    chasm.piece('piece0').script.name.should.equal('foo')    
    chasm.piece('piece1').script.name.should.equal('bar')    
  })

  it('can play and stop a piece', () => {
    chasm.piece('foo')
    chasm.play({ name: 'foo' })
    createPlayer.should.have.been.calledWith({ name : 'foo' })
    player.play.should.have.been.called
    chasm.stop()
    player.stop.should.have.been.called
  })

  it('can a play a piece defaulting to the first', () => {
    chasm.piece()
    chasm.piece()
    chasm.play({})
    createPlayer.should.have.been.calledWith({ name: 'foo' })
  })

  it('can allow adding custom methods to any piece', () => {
    chasm.addPieceMethod('foo', function (_piece, bar) {
      _piece.script.newProp = bar
      return bar
    })
    const p = chasm.piece()
    p.foo('awooga').should.equal('awooga')
    p.script.newProp.should.equal('awooga')
  })

})