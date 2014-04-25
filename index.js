var through = require('through')

module.exports = setup
module.exports.stream = stream

function setup(unpm) {
  var stream = unpm.backend.createMetaStream()
    , cache = {}

  stream.on('data', add)
  stream.on('end', end)

  function add(data) {
    cache[data.key] = data.value
  }

  function end(data) {
    if(data) {
      add(data)
    }

    set(add_listeners)
  }

  function set(done) {
    unpm.backend.set('unpm-meta-cache', cache, done)
  }

  function add_listeners(err) {
    if(err) {
      throw err
    }

    unpm.backend.on('setMeta', added)
    unpm.backend.on('removeMeta', removed)
  }

  function added(name, data) {
    cache[name] = data
    set()
  }

  function removed(name) {
    delete cache[name]
    set()
  }
}

function stream(unpm) {
  var stream = through()

  unpm.backend.get('unpm-meta-cache', emit)
  unpm.backend.on('set', check)

  return stream

  function emit(data) {
    if(data) {
      return
    }

    stream.queue(data)
  }

  function check(name, data) {
    if(name === 'unpm-meta-cache') {
      emit(data)
    }
  }
}
