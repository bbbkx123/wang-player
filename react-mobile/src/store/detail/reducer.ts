import * as types from "../types"

const defaultState: DetailState = {
  id: null,
  data: null,
  playList: [],
  pageSize: 10,
  pageNo: 0,
  songsTotal: 0,
  pageTotal: 0,
  pageModel: [],
}

const reducer = (state: DetailState = defaultState, action: any) => {
  const { type, value } = action
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
    case types.DETAIL__SONGS_TOTAL:
      return {
        ...state,
        songsTotal: value,
      }
    case types.DETAIL__PAGE_TOTAL:
      return {
        ...state,
        pageTotal: value,
      }
    case types.DETAIL__PAGE_MODEL:
      return {
        ...state,
        pageModel: value,
      }
    default:
      return state
  }
}

export default reducer
