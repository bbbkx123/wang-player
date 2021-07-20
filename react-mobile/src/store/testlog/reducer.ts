import * as types from "@/store/types"

const defaultState = {
  log: [],
}

const reducer = (state: any = defaultState, action: any) => {
  const { type, value } = action
  switch (type) {
    case types.TEST__LOG:
      return {
        ...state,
        log: value,
      }
    default:
      return state
  }
}

export default reducer
