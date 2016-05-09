var test = require('tape')
var threadable = require('./index')

var add = threadable(function (a, b) {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Both arguments must be numbers')
  }
  return a + b
})

test('it uses node-style callbacks', function (assert) {
  assert.plan(4)

  add(1, 1, function (err, result) {
    assert.equal(err, null)
    assert.equal(result, 2)
  })

  add(null, 'b', function (err, result) {
    assert.equal(err instanceof Error, true)
    assert.equal(typeof result, 'undefined')
  })
})

test('it can be killed without side-effect', function (assert) {
  assert.plan(3)

  var thread = add(1, 1, function (err, result) {
    assert.equal(err, null)
    assert.equal(result, 2)
  })

  assert.equal(typeof thread.kill, 'function')
  assert.equal(typeof thread.terminate, 'function')
  assert.equal(thread.terminate, thread.kill)
  thread.kill()
})

test('it reports remote termination', function (assert) {
  assert.plan(3)

  var terminator = threadable(function (a, b) {
    this.terminate()
  })

  terminator(1, 1, function (err, result) {
    assert.equal(err instanceof Error, true)
    assert.equal(err.message, 'The thread was remotely terminated')
    assert.equal(typeof result, 'undefined')
  })
})
