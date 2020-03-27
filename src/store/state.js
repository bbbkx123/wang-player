const state = {
  playing: false,
  playlist: [],
  showlist: [],
  currentIndex: null,
  lyric: {},
  currentTime: null,
  listInfo: {
    coverImgUrl: '',
    name: '',
    creator: {}
  },
  keywords: '',
  loopType: 'shunxubofang',
  loopPlayList: [],
  // 用于记录当前播放歌曲, 避免列表影响(随机模式)
  currentSong: null
}

export default state
