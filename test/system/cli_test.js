const h = require('../test_helper')
const childProcess = require('child_process')
const sinon = require('sinon')
const osc = require('osc-min')
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

describe('chasm cli', () => {

  it('executes the chasmconf then plays any chasm pieces in the cwd', (done) => {
    
    let bindir = `${ __dirname }/../../bin`
    let spy = sinon.spy()    
    server.on('message', msg => {
      var oscMsg = osc.fromBuffer(msg)
      spy(oscMsg.address, oscMsg.args)
    })
    server.bind(24276, exec)

    function exec() {
      let stdout = childProcess.exec(
        `${ bindir }/cha`,
        {
          cwd: __dirname,
          timeout: 1900
        },
        terminated
      )      
    }

    function terminated(err, stdout, stderr) {
      console.log(stdout.toString())
      spy.should.have.callCount(4)
      spy.should.have.always.have.been.calledWith(
        '/part0/note',
        [ { type: 'float', value: 1 } ]
      )
      done()
    }

  })

})