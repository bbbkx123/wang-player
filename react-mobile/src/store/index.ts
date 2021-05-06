import {createStore, applyMiddleware, combineReducers} from "redux"
import thunk from "redux-thunk"

import PlayListReducer from "./playlist/reducer"
import AudioRedcuer from "./audio/reducer"
import GlobalReducer from "./global/reducer"
import PlayPageReducer from "./playpage/reducer"

const reducer = combineReducers({
  playlist: PlayListReducer,
  audio: AudioRedcuer,
  global: GlobalReducer,
  playpage: PlayPageReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store 