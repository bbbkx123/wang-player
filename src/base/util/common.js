// 歌曲列表页 -- 歌曲信息数据结构处理
export const songDetails = function (data) {
  return data.map((song) => {
    return {
      title: song.name,
      singer: song.ar.map((item) => item.name).join('/'),
      album: song.al.name,
      duration: song.dt,
      songid: song.id,
      picture: song.al.picUrl
    }
  })
} 

// // 歌曲列表页 -- 歌曲信息数据结构处理
// export const songDetailsForSearch = function (data) {
//   return data.songs.map((song) => {
//     return {
//       title: song.name,
//       singer: song.artists.map((item) => item.name).join('/'),
//       album: song.album.name,
//       duration: song.duration,
//       songid: song.id
//     }
//   })
// } 

// 时间格式化
export const formatForTime = (time) => {
  if (time === null || typeof time === 'undefined') return
  if (time === 0) return '00:00'
  time = parseFloat(time)
  if (typeof time !== 'number') return 
  let _format = (time) => time >= 10 ? time : `0${time}`
  return _format(Math.floor(time / 60)) + ':' + _format((time % 60).toFixed(0))
}

/**
 * 节流
 * @param {Function} fn 目标函数 
 * @param {Number} wait 间隔时间
 * @param {Number} type 模式  0 ---> timestamp , 1 ---> timeout
 */
export const throttle = function (fn, wait, type) {
  let context = this
  return function () {
    if (type === 0) {
      let newTimestamp = new Date().getTime()
      if (!fn._timestamp) fn._timestamp = 0
      if (newTimestamp - fn._timestamp > wait) {
        fn.call(context, ...arguments)
        fn._timestamp = newTimestamp
      }
    } else {
      if (!fn._timeout) {
        fn._timeout = setTimeout(() => {
          fn.call(context, ...arguments)
          fn._timeout = null
          clearTimeout(fn._timeout)
        }, wait)
      }
    }
  }
}
