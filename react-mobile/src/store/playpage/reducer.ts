import * as types from "../actionTypes"

const defaultState = {
  // deg: null,
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    // case types.PLAY_PAGE__DEG:
    //   return {
    //     ...state,
    //     deg: value,
    //   }
    default:
      return state
  }
}