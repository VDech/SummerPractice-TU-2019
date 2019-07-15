const ipc = require('electron').ipcMain
const store = require('../lib/store')

module.exports = function(renderer) {

  setInterval(report, 1000)

  const history = {
    odoLatency: [],
    speedLatency: [],
    tempLatency: [],
  }

  // event
  function report() {
    let now = new Date().getTime()
    let latency = store.get('HTTP_LATENCY')
    let data = {
      odoLatency: [now, latency.odo],
      speedLatency: [now, latency.speed],
      tempLatency: [now, latency.temp],
    }

    history.odoLatency.push(data.odoLatency)
    history.speedLatency.push(data.speedLatency)
    history.tempLatency.push(data.tempLatency)

    history.odoLatency.slice(history.odoLatency.length - 1000)
    history.speedLatency.slice(history.speedLatency.length - 1000)
    history.tempLatency.slice(history.tempLatency.length - 1000)

    renderer.webContents.send('monitoring.data', data)
  }

  // async
  ipc.on('monitoring.getHistory.req', async (e, req) => {
    e.sender.send('monitoring.getHistory.res', history)
  })

}
