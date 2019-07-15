const axios = require('axios')
const logger = require('../lib/logger')
const store = require('../lib/store')

module.exports = function(renderer) {

  let lastRequest = 0
  setInterval(poller, 1000)

  async function poller() {
    const { refresh, timeRange, speedUrl, odoUrl, tempUrl, } = store.get('SETTINGS')
    const now = Date.now()
    if ( lastRequest < now - refresh ) {
      const to = Math.floor(now / 1000)
      const from = to - Math.floor(timeRange / 1000)
      updateData('data.speed', speedUrl, from, to)
      updateData('data.odo', odoUrl, from, to)
      updateData('data.temp', tempUrl, from, to)
      lastRequest = now
    }
  }

  // event
  async function updateData(topic, url, from, to) {
    try {
      const response = await axios.get(`${url}?from=${from}&to=${to}`)
      renderer.webContents.send(topic, response.data.data)
    } catch (err) {
      logger.error(err.response ? JSON.stringify(err.response.data) : err.message)
    }
  }

  // event
  async function updateFakeData(topic, url, from, to) {
    const data = []
    let current = from
    while (current < to) {
      data.push({ time: current, value: Math.random() * 50 })
      current++
    }
    renderer.webContents.send(topic, data)
  }

}
