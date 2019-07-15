import { dataConstants } from '../_constants/data.constants'
import { store } from '../_helpers/store';
import { ipcRenderer } from 'electron'

ipcRenderer.on('data.speed', (e: any, speed: any) => {
  const { dispatch } = store
  dispatch({ type: dataConstants.SPEED, speed })
})

ipcRenderer.on('data.odo', (e: any, odo: any) => {
  const { dispatch } = store
  dispatch({ type: dataConstants.ODO, odo })
})

ipcRenderer.on('data.temp', (e: any, temp: any) => {
  const { dispatch } = store
  dispatch({ type: dataConstants.TEMP, temp })
})

function init() { }

export const dataActions = {
  init,
}
