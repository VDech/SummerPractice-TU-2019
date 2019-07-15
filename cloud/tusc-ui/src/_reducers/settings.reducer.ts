import { settingConstants } from  '../_constants/setting.constants'
import { AnyAction } from 'redux';
import { ipcRenderer } from 'electron'

type State = {
  speedUrl: string,
  tempUrl: string,
  odoUrl: string,
  timeRange: Number,
  refresh: Number,
}

const initialState: State = {
  speedUrl: ipcRenderer.sendSync('settings.speedUrl.get'),
  tempUrl: ipcRenderer.sendSync('settings.tempUrl.get'),
  odoUrl: ipcRenderer.sendSync('settings.odoUrl.get'),
  timeRange: ipcRenderer.sendSync('settings.timeRange.get'),
  refresh: ipcRenderer.sendSync('settings.refresh.get'),
}

export default function settings(state: State = initialState, action: AnyAction) {

  switch (action.type) {

    case settingConstants.SPEED:
      return { ...state, speedUrl: action.speedUrl }

    case settingConstants.ODO:
      return { ...state, odoUrl: action.odoUrl }

    case settingConstants.TEMP:
      return { ...state, tempUrl: action.tempUrl }

    case settingConstants.TIME_RANGE:
      return { ...state, timeRange: action.timeRange }

    case settingConstants.REFRESH:
      return { ...state, refresh: action.refresh }

    default:
      return state

  }
}
