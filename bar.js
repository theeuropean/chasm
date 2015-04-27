// let foo = require('./foo')
import * as foo from './foo'

function bar() {
  foo.foo()
}

export default bar