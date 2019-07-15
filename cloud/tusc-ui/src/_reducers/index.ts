import { combineReducers } from 'redux'

import alert from './alert.reducer'
import data from './data.reducer'
import settings from './settings.reducer'

const rootReducer = combineReducers({
    alert,          // state.alert
    data,           // state.data
    settings,       // state.settings
})

export default rootReducer
export type AppState = ReturnType<typeof rootReducer>
