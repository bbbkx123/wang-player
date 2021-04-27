import EventEmitter from "events"
import * as types from "./actionTypes"

interface actionType {
  type: string
  value?: any
  // action?: Function
}

// interface storeStateTypes {
//   EventEmitter: any
//   startTime: number
//   // 描述歌单的信息(包含歌单名称, 创建者和 歌曲ids等)
//   playListDetail: any
//   // 歌单歌曲详细信息
//   playList: any[]
//   currentSongIndex: number | null
//   playStatus: boolean | null
//   duration: number
//   volume: number
//   audioSrc: string | undefined
// }

const defaultState: any = {
  EventEmitter: new EventEmitter(),

  startTime: 0,
  playListDetail: {
    avatarUrl: "",
  },
  playList: [],
  currentSongIndex: null,
  playStatus: null,
  // currentTime: null,
  duration: 0,
  volume: 0,
  audioSrc: undefined,


  test: 0,
}

const reducer = (state: any = defaultState, action: actionType) => {
  let { type, value } = action
  switch (type) {
    case types.START_TIME:
      return {
        ...state,
        startTime: value,
      }
    case types.PLAY_LIST_DETAIL:
      return {
        ...state,
        playListDetail: value,
      }
    case types.PLAY_LIST:
      return {
        ...state,
        playList: value,
      }
    case types.CURRENT_SONG_INDEX:
      return {
        ...state,
        currentSongIndex: value,
      }
    case types.PLAY_STATUS:
      return {
        ...state,
        playStatus: value,
      }
    case types.DURATION:
      return {
        ...state,
        duration: value,
      }
    case types.VOLUME:
      return {
        ...state,
        volume: value,
      }
    case types.AUDIO_SRC:
      return {
        ...state,
        audioSrc: value,
      }
    case types.TEST:
      return {
        ...state,
        test: value,
      }
    default:
      return state
  }
}

export default reducer
