import { settingConstants } from '../_constants/setting.constants'
import { AnyAction } from 'redux'
import { ipcRenderer } from 'electron'

function setSpeedUrl(url: string): AnyAction {
  ipcRenderer.send('settings.speedUrl.set', url)
  return { type: settingConstants.SPEED, speedUrl: url }
}

function setOdoUrl(url: string): AnyAction {
  ipcRenderer.send('settings.odoUrl.set', url)
  return { type: settingConstants.ODO, odoUrl: url }
}

function setTempUrl(url: string): AnyAction {
  ipcRenderer.send('settings.tempUrl.set', url)
  return { type: settingConstants.TEMP, tempUrl: url }
}

function setTimeRange(timeRange: number): AnyAction {
  ipcRenderer.send('settings.timeRange.set', timeRange)
  return { type: settingConstants.TIME_RANGE, timeRange }
}

function setRefresh(refresh: number): AnyAction {
  ipcRenderer.send('settings.refresh.set', refresh)
  return { type: settingConstants.REFRESH, refresh }
}

export const settingActions = {
  setSpeedUrl,
  setOdoUrl,
  setTempUrl,
  setTimeRange,
  setRefresh,
}
