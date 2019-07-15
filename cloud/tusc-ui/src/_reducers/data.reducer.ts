import { dataConstants } from  '../_constants/data.constants'
import { AnyAction } from 'redux';

type Item = {
  time: Number,
  value: Number,
}

type State = {
  speed: Array<Item>,
  odo: Array<Item>,
  temp: Array<Item>,
}

const initialState: State = { speed: [], odo: [], temp: [], }

export default function data(state: State = initialState, action: AnyAction) {

  switch (action.type) {

    case dataConstants.SPEED:
      return { ...state, speed: action.speed }

    case dataConstants.ODO:
      return { ...state, odo: action.odo }

    case dataConstants.TEMP:
      return { ...state, temp: action.temp }

    default:
      return state

  }
}
