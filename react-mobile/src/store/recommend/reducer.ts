import * as types from "@/store/types"

const defaultState = {
  banner: [],
  personalization: [],
  newSongList: [],
}

const reducer = (state: any = defaultState, action: any) => {
  const { type, value } = action
  switch (type) {
    case types.RECOMMEND__BANNER:
      return {
        ...state,
        banner: value,
      }
    case types.RECOMMEND__PERSONALIZATION:
      return {
        ...state,
        personalization: value,
      }
    case types.RECOMMEND__NEW_SONG_LIST:
      return {
        ...state,
        newSongList: value,
      }
    default:
      return state
  }
}

export default reducer
