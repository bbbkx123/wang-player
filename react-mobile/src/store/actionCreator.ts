import { Toast } from "antd-mobile"

import { fetchSongUrl, fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

export const beforeCanPlayAction = (songIndex: number) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: "play-list/current-song-index", value: songIndex })
    const { playlist } = getState()
    const { sid } = playlist.data[songIndex]
    const song = await fetchSongUrl(sid)
    const { url } = song.data.data[0]
    if (typeof url !== "string") {
      Toast.fail("歌曲暂不支持播放 (￣o￣) . z Z　", 3, () => {}, false)
      return
    } else {
      dispatch({ type: "audio/src", value: url })
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
    return Promise.resolve(value)
  }
}



export const pullingUp =  (songsId: any) => async (dispatch: any, getState: any) => {
  // const {bscroll} = instance
  // const { totalPage, modelForPage } = pageRef.current
  // if (pageRef.current.pageNo + 2 > totalPage) {
  //   Toast.fail('没有选择歌曲 (￣o￣) . z Z　', 1.5, () => {}, false)
  //   return Promise.resolve()
  // }
  // // pageNo从0开始, 需要转为实际页码
  // pageRef.current.pageNo += 1
  // const songsId = modelForPage[pageRef.current.pageNo]
  // debugger
  const value = await dispatch(fetchPlayListAction(songsId))
  const state = getState()
  dispatch({type: 'global/play-list', value: state.global.playList.concat(value)})
  // bscroll.finishPullUp()
  // bscroll.refresh()
}
