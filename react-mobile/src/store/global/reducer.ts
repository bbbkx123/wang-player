import EventEmitter from "events"
import * as types from "../types"

const defaultState = {
  EventEmitter: new EventEmitter(),
  showController: false,
  detailId: null,
  listDetail: null,
  playList: [],
  detailPage: {
    size: 10,
    pageNo: 0,
    songsTotal: null,
    pageTotal: null,
    // modelForClient: [],
    model: [],
  },
  searchPage: {},
  showMiniList: false,
  audio: null,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.GLOBAL__SHOW_CONTROLLER:
      return {
        ...state,
        showController: value,
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
    case types.GLOBAL__DETAIL_PAGE:
      return {
        ...state,
        detailPage: value,
      }
    case types.GLOBAL__SEARCH_PAGE:
      return {
        ...state,
        searchPage: value,
      }
    case types.GLOBAL__SHOW_MINI_LIST:
      return {
        ...state,
        showMiniList: value,
      }
    case types.GLOBAL__AUDIO:
      return {
        ...state,
        audio: value,
      }
    default:
      return state
  }
}