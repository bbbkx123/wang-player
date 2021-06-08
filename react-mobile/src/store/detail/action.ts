import { fetchPlayListAction } from "@/store/global/action"

/**
 * 歌单追加歌曲(目前用于上拉列表加载歌曲)
 * @param songsId
 * @returns
 */
export const appendPlayListAction = () => async (dispatch: any, getState: any) => {
  const state2 = getState()
  const { pageNo, pageTotal } = state2.detail.page
  if (pageNo + 2 > pageTotal) {
    return Promise.resolve({ success: false, msg: "没有选择歌曲 (￣o￣) . z Z　" })
  }
  dispatch({ type: "detail/page-no", value: pageNo + 1 })
  const state1 = getState()
  const idArr = state1.detail.page.model[state1.detail.page.pageNo]
  const value = await dispatch(fetchPlayListAction(idArr))
  const state = getState()
  dispatch({ type: "detail/play-list", value: state.detail.playList.concat(value) })
  return Promise.resolve({ success: true })
}
