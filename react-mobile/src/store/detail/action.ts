import { fetchPlayListAction } from "@/store/global/action"
import { detailPageAction } from "@/store/global/action"

import * as api from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"


export const initialActionForListDetail = (detailId: any) => async (dispatch: any, getState: any) => {
  const listDetail = await api.fetchPlayListDetail(detailId)
  dispatch({ type: "detail/data", value: formatForPlayListDetail(listDetail.data) })
  dispatch(detailPageAction())
  const state = getState()
  const ids = state.detail.page.model[0].join(",")
  const response1 = await api.fetchSongsDetail(ids)
  let value = response1.data.songs.map((item: any, index: number) => formatForSong(item, state.detail.page.model[0][index]))
  dispatch({ type: "detail/play-list", value })
  return Promise.resolve()
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
