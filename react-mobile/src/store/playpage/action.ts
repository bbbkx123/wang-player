import {fetchLyric} from "@/service"
import {beforeCanPlayAction} from "@/store/action"

export const fetchLyricAction = (id: string | number) => async (dispatch: any, getState: any) => {
  let res = await fetchLyric(id)
  let {lyric} = res.data.lrc
  let timeList: any = lyric.match(/\[\d{2}:\d{2}\.\d{2,}\]/gm)
  const lyricList = lyric.replace(/\[\d{2}:\d{2}\.\d{2,}\]/gm, '').replace(/\n/gm, ';').split(';')
  const tLyricList: any[] = []

  timeList = timeList.map((item: any) => {
    let text = item.substring(1, item.length - 2)
    let arr = text.replace(':', ',').replace('.', ',').split(',')
    return parseInt(arr[0]) * 60 + parseInt(arr[1]) + parseFloat(arr[2]) / 1000
  })

  dispatch({type: "play-page/lyric", value:{timeList, lyricList, tLyricList}})

}

export const getCurrentLineNumAction = (time: number) => (dispatch: any, getState: any) => {
  const state = getState()
  const {timeList} = state.playpage.lyric
  let line = null
  for (let i = 0; i < timeList.length; i++) {
    if (
      (timeList[i] < time && time < timeList[i + 1]) ||
      (timeList[i] === time)
    ) {
      line = i
    } else if (time > timeList[timeList.length - 1]) {
      line = timeList.length - 1
    }
  }
  dispatch({type: "play-page/current-lyric-line", value: line})
}

export const GetterIsProgressChanging = () => (dispatch: any, getState: any) => {
  const state = getState()
  return state.playpage.isProgressChanging
}

export const setCurrentTimeAction = (currentTime: any) => (dispatch: any, getState: any) => {
  const state = getState()
  state.global.audio.currentTime = currentTime
}

export const changeSongAction = (toggleType: string) => (dispatch: any, getState: any) => {
  let index = null
  const state = getState()
  const {listDetail} = state.global
  const {currentSongIndex} = state.playlist
  if (!state.global.audio.src) return
  if (toggleType === "NEXT") {
    index = listDetail.listData.lentgh <= currentSongIndex ? 0 : currentSongIndex + 1
  } else {
    if (currentSongIndex === 0) {
      return
    } else if (currentSongIndex < listDetail.listData.length) {
      index = currentSongIndex - 1
    }
  }
  dispatch(beforeCanPlayAction(index))
}

export const changeProgressAction = (percent: number) => (dispatch: any, getState: any) => {
  const state = getState()
  const {duration} = state.global.audio
  dispatch({type: "play-page/percent", value: percent})
  dispatch(setCurrentTimeAction(duration * percent))
}