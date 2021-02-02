const state = {
  playing: false,
  songlist: [], // 播放列表原始数据
  showlist: [], // 歌单列表数据
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
