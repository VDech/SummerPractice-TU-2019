/*
 * Simple key/value store
 */

const EventEmitter = require('events')
const _ = require('lodash')
const fs = require('fs')
const logger = require('./logger')

/**
 * List of operational keys. Only these keys
 * can be interacted with through the store.
 * @type {Object}
 */
const KEYS = {
  'SETTINGS': { persist: true },
  'HTTP_LATENCY': { persist: false },
}

class Store extends EventEmitter {

  constructor() {
    super()
    this._store = {}
  }

  set(key, value) {
    // ensure we are operating on allowed key
    if (!KEYS.hasOwnProperty(key)) {
      throw new Error(`Key ${key} cannot be set. Probably you forgot to configure it in the store.`)
    }

    // ensure we are persisting deep clones
    let prevValue = this._store.hasOwnProperty(key) ? this._store[key] : null
    this._store[key] = _.cloneDeep(value)
    this.emit(key, value, prevValue)
  }

  get(key, value) {
    // ensure we are operating on allowed key
    if (!KEYS.hasOwnProperty(key)) {
      throw new Error(`Key ${key} cannot be retreived. Probably you forgot to configure it in the store.`)
    }

    if (this._store.hasOwnProperty(key)) {
      return this._store[key]
    } else {
      return null
    }
  }

  remove(key) {
    // ensure we are operating on allowed key
    if (!KEYS.hasOwnProperty(key)) {
      throw new Error(`Key ${key} cannot be removed. Probably you forgot to configure it in the store.`)
    }

    this.emit(key, null, this._store[key])
    delete this._store[key]

  }

  serialize(persistentOnly=false) {
    if (!persistentOnly) {
      return JSON.stringify(this._store, null, 2)
    } else {
      let persistentStore = {}
      for (let key in KEYS) {
        if (KEYS[key].persist) {
          persistentStore[key] = this._store[key]
        }
      }
      return JSON.stringify(persistentStore, null, 2)
    }

  }

  load(serialized) {
    let deserialized = JSON.parse(serialized)
    for (let key in deserialized) {
      this.set(key, deserialized[key])
    }
  }

}

const store = new Store()

// load store from persistency (if one exists)
if (fs.existsSync('persistency.json')) {
  store.load(fs.readFileSync('persistency.json', 'utf8'))
}

function exitHandler(options, exitCode) {
    // persist store
    fs.writeFileSync('persistency.json', store.serialize(true))

    if (options.cleanup) {
      logger.info('Clean exit')
    }
    if (exitCode || exitCode === 0) {
      logger.info('Exit with code ', exitCode)
    }
    if (options.exit) {
      process.exit()
    }
}

//so the program will not close instantly
process.stdin.resume()
//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

module.exports = store
