
/**
 * 节流
 * @param {Function} fn 目标函数 
 * @param {Number} wait 间隔时间
 * @param {Number} type 模式  0 ---> timestamp , 1 ---> timeout
 */
export function throttle (fn: any, wait: any, type: any) {
  const context = this
  return function (e?: any) {
    let args = [...arguments]
    if (type === 0) {
      let newTimestamp = new Date().getTime()
      if (!fn._timestamp) fn._timestamp = 0
      if (newTimestamp - fn._timestamp > wait) {
        fn.call(context, ...args)
        fn._timestamp = newTimestamp
      }
    } else {
      if (!fn._timeout) {
        fn._timeout = setTimeout(() => {
          fn.call(context, ...args)
          fn._timeout = null
          clearTimeout(fn._timeout)
        }, wait)
      }
    }
  }
}

// 时间格式化
export const formatForPlayTime = (time: any) :string => {
  if (time === null || typeof time === 'undefined') return '00:00'
  if (time === 0) return '00:00'
  let _time = parseFloat(time)
  if (typeof _time !== 'number') return ''
  let _format = (_time: any) => _time >= 10 ? _time : `0${_time}`
  return _format(Math.floor(_time / 60)) + ':' + _format((_time % 60).toFixed(0))
}


export const formatForPlayListDetail = (data: any) => {
  const { coverImgUrl, name, trackIds, id } = data.playlist;
  const { avatarUrl, nickname } = data.playlist.creator;
  const listData = trackIds.map((item: any) => item.id);
  return {
    avatarUrl,
    nickname,
    name,
    coverImgUrl,
    listData,
    id,
  };
}

export const formatForNewSongList = (data: any) => {
  const { picUrl, name, id } = data;
  return {
    picUrl,
    name,
    artists: data.song.artists.map((item: any) => item.name).join("/"),
    album: {name: data.song.album.name},
    sid: id,
  };
}

export const formatForSearchResult = (data: any) => {
  const { name, id, album, artists } = data;
  const artistsNames = artists.map((item: any) => item.name);
  return {
    artists: artistsNames.join("/"),
    name,
    album: {name: album.name},
    sid: id,
  };
}

export const formatForSong = (song: any, songId: any) => {
  return {
    name: song.name,
    artists: song.ar.map((item: any) => item.name).join("/"),
    album: song.al,
    sid: songId,
  };
}

export const formatForComment = (comment: any) => {
  return comment;
}

export const page = (idArr: any[], pageSize: number) => {
    const pageNumber = Math.ceil(idArr.length / pageSize)
    const page = new Array(pageNumber)
    for (let i = 0; i < pageNumber; i++) {
      page[i] = idArr.slice(i * pageSize, (i +1) * pageSize)
    }
    return page
  }

// export const getSlot = (slots: any, slot?: any, data?: any) => {
//   if (slot === undefined) slot = 'default'
//   if (!slots || !Reflect.has(slots, slot)) {
//     return null;
//   }

//   if (typeof slots[slot] !== 'function') {
//     console.error(`${slot} is not a function!`);
//     return null;
//   }
//   const slotFn = slots[slot];
//   if (!slotFn) return null;
//   return slotFn(data);
// }


