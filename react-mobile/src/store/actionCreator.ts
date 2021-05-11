import {Toast} from "antd-mobile"

import { fetchSongUrl, fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

export const songReadyAction = (songIndex: number) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: "play-list/current-song-index", value: songIndex })
    const { playlist } = getState()
    const {sid} = playlist.data[songIndex]
    let song = await fetchSongUrl(sid)
    const {url} = song.data.data[0]
    if (typeof url !== "string") {
      Toast.fail("歌曲暂不支持播放 (￣o￣) . z Z　", 3, () => {}, false)
      return
    } else {
      dispatch({ type: "audio/src", value:  url})
    }
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
    dispatch({ type: "global/list-detail", value: formatForPlayListDetail(response.data) })
    const { global } = getState()
    return Promise.resolve(global.listDetail.listData)
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
    // 注意
    return Promise.resolve({value, getState })
  }
}


