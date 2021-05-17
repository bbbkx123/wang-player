import * as types from "../actionTypes"

const defaultState = {
  lyric: {
    timeList: [],
    lyricList: [],
    tLyricList: [],
  }
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.PLAY_PAGE__LYRIC:
      return {
        ...state,
        lyric: value,
      }
    default:
      return state
  }
}