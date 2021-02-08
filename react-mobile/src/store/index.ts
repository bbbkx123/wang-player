
import EventEmitter from 'events'
import {createContext} from 'react'

export const AppContext = createContext({});

export const defaultState = {
  count: 0,
  startTime: 0,
  EventEmitter: new EventEmitter()
}

export const reducer = (state: any, action: any) => {
  let {type, value} = action
  if (type === 'count') {
    return Object.assign({}, state, {count: state.count + 111})
  } else if (type === 'startTime') {
    return Object.assign({}, state, {startTime: value})
  }

  return state
}
