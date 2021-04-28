import { fetchSongUrl, fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

export const testAction = () => {
  return (dispatch: any, getState: any) => {
    let state = getState()
    dispatch({
      type: "test",
      value: 22231213431,
    })
  }
}

export const songPlayAction = (songIndex: number) => {
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
    const state1 = getState()
    const ids = idArr.join(",")
    const response = await fetchSongsDetail(ids)
    let temp = response.data.songs.map((item: any, index: number) => formatForSong(item, idArr[index]))
    temp = state1.playList.concat(temp) 
    dispatch({ type: "playList", value: temp })
    const state2 = getState()
    return Promise.resolve(state2.playList)
  }
}
