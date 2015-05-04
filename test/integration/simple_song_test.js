require('../test_helper')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const oscSendSpy = sinon.spy()
const clock = require('../fake_clock')()
clock.create['@global'] = true;
const chasm = proxyquire('../../src/chasm', {
  './clock': clock.create,
  './osc': { send: oscSendSpy, '@global': true }
})

describe('chasm as a whole', () => {

  it('plays a simple song', function () {

    let { part, phrase, gr, osc } = chasm.piece('simple_song')

    part(
      gr('x--- x--- x--- x---', 1),
      osc.out('pitch')
    )

    chasm.play('simple_song')

    // 2.1 seconds at 120bpm is just over one bar
    clock.runFor(2.1)

    oscSendSpy.should.have.callCount(5);
    oscSendSpy.should.have.always.have.been.calledWith({
      address: '/simple_song/part0/note',
      args: [1],
      port: 24276,
      udpAddress: 'localhost'
    })

  })

})