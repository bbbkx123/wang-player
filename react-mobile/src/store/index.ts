
import EventEmitter from 'events'
import {createContext} from 'react'

export const AppContext = createContext({});

export const defaultState = {
  EventEmitter: new EventEmitter(),

  count: 0,
  startTime: 0,
  playListDetail: null,
  currentSongIndex: null,
  playState: false,
  currentTime: null,
  duration: null,
  volume: null,
}

export const reducer = (state: any, action: any) => {
  let {type, value} = action
  if (type === 'count') {
    return Object.assign({}, state, {count: state.count + 111})
  } else if (type === 'startTime') {
    return Object.assign({}, state, {startTime: value})
  } else if (type === 'playListDetail') {
    return Object.assign({}, state, {playListDetail: value})
  } else if (type === 'currentSongIndex') {
    return Object.assign({}, state, {currentSongIndex: value})
  } else if (type === 'playState') {
    return Object.assign({}, state, {playState: value})
  } else if (type === 'currentTime') {
    return Object.assign({}, state, {currentTime: value})
  } else if (type === 'duration') {
    return Object.assign({}, state, {duration: value})
  } else if (type === 'volume') {
    return Object.assign({}, state, {volume: value})
  }

  return state
}
