var backend = require('unpm-mem-backend')
  , setup = require('./index')
  , test = require('tape')

test('inital data gets set correctly', function(t) {
  var db = backend()

  t.plan(2)
  init(db, function() {
    db.on('set', check)
    setup({backend: db})
  })

  function check(name, data) {
    t.equal(name, 'unpm-meta-cache')
    t.deepEqual(data, {
        a: 1
      , b: 2
      , c: 3
    })
  }
})

test('setting works', function(t) {
  var db = backend()

  t.plan(2)
  init(db, function() {
    db.once('set', start)
    setup({backend: db})
  })

  function start() {
    db.once('set', check)
    db.setMeta('b', 5)
  }

  function check(name, data) {
    t.equal(name, 'unpm-meta-cache')
    t.deepEqual(data, {
        a: 1
      , b: 5
      , c: 3
    })
  }
})

test('adding works', function(t) {
  var db = backend()

  t.plan(2)
  init(db, function() {
    db.once('set', start)
    setup({backend: db})
  })

  function start() {
    db.once('set', check)
    db.setMeta('d', 4)
  }

  function check(name, data) {
    t.equal(name, 'unpm-meta-cache')
    t.deepEqual(data, {
        a: 1
      , b: 2
      , c: 3
      , d: 4
    })
  }
})

test('removing works', function(t) {
  var db = backend()

  t.plan(2)
  init(db, function() {
    db.once('set', start)
    setup({backend: db})
  })

  function start() {
    db.once('set', check)
    db.removeMeta('b')
  }

  function check(name, data) {
    t.equal(name, 'unpm-meta-cache')
    t.deepEqual(data, {
        a: 1
      , c: 3
    })
  }
})

function init(db, done) {
  var count = 0

  db.setMeta('a', 1, set)
  db.setMeta('b', 2, set)
  db.setMeta('c', 3, set)

  function set() {
    if(++count < 3) {
      return
    }

    done()
  }
}
