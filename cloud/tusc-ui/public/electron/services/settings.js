const nconf = require('nconf')
const ipc = require('electron').ipcMain
const store = require('../lib/store')

module.exports = function(renderer) {

  // initialize settings if needed (from configuration)
  if (!store.get('SETTINGS')) {
    store.set('SETTINGS', {
      speedUrl: nconf.get('SPEED_URL'),
      odoUrl: nconf.get('ODO_URL'),
      tempUrl: nconf.get('TEMP_URL'),
      refresh: nconf.get('REFRESH'),
      timeRange: nconf.get('TIME_RANGE'),
    })
  }

  // sync
  ipc.on('settings.speedUrl.get', async e => {
    e.returnValue = store.get('SETTINGS').speedUrl
  })

  // fire and forget
  ipc.on('settings.speedUrl.set', async (e, value) => {
    store.set('SETTINGS', { ...store.get('SETTINGS'), speedUrl: value })
  })

  // sync
  ipc.on('settings.odoUrl.get', async e => {
    e.returnValue = store.get('SETTINGS').odoUrl
  })

  // fire and forget
  ipc.on('settings.odoUrl.set', async (e, value) => {
    store.set('SETTINGS', { ...store.get('SETTINGS'), odoUrl: value })
  })

  // sync
  ipc.on('settings.tempUrl.get', async e => {
    e.returnValue = store.get('SETTINGS').tempUrl
  })

  // fire and forget
  ipc.on('settings.tempUrl.set', async (e, value) => {
    store.set('SETTINGS', { ...store.get('SETTINGS'), tempUrl: value })
  })

  // sync
  ipc.on('settings.refresh.get', async e => {
    e.returnValue = store.get('SETTINGS').refresh
  })

  // fire and forget
  ipc.on('settings.refresh.set', async (e, value) => {
    store.set('SETTINGS', { ...store.get('SETTINGS'), refresh: value })
  })

  // sync
  ipc.on('settings.timeRange.get', async e => {
    e.returnValue = store.get('SETTINGS').timeRange
  })

  // fire and forget
  ipc.on('settings.timeRange.set', async (e, value) => {
    store.set('SETTINGS', { ...store.get('SETTINGS'), timeRange: value })
  })

}
