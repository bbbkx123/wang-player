import {useState, useEffect, useRef, useContext, forwardRef} from 'react'
import {useWatch} from '@/utils/hook'
import {PlayerProps} from "./types"
import {AppContext} from '@/store'
import { throttle } from '@/utils/tools';


const Player = forwardRef((props: PlayerProps, audioRef: any) => {
  const {dispatch, EventEmitter, playState, duration} = useContext<any>(AppContext)
  const {songUrl} = props

  // const [currentTime, setCurrentTime] = useState<number>(0)
  // const [isProgressChanging, setIsProgressChanging] = useState<boolean>(false)
  // const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [loop, setLoop] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [play, setPlay] = useState(playState)
  

  // const handlePlay = (needPlay: boolean) => {
    // needPlay ? audio.current.play() : audio.current.pause()
    // this.$store.commit('SET_PLAYING', needPlay)
  // }

  const onEnded = () => {
    audioRef.current.pause()
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
    dispatch({type: "currentTime", value: _currentTime})
    EventEmitter.emit('timeupdate')
    // if (!isProgressChanging) setCurrentTime(_currentTime)
  }

  // const _onTimeUpdate = (e: any) => {
  //   throttle(onTimeUpdate, 100, 0)([e])
  // }

  const onCanPlay = () => {
    // index改变后, 统一由canplay进行set
    
    // setCurrentTime(audio.current.currentTime)
    
    // this.$store.commit('SET_CURRENTINDEX', this.songChangeIndex)
    // this.$store.commit('SET_CURRENTSONG', this.playlist[this.songChangeIndex])
    dispatch({type: "duration", value: audioRef.current.duration})
    audioRef.current.play()
  }

  useWatch(play, (prev) => {
    play ? audioRef.current.play() : audioRef.current.pause()
  })


  useEffect(() => {
    setTimeout(() => {
      
      setVolume(audioRef.current.volume)
      setAutoPlay(true)
      audioRef.current.volume = 0.5
    }, 0)
    // this.isPlay = 'icon-bofang'
  }, [])

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required” 
  //  77需要通过查看网站信息 设置允许声音

  return (
    <audio ref={audioRef} src={songUrl} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
  )
})

export default Player