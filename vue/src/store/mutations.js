import * as types from './mutation-types'

const mutations = {
  [types.SET_PLAYING] (state, playing) {
    state.playing = playing
  },
  [types.SET_SONGLIST] (state, songlist) {
    state.songlist = songlist
  },
  [types.SET_CURRENTINDEX] (state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [types.SET_LYRIC] (state, lyric) {
    state.lyric = lyric
  },
  [types.SET_CURRENTTIME] (state, currentTime) {
    state.currentTime = currentTime
  },
  [types.SET_SHOWLIST] (state, showlist) {
    state.showlist = showlist
  },
  [types.SET_LISTINFO] (state, listInfo) {
    state.listInfo = listInfo
  },
  [types.SET_KEYWORDS] (state, keywords) {
    state.keywords = keywords
  },
  [types.SET_LOOPTYPE] (state, loopType) {
    state.loopType = loopType
  },
  [types.SET_LOOPPLAYLIST] (state, loopPlayList) {
    state.loopPlayList = loopPlayList
  },
  [types.SET_CURRENTSONG] (state, currentSong) {
    state.currentSong = currentSong
  }
}

export default mutations
