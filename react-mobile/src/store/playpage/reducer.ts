import * as types from "../actionTypes"

const defaultState = {
  lyric: {
    timeList: [],
    lyricList: [],
    tLyricList: [],
  },
  currentLyricLine: 0,
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
    default:
      return state
  }
}