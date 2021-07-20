import { Toast } from "antd-mobile"
import { fetchSongUrl } from "@/service/index"

export const beforeCanPlayAction = (songIndex: number) => async (dispatch: any, getState: any) => {
  const state = getState()
  const { sid } = state.playlist.data[songIndex]
  const { showController } = state.global
  dispatch({ type: "play-list/current-song-index", value: songIndex })
  dispatch({ type: "play-page/song-id", value: sid })

  if (!showController && window.location.pathname !== "/play") {
    dispatch({ type: "global/show-controller", value: true })
  }

  const song = await fetchSongUrl(sid)
  const { url } = song.data.data[0]
  if (typeof url !== "string") {
    Toast.fail("歌曲暂不支持播放 (￣o￣) . z Z　", 3, () => {}, false)
    return
  } else {
    state.audio.instance.src = url
    dispatch({ type: "audio/src", value: url })
  }
}

export const changeSongAction = (toggleType: string) => (dispatch: any, getState: any) => {
  let index = null
  const state = getState()
  const { data } = state.detail
  const audio = state.audio.instance
  const { currentSongIndex } = state.playlist
  if (!audio.src) return
  if (toggleType === "NEXT") {
    index = data.listData.lentgh <= currentSongIndex ? 0 : currentSongIndex + 1
  } else {
    if (currentSongIndex === 0) {
      return
    } else if (currentSongIndex < data.listData.length) {
      index = currentSongIndex - 1
    }
  }
  dispatch(beforeCanPlayAction(index))
}

export const togglePlayAction = () => (dispatch: any, getState: any) => {
  const state = getState()
  const audio = state.audio.instance
  if (!audio.src) return Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 3, () => {}, false)
  audio.paused ? audio.play() : audio.pause()
  dispatch({ type: "audio/paused", value: audio.paused })
}
