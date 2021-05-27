import { fetchPlayListAction } from "@/store/global/action"
import { detailPageAction } from "@/store/global/action"

import { fetchPlayListDetail } from "@/service/index"
import { formatForPlayListDetail } from "@/utils/tools"

/**
 * 获取歌单信息
 * @param detailId 歌单id
 * @returns
 */
export const fetchPlayListDetailAction = (detailId: string) => async (dispatch: any, getState: any) => {
  const response = await fetchPlayListDetail(detailId)
  dispatch({ type: "detail/data", value: formatForPlayListDetail(response.data) })
  const { detail } = getState()
  return Promise.resolve(detail.data.listData)
}

export const initialActionForListDetail = (detailId: any) => async (dispatch: any, getState: any) => {
  await dispatch(fetchPlayListDetailAction(detailId))
  dispatch(detailPageAction())
  const state = getState()
  let value = await dispatch(fetchPlayListAction(state.detail.page.model[0]))
  dispatch({ type: "detail/play-list", value })
  return Promise.resolve({success: true})
}

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
  dispatch({ type: "detail/page", value: { ...state2.detail.page, pageNo: pageNo + 1 } })
  const state1 = getState()
  const idArr = state1.detail.page.model[state1.detail.page.pageNo]
  const value = await dispatch(fetchPlayListAction(idArr))
  const state = getState()
  dispatch({ type: "detail/play-list", value: state.detail.playList.concat(value) })
  return Promise.resolve({ success: true })
}
