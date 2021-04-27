import { fetchSongUrl, fetchPlayListDetail, fetchSongsDetail } from "@/service/index";
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

export const testAction = () => {
  return (dispatch: any, getState: any) => {
    let state = getState()
    dispatch({
      type: "test",
      value: 22231213431
    })
  }
}



export const songPlayAction = (songIndex: number) => {
  return (dispatch: any, getState: any) => {
    dispatch({ type: "currentSongIndex", value: songIndex });
    const { playListDetail } = getState();
    const { sid } = playListDetail.listData[songIndex];
    fetchSongUrl(sid).then((res: any) => {
      dispatch({ type: "audioSrc", value: res.data.data[0].url });
    });
  };
};

/**
 * 获取歌单信息
 * @param detailId 歌单id
 * @returns 
 */
export const fetchPlayListDetailAction = (detailId: string) => {
  return async (dispatch: any, getState: any) => {
    const response = await fetchPlayListDetail(detailId)
    dispatch({type: "playListDetail", value: formatForPlayListDetail(response.data) })
    const {playListDetail} = getState()
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
    const _playList = response.data.songs.map((item: any, index: number) => formatForSong(item, idArr[index]))
    dispatch({type: "playList", value: _playList})
    const {playList} = getState()
    return Promise.resolve(playList)
  }
}


