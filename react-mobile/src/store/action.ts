import * as audioAction from "./audio/action"
// import * as detailAction from "./detail/action"
// import * as globalAction from "./global/action"
import * as playPageAction from "./playpage/action"

const action = {
  ...audioAction,
  // ...globalAction,
  ...playPageAction,
}

export default action