import { fetchSongsDetail } from "@/service/index"
import { formatForSong } from "@/utils/tools"

import { page as formatPageData } from "@/utils/tools"

/**
 * 分页设置
 */

export const detailPageAction =
  (page: any = { size: 10 }) =>
  (dispatch: any, getState: any) => {
    const state1 = getState()
    const { listData } = state1.detail.data
    const { size } = page
    const temp = {
      model: formatPageData(listData, size),
      songsTotal: listData.length,
      pageTotal: Math.ceil(listData.length / size),
    }
    dispatch({ type: "detail/page", value: { ...state1.detail.page, ...page, ...temp } })
  }


/**
 * 获取歌曲
 * @param idArr id集合
 * @returns
 */
 export const fetchPlayListAction = (idArr: any[]) => async (dispatch: any, getState: any) => {
  const ids = idArr.join(",")
  const response = await fetchSongsDetail(ids)
  let value = response.data.songs.map((item: any, index: number) => formatForSong(item, idArr[index]))
  return Promise.resolve(value)
}

