import * as types from "@/store/types"

const defaultState = {
  banner: [],
  personalize: [],
  newSongList: [],
}

export default (state: any = defaultState, action: any) => {
  const { type, value } = action
  switch (type) {
    case types.RECOMMEND__BANNER:
      return {
        ...state,
        banner: value,
      }
    case types.RECOMMEND__PERSONALIZE:
      return {
        ...state,
        personalize: value,
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
