import {useEffect, useRef} from 'react'

/**
 * 节流
 * @param {Function} fn 目标函数 
 * @param {Number} wait 间隔时间
 * @param {Number} type 模式  0 ---> timestamp , 1 ---> timeout
 */
export function throttle (fn: any, wait: any, type: any) {
  const context = this
  return function (_arguments: any[]) {
    if (type === 0) {
      let newTimestamp = new Date().getTime()
      if (!fn._timestamp) fn._timestamp = 0
      if (newTimestamp - fn._timestamp > wait) {
        fn.call(context, ..._arguments)
        fn._timestamp = newTimestamp
      }
    } else {
      if (!fn._timeout) {
        fn._timeout = setTimeout(() => {
          fn.call(context, ..._arguments)
          fn._timeout = null
          clearTimeout(fn._timeout)
        }, wait)
      }
    }
  }
}

// 时间格式化
export const formatForPlayTime = (time: any) => {
  if (time === null || typeof time === 'undefined') return
  if (time === 0) return '00:00'
  time = parseFloat(time)
  if (typeof time !== 'number') return 
  let _format = (time: any) => time >= 10 ? time : `0${time}`
  return _format(Math.floor(time / 60)) + ':' + _format((time % 60).toFixed(0))
}


export const formatForPlayListDetail = (data: any) => {
  const { coverImgUrl, name, trackIds, tracks } = data.data.playlist;
  const { avatarUrl, nickname } = data.data.playlist.creator;
  const listData = trackIds.map((item: any) => item.id);
  return {
    avatarUrl,
    nickname,
    name,
    coverImgUrl,
    listData,
  };
}

export const formatForSong = (song: any, songId: any) => {
  return {
    name: song.name,
    artist: song.ar,
    album: song.al,
    sid: songId,
  };
}