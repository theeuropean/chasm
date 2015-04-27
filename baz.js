// let proxyquire = require('proxyquire')
// let bar = proxyquire('./bar', {
//   './foo': { foo: foo }
// })

System.define('./bar', 'export default function () { console.log("override successful!") }')

import bar from './bar'

function fooOverride() {
  console.log('override successful!')
}

bar()