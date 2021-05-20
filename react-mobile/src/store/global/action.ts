import {fetchPlayListAction} from "@/store/actionCreator"
import { page as formatPageData } from '@/utils/tools'

import { fetchPlayListDetail } from "@/service/index"
import { formatForPlayListDetail } from "@/utils/tools"

/**
 * 获取歌单信息
 * @param detailId 歌单id
 * @returns
 */
 export const fetchPlayListDetailAction = (detailId: string) => async (dispatch: any, getState: any) => {
  const response = await fetchPlayListDetail(detailId)
  dispatch({ type: "global/list-detail", value: formatForPlayListDetail(response.data) })
  const { global } = getState()
  return Promise.resolve(global.listDetail.listData)
 }
/**
 * 分页设置
 */

 export const detailPageAction = (page: any = {size: 10}) => (dispatch: any, getState: any) => {
  const state1 = getState()
  const {listData} = state1.global.listDetail
  const {size} = page
  const temp = {
    model: formatPageData(state1.global.listDetail.listData, size),
    songsTotal: listData.length,
    pageTotal: Math.ceil(listData.length / size)
  }
  console.log({...state1.global.detailPage, ...page, ...temp});
  
  dispatch({type: "global/detail-page", value: {...state1.global.detailPage, ...page, ...temp}})
}

export const initialActionForListDetail = (detailId: any) => async (dispatch: any, getState: any) => {
  await dispatch(fetchPlayListDetailAction(detailId))
  dispatch(detailPageAction())
  const state = getState()
  let value = await dispatch(fetchPlayListAction(state.global.detailPage.model[0]))
  dispatch({ type: 'global/play-list', value })
}


/**
 * 歌单追加歌曲(目前用于上拉列表加载歌曲)
 * @param songsId
 * @returns
 */
 export const appendPlayListAction = () => async (dispatch: any, getState: any) => {
  const state2 = getState()
  const {detailPage} = state2.global
  if (detailPage.pageNo + 2 > detailPage.pageTotal) {
    return Promise.resolve({success: false, msg: "没有选择歌曲 (￣o￣) . z Z　"})
  }
  dispatch({type: "global/detail-page", value: {...detailPage, pageNo: detailPage.pageNo + 1}})
  const state1 = getState()
  const idArr = state1.global.detailPage.model[state1.global.detailPage.pageNo]
  const value = await dispatch(fetchPlayListAction(idArr))
  const state = getState()
  dispatch({ type: "global/play-list", value: state.global.playList.concat(value) })
  return Promise.resolve({success: true})
  
}