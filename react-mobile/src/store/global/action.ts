import { fetchSongsDetail } from "@/service/index"
import { formatForSong } from "@/utils/tools"

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

