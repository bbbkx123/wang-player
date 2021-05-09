import EventEmitter from "events"
import * as types from "../actionTypes"

const defaultState = {
  EventEmitter: new EventEmitter(),
  showMiniPlayer: false,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.GLOBAL__SHOW_MINI_PLAYER:
      return {
        ...state,
        showMiniPlayer: value,
      }
    default:
      return state
  }
}