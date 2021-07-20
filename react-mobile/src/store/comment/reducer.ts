import * as types from '@/store/types'

const defaultState = {
	data: [],
}

const reducer = (state: any = defaultState, action: any) => {
	const {type, value} = action
	switch (type) {
    case types.COMMENT__DATA:
      return {
        ...state,
        data: value,
      }
    default:
      return state
  }
}

export default reducer