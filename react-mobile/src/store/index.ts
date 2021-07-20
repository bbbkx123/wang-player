import {createStore, applyMiddleware, combineReducers} from "redux"
import thunk from "redux-thunk"

import PlayListReducer from "./playlist/reducer"
import DetailReducer from "./detail/reducer"
import AudioRedcuer from "./audio/reducer"
import GlobalReducer from "./global/reducer"
import PlayPageReducer from "./playpage/reducer"
// views 用于记录页面数据
import RecommendReducer from "./recommend/reducer"
import CommentReducer from "./comment/reducer"

// 用于记录日志
import TestLog from "./testlog/reducer"


const reducer = combineReducers({
  "playlist": PlayListReducer,
  "audio": AudioRedcuer,
  "global": GlobalReducer,
  "playpage": PlayPageReducer,
  "detail": DetailReducer,
  "recommend": RecommendReducer,
  "comment": CommentReducer,
  "test": TestLog,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store 