import * as types from "../types"

const defaultState = {
  paused: null,
  duration: 0,
  src: undefined,
  instance: null,
  timeupdate: null,
}

const reducer = (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.AUDIO__INSTANCE:
      return {
        ...state,
        instance: value,
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
    case types.AUDIO__PAUSED:
      return {
        ...state,
        paused: value,
      }
    case types.AUDIO__TIME_UPDATE:
      return {
        ...state,
        timeupdate: value,
      }
    default:
      return state
  }
}

export default reducer