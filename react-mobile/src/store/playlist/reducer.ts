import * as types from "../types"

const defaultState = {
  data: [],
  currentSongIndex: null,
}

const reducer = (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
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

export default reducer