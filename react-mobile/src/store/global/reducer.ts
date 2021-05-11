import EventEmitter from "events"
import * as types from "../actionTypes"

const defaultState = {
  EventEmitter: new EventEmitter(),
  showMiniPlayer: false,
  detailId: null,
  listDetail: null,
  playList: [],
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.GLOBAL__SHOW_MINI_PLAYER:
      return {
        ...state,
        showMiniPlayer: value,
      }
    case types.GLOBAL__DETAIL_ID:
      return {
        ...state,
        detailId: value,
      }
    case types.GLOBAL__LIST_DETAIL:
      return {
        ...state,
        listDetail: value,
      }
    case types.GLOBAL__PLAY_LIST:
      return {
        ...state,
        playList: value,
      }
    default:
      return state
  }
}