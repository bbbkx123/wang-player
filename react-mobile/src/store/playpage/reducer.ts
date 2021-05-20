import * as types from "../actionTypes"

const defaultState = {
  lyric: {
    timeList: [],
    lyricList: [],
    tLyricList: [],
  },
  currentLyricLine: 0,
  songId: null,
  isProgressChanging: false,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.PLAY_PAGE__LYRIC:
      return {
        ...state,
        lyric: value,
      }
    case types.PLAY_PAGE__CURRENT_LYRIC_LINE:
      return {
        ...state,
        currentLyricLine: value,
      }
    case types.PLAY_PAGE__SONG_ID:
      return {
        ...state,
        songId: value,
      }
    case types.PLAY_PAGE__IS_PROGRESS_CHANGING:
      return {
        ...state,
        isProgressChanging: value,
      }
    default:
      return state
  }
}