import { fetchSongUrl, fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

export const songReadyAction = (songIndex: number) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: "currentSongIndex", value: songIndex })
    const { playListDetail } = getState()
    const sid = playListDetail.listData[songIndex]
    let song = await fetchSongUrl(sid)
    dispatch({ type: "audioSrc", value: song.data.data[0].url })
  }
}

/**
 * 获取歌单信息
 * @param detailId 歌单id
 * @returns
 */
export const fetchPlayListDetailAction = (detailId: string) => {
  return async (dispatch: any, getState: any) => {
    const response = await fetchPlayListDetail(detailId)
    dispatch({ type: "playListDetail", value: formatForPlayListDetail(response.data) })
    const { playListDetail } = getState()
    return Promise.resolve(playListDetail.listData)
  }
}

/**
 * 获取歌曲
 * @param idArr id集合
 * @returns
 */
export const fetchPlayListAction = (idArr: any[]) => {
  return async (dispatch: any, getState: any) => {
    const ids = idArr.join(",")
    const response = await fetchSongsDetail(ids)
    let value = response.data.songs.map((item: any, index: number) => formatForSong(item, idArr[index]))
    return Promise.resolve({value, getState })
  }
}

