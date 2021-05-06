import EventEmitter from "events"

const defaultState = {
  EventEmitter: new EventEmitter(),
}

export default (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    // case types.PLAY_LIST_DETAIL:
    //   return {
    //     ...state,
    //     playListDetail: value,
    //   }
    default:
      return state
  }
}