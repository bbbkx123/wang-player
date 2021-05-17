import {lyricText} from "@/views/PlayPage/lyric"


export const fetchLyricAction = () => (dispatch: any, getState: any) => {
  const timeList = lyricText.match(/\[\d{2}:\d{2}\.\d{2,}\]/gm)
  const lyricList = lyricText.replace(/\[\d{2}:\d{2}\.\d{2,}\]/gm, '').replace(/\n/gm, ';').split(';')
  const tLyricList: any[] = []
  dispatch({type: "play-page/lyric", value:{timeList, lyricList, tLyricList}})

}