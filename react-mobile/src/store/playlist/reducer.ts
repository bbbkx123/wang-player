import * as types from "../actionTypes"

const defaultState = {
  detail: null,
  data: [],
  currentSongIndex: null,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.PLAY_LIST__DETAIL:
      return {
        ...state,
        detail: value,
      }
    case types.PLAY_LIST__DATA:
      return {
        ...state,
        data: value,
      }
    case types.PLAY_LIST__CURRENT_SONG_INDEX:
      return {
        ...state,
        currentSongIndex: value,
      }
    default:
      return state
  }
}