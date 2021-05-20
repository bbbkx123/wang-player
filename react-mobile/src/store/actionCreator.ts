import { Toast } from "antd-mobile"

import { fetchSongUrl, fetchSongsDetail } from "@/service/index"
import { formatForSong } from "@/utils/tools"


export const beforeCanPlayAction = (songIndex: number) => async (dispatch: any, getState: any) => {
  dispatch({ type: "play-list/current-song-index", value: songIndex })
  const { playlist } = getState()
  const { sid } = playlist.data[songIndex]
  dispatch({type: "play-page/song-id", value: sid})
  const song = await fetchSongUrl(sid)
  const { url } = song.data.data[0]
  if (typeof url !== "string") {
    Toast.fail("歌曲暂不支持播放 (￣o￣) . z Z　", 3, () => {}, false)
    return
  } else {
    dispatch({ type: "audio/src", value: url })
  }
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
