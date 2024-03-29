import { fetchLyric } from "@/service"

export const fetchLyricAction = (id: string | number) => async (dispatch: any, getState: any) => {
  let res = await fetchLyric(id)
  let regExp = /\[\d{2}:\d{2}(\.\d{2,})?\]/gm
  if (!res.data.hasOwnProperty('lrc')) {
    dispatch({ type: "play-page/lyric", value: { timeList: [], lyricList: [], tLyricList: [] } })
    return 
  }
  let { lyric } = res.data.lrc
  let timeList: any = lyric.match(regExp)
  // 存在没有时间戳的情况（例如id=22270186）
  if (timeList === null) {
    dispatch({ type: "play-page/lyric", value: { timeList: [], lyricList: [], tLyricList: [] } })
    return 
  }
  const lyricList = lyric
    .replace(regExp, "")
    .replace(/\n/gm, ";")
    .split(";")
  const tLyricList: any[] = []

  timeList = timeList.map((item: any) => {
    let text = item.substring(1, item.length - 2)
    let arr = text.replace(":", ",").replace(".", ",").split(",")
    return parseInt(arr[0]) * 60 + parseInt(arr[1]) + parseFloat(arr[2]) / 1000
  })

  dispatch({ type: "play-page/lyric", value: { timeList, lyricList, tLyricList } })
}

export const getCurrentLineNumAction = (time: number) => (dispatch: any, getState: any) => {
  const state = getState()
  const { timeList } = state.playpage.lyric
  let line = null
  for (let i = 0; i < timeList.length; i++) {
    if ((timeList[i] < time && time < timeList[i + 1]) || timeList[i] === time) {
      line = i
    } else if (time > timeList[timeList.length - 1]) {
      line = timeList.length - 1
    }
  }
  dispatch({ type: "play-page/current-lyric-line", value: line })
}
