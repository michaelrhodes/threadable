var threadify = require('threadify')
var slice = require('sliced')

var terminated = new Error(
  'The thread was remotely terminated'
)

module.exports = function (fn) {
  fn = threadify(fn)

  return function () {
    var complete = false
    var args = slice(arguments)
    var callback = args.pop()

    var exec = fn.apply(fn, args)
    exec.done = ondone
    exec.failed = onfailed
    exec.terminated = onterminated

    return {
      terminate: terminate,
      kill: terminate
    }

    function ondone (value) {
      if (complete) return
      callback(null, value)
      complete = true
    }

    function onfailed (error) {
      if (complete) return
      callback(error)
      complete = true
      exec.terminate()
    }

    function onterminated () {
      if (complete) return
      callback(terminated)
      complete = true
    }

    function terminate () {
      complete = true
      exec.terminate()
    }
  }
}
