import * as types from "../types"

const defaultState = {
  id: null,
  data: null,
  playList: [],
  page: {
    size: 10,
    pageNo: 0,
    songsTotal: null,
    pageTotal: null,
    // modelForClient: [],
    model: [],
  },
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.DETAIL__ID:
      return {
        ...state,
        id: value,
      }
    case types.DETAIL__DATA:
      return {
        ...state,
        data: value,
      }
    case types.DETAIL__PLAY_LIST:
      return {
        ...state,
        playList: value,
      }
    case types.DETAIL__PAGE:
      return {
        ...state,
        page: value,
      }
    default:
      return state
  }
}