
import EventEmitter from 'events'
import {createContext} from 'react'

export const AppContext = createContext({});

export const defaultState = {
  EventEmitter: new EventEmitter(),

  count: 0,
  startTime: 0,
  playListDetail: null,
}

export const reducer = (state: any, action: any) => {
  let {type, value} = action
  if (type === 'count') {
    return Object.assign({}, state, {count: state.count + 111})
  } else if (type === 'startTime') {
    return Object.assign({}, state, {startTime: value})
  } else if (type === 'playListDetail') {
    return Object.assign({}, state, {playListDetail: value})
  }

  return state
}
