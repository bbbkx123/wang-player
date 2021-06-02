import * as types from "../types"

const defaultState = {
  showController: false,
  searchPage: {},
  showMiniList: false,
}

const reducer = (state: any = defaultState, action: any) => {
  const {type, value} = action
  switch (type) {
    case types.GLOBAL__SHOW_CONTROLLER:
      return {
        ...state,
        showController: value,
      }
    case types.GLOBAL__SEARCH_PAGE:
      return {
        ...state,
        searchPage: value,
      }
    case types.GLOBAL__SHOW_MINI_LIST:
      return {
        ...state,
        showMiniList: value,
      }
    default:
      return state
  }
}

export default reducer