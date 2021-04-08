import {useState, useEffect, useContext, useRef} from 'react'

import ProgressBar from '@/components/ProgressBar'
import {AppContext} from '@/store'
import {fetchPlayListDetail, fetchSongsDetail, fetchSongUrl} from '@/service/index'
import {useWatch} from '@/utils/hook'

import Player from '@/components/Player'

import './index.less'

const PlayPage = () => {
  // const PlayerRef = useRef<any>(null)

  const audioRef = useRef<any>(null)

  const { dispatch, EventEmitter} = useContext<any>(AppContext)
  const {count, playListDetail, currentTime, duration} = useContext<any>(AppContext)
  // const [_currentTime, setCurrentTime] = useState<number>(currentTime)
  const [percent, setPercent] = useState<number>(0)
  const [isProgressChanging, setIsProgressChanging] = useState<boolean>(false)
  // const [_duration, setDuration] = useState<number>(duration)
  // const [volume, setVolume] = useState<number>(0)
  // const [loop, setLoop] = useState<boolean>(false)
  const [audioSrc, setAudioSrc] = useState<string>("")
  
  const getPlayListDetail = () => {
    return fetchPlayListDetail('129219563').then((res: any) => {
      const { coverImgUrl, name, trackIds, tracks } = res.data.playlist
      const { avatarUrl, nickname } = res.data.playlist.creator
      const listData = trackIds.map((item: any) => item.id)
      const playListDetail = {
        avatarUrl,
        nickname,
        name,
        coverImgUrl,
        listData
      }
      return Promise.resolve(playListDetail)
      
    }).then((res: any) => {
      let ids = res.listData.splice(0, 10).reduce((prev: any, cur: any) => prev + cur + ',', '')
      ids = ids.substring(0, ids.length - 1)
      let idArr = ids.split(',')
      return fetchSongsDetail(ids).then((res1: any) => {
        let _listData = res1.data.songs.map((item: any, index: number) => {
          return {
            name: item.name,
            artist: item.ar,
            album: item.al,
            sid: idArr[index]
          }
        })

        dispatch({type: 'playListDetail', value: {
          ...res,
          listData: _listData
        }})
      })
    })
  }

  const getSongUrl = (sid: string) => {
    return fetchSongUrl(sid).then((res: any) => {
      return Promise.resolve(res.data.data[0].url)
    })
  }

  useEffect(() => {
    // if (typeof currentTime === 'number' && typeof duration === 'number') {
    //   setPercent(currentTime / duration)
    // }
  }, [currentTime, duration])

  const fun123 = () => {
    // setPercent(currentTime / duration)
    console.log(currentTime, duration);
  }

  // progress事件订阅
  useEffect(() => {
    // useCallback
    const eventsName = EventEmitter.eventNames()
    if (!eventsName.includes("progress-changing")) {
      EventEmitter.addListener('progress-changing', (percent: number) => {
        console.log('progress-changing', percent);
        setIsProgressChanging(true)
        setPercent(percent)
        console.log("progress-changing");
      }, {passive: false})
    }
    
    if (!eventsName.includes("progress-changing")) {
      EventEmitter.addListener('progress-change', (percent: number) => {
        // console.log('change', percent);
        setPercent(percent)
        setIsProgressChanging(false)
        console.log("progress-change");
        // audioRef.current.currentTime = duration * percent
      }, {passive: false})
    }
    
  
    if (!eventsName.includes("progress-changing")) { 
      EventEmitter.addListener('timeupdate', () => {
        fun123()
      })
    }
  
  }, [currentTime, duration])

  useEffect(() => {
    return () => {
      EventEmitter.removeAllListeners(['progress-changing', 'progress-change', 'timeupdate'])
      console.log('listeners remove');
    }
  }, [])

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required” 
  //  77需要通过查看网站信息 设置允许声音
  useEffect(() => {
    getPlayListDetail()
    setTimeout(() => {
      console.log(audioRef);
      console.log();
    }, 2000)
  }, [])


  const fun1 = () => {
    // () => dispatch({type: 'count'})
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
  }


  useWatch(playListDetail, () => {
    getSongUrl(playListDetail.listData[0].sid).then((url: any) => setAudioSrc(url))
  })

  return (
    <div className="play">
      <div className="play--poster">
      play {count}
      </div>
      <div className="play--control">
        <ProgressBar percent={percent}></ProgressBar>
        <span>{currentTime}</span>
        <span onClick={() => fun1()}>click</span>
      </div>
      <Player ref={audioRef} songUrl={audioSrc}></Player>
    </div>
  )
}

export default PlayPage