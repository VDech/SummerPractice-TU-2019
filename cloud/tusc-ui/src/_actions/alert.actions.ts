
import { alertConstants } from '../_constants/alert.constants'
import { AnyAction } from 'redux'

function success(message: string): AnyAction {
    return { type: alertConstants.SUCCESS, message }
}

function error(message: string): AnyAction {
    return { type: alertConstants.ERROR, message }
}

function warning(message: string): AnyAction {
    return { type: alertConstants.WARNING, message }
}

function clear(): AnyAction {
    return { type: alertConstants.CLEAR }
}

export const alertActions = {
  success,
  error,
  warning,
  clear,
}
