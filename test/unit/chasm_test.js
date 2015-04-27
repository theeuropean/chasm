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
      .onFirstCall().returns({ script: 'foo' })
      .onSecondCall().returns({ script: 'bar' })
    chasm = proxyquire('../../src/chasm', {
      './piece': Piece,
      './player': createPlayer
    })
  })

  after(() => proxyquire.preserveCache())

  it('can add and retrieve a named piece', () => {
    chasm.piece('foosong')
    chasm.piece('foosong').script.should.equal('foo')
  })

  it('can add a piece whose name defaults to piece + index', () => {
    chasm.piece()
    chasm.piece()
    chasm.piece('piece0').script.should.equal('foo')    
    chasm.piece('piece1').script.should.equal('bar')    
  })

  it('can play and stop a piece', () => {
    chasm.piece('foosong')
    chasm.play({ name: 'foosong' })
    createPlayer.should.have.been.calledWith('foo')
    player.play.should.have.been.called
    chasm.stop()
    player.stop.should.have.been.called
  })

  it('can a play a piece defaulting to the first', () => {
    chasm.piece()
    chasm.piece()
    chasm.play({})
    createPlayer.should.have.been.calledWith('foo')
  })

})