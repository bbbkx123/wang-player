import { useState, useEffect, useRef, useContext, forwardRef } from "react"
import { useWatch } from "@/utils/hook"
// import {PlayerProps} from "./types"
import { StoreContext } from "@/store"
// import { throttle } from '@/utils/tools';

// forwardRef((props: PlayerProps, audioRef: any)
const Player = (props: any) => {
  const audioRef = useRef<any>(null)
  const { dispatch, EventEmitter } = useContext<any>(StoreContext)
  const { audioSrc, duration } = useContext<any>(StoreContext)
  // const {songUrl} = props

  // const [currentTime, setCurrentTime] = useState<number>(0)
  // const [isProgressChanging, setIsProgressChanging] = useState<boolean>(false)
  // const [duration, setDuration] = useState<number>(0)
  // const [volume, setVolume] = useState<number>(0)
  const [loop, setLoop] = useState<boolean>(false)
  // const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [playStatus, setPlayStatus] = useState<boolean | null>(null)

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
    let currentTime = Number(e.target.currentTime.toFixed(2))
    EventEmitter.emit("timeupdate", { currentTime })
    // if (!isProgressChanging) setCurrentTime(_currentTime)
  }

  // const _onTimeUpdate = (e: any) => {
  //   throttle(onTimeUpdate, 100, 0)([e])
  // }

  const onCanPlay = () => {
    dispatch({ type: "duration", value: audioRef.current.duration })
    audioRef.current.play()
  }

  const handlePlay = (status: boolean) => {
    status ? audioRef.current.play() : audioRef.current.paused()
  }

  const setCurrentTime = (currentTime: any) => {
    audioRef.current.currentTime = currentTime
  }

  useEffect(() => {
    dispatch({ type: "playStatus", value: playStatus })
  }, [playStatus])

  useEffect(() => {
    audioRef.current.volume = 0.5
    setPlayStatus(!audioRef.current.paused)
    return () => {
      setPlayStatus(null)
    }
  }, [])

  useEffect(() => {
    EventEmitter.on("play-song", handlePlay)
    EventEmitter.on("set-current-time", setCurrentTime)
    return () => {
      EventEmitter.off("play-song", handlePlay)
      EventEmitter.off("set-current-time", setCurrentTime)
    }
  }, [])

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  return <audio ref={audioRef} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}

export default Player
