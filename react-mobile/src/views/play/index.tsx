import {useState, useEffect, useContext, useRef} from 'react'

import ProgressBar from '@/components/ProgressBar'
import {AppContext} from '@/store'
import { throttle } from "@/utils/tools";

import './index.less'

const Player = () => {
  const audio = useRef<any>()
  const {count, dispatch, EventEmitter} = useContext<any>(AppContext)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [percent, setPercent] = useState<number>(0)
  const [isProgressChanging, setIsProgressChanging] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [loop, setLoop] = useState<boolean>(false)
  const [audioSrc, setAudioSrc] = useState<string>()
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  

  const handlePlay = (needPlay: boolean) => {
    // needPlay ? audio.current.play() : audio.current.pause()
    // this.$store.commit('SET_PLAYING', needPlay)
  }

  const onEnded = () => {
    handlePlay(false)
    // setCurrentTime(0)
    // if (this.currentIndex < this.playlist.length - 1) {
    //     this.songChangeIndex = this.currentIndex + 1
    // } else if (this.currentIndex === this.playlist.length - 1) {
    //     if (this.isLoopPlayList) {
    //         this.songChangeIndex = 0
    //     }
    // }
  }

  const onTimeUpdate = (e: any) => {
    const _currentTime = e.target.currentTime
    // this.$store.commit('SET_CURRENTTIME', currentTime)
    // EventBus.$emit('timeupdate')
    if (!isProgressChanging) setCurrentTime(_currentTime)
  }

  const _onTimeUpdate = (e: any) => {
    throttle(onTimeUpdate, 100, 0)([e])
  }

  const onCanPlay = () => {
    // index改变后, 统一由canplay进行set
    setDuration(audio.current.duration)
    setCurrentTime(audio.current.currentTime)
    setVolume(audio.current.volume)
    // this.$store.commit('SET_CURRENTINDEX', this.songChangeIndex)
    // this.$store.commit('SET_CURRENTSONG', this.playlist[this.songChangeIndex])
    handlePlay(true)
  }

  const init = (src?: string) => {
    if (src) setAudioSrc(src)
    setTimeout(() => {
      setAutoPlay(true)
      audio.current.volume = 0.1
      audio.current.volume = 0.1
    }, 0)
    // this.isPlay = 'icon-bofang'
  }

  useEffect(() => {
    setPercent(currentTime / duration)
  }, [currentTime, duration])

  // progress事件订阅
  useEffect(() => {
    EventEmitter.addListener('progress-changing', (percent: number) => {
      // console.log('progress-changing', percent);
      setIsProgressChanging(true)
      setCurrentTime(audio.current.duration * percent)
    })
    EventEmitter.addListener('progress-change', (percent: number) => {
      // console.log('change', percent);
      setIsProgressChanging(false)
      audio.current.currentTime = percent * duration
      setCurrentTime(audio.current.currentTime)
    })

    return () => {
      EventEmitter.removeAllListeners(['progress-changing', 'progress-change'])
      console.log('listeners remove');
    }
  }, [])

  // 初始audio实例
  useEffect(() => {
    init('./data/Laco-NEXUS.mp3')
    setTimeout(() => {
      // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
      // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required” 
      //  77需要通过查看网站信息 设置允许声音
      
      
    }, 3000)
  }, [])

  // useEffect(() => {
  //   for (let i = 0 ; i < 10; i++) {
  //     setTimeout(() => {
  //       setPercent(i / 10)
  //       console.log(i / 10);
  //     }, i * 1000)
  //   }
  // }, [])



  return (
    <div className="play">
      <div className="play--poster">
      play {count}
      </div>
      <div className="play--control">
        <ProgressBar percent={percent}></ProgressBar>
        <span onClick={() => dispatch({type: 'count'})}>click</span>
      </div>
      <audio ref={audio} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={_onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
    </div>
  )
}

export default Player