import * as types from "../types"

const defaultState = {
  lyric: {
    timeList: [],
    lyricList: [],
    tLyricList: [],
  },
  currentLyricLine: 0,
  songId: null,
  isProgressChanging: false,
  percent: 0,
  // deg: 0,
  // showLyric: false,
}

const reducer = (state: any = defaultState, action: any) => {
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
    case types.PLAY_PAGE__PERCENT:
      return {
        ...state,
        percent: value,
      }
    // case types.PLAY_PAGE__DEG:
    //   return {
    //     ...state,
    //     deg: value,
    //   }
    // case types.PLAY_PAGE__SHOW_LYRIC:
    //   return {
    //     ...state,
    //     showLyric: value,
      // }
    default:
      return state
  }
}

export default reducer