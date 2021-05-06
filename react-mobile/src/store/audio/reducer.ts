import * as types from "../actionTypes"

const defaultState = {
  startTime: 0,
  playStatus: null,
  duration: 0,
  // volume: 0,
  src: undefined,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.AUDIO__START_TIME:
      return {
        ...state,
        startTime: value,
      }
    case types.AUDIO__PLAY_STATUS:
      return {
        ...state,
        playStatus: value,
      }
    case types.AUDIO__DURATION:
      return {
        ...state,
        duration: value,
      }
    // case types.AUDIO__VOLUME:
    //   return {
    //     ...state,
    //     volume: value,
    //   }
    case types.AUDIO__SRC:
      return {
        ...state,
        src: value,
      }
    default:
      return state
  }
}