import { useState, useEffect, useRef, useContext, forwardRef } from "react"
import {connect} from "react-redux"
import {songPlayAction} from "@/store/actionCreator"
import {Toast} from "antd-mobile"

// forwardRef((props: PlayerProps, audioRef: any)
const Player = (props: any) => {
  const {playListDetail, currentSongIndex,EventEmitter, audioSrc, dispatch} = props
  const audioRef = useRef<any>(null)

  const [loop, setLoop] = useState<boolean>(false)
  // const [autoPlay, setAutoPlay] = useState<boolean>(false)

  // 问题: buffer加载时, currentTime需要loading效果

  const onEnded = () => {
    audioRef.current.pause()
    const len = playListDetail.listData.length
    if (currentSongIndex < len - 1) {
      dispatch(songPlayAction(currentSongIndex + 1))
    } else if (currentSongIndex=== len - 1) {
        // if (this.isLoopPlayList) {
        //     this.songChangeIndex = 0
        // }
    }
  }

  const onTimeUpdate = (e: any) => {
    let currentTime = Number(e.target.currentTime.toFixed(2))
    EventEmitter.emit("timeupdate", { currentTime })
  }

  const onCanPlay = () => {
    dispatch({ type: "duration", value: audioRef.current.duration })
    audioRef.current.play()
    dispatch({type: "playStatus", value: true})
  }

  const handlePlay = () => {
    const {paused, src} = audioRef.current
    if (!src) return Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 3, () => {}, false)
    paused ? audioRef.current.play() : audioRef.current.pause()
    dispatch({type: "playStatus", value: !audioRef.current.paused})
  }

  const setCurrentTime = (currentTime: any) => {
    audioRef.current.currentTime = currentTime
  }

  const handleToggleSongs = (toggleType: string) => {
    let index = null
    if (!audioRef.current || !audioRef.current.src) return;
    if (toggleType === "PREV") {
      index = playListDetail.listData.lentgh <= currentSongIndex ? 0 : currentSongIndex + 1
    } else {
      index = currentSongIndex === 0 ? playListDetail.listData.length - 1 : currentSongIndex - 1
    }
    // dispatch(songPlayAction(index))
  }

  useEffect(() => {
    audioRef.current.volume = 0.5
    return () => {}
  }, [])

  useEffect(() => {
    EventEmitter.on("player-toggle-status", handlePlay)
    EventEmitter.on("set-current-time", setCurrentTime)
    EventEmitter.on("player-toggle-song", handleToggleSongs)
    return () => {
      EventEmitter.off("player-toggle-status", handlePlay)
      EventEmitter.off("set-current-time", setCurrentTime)
      EventEmitter.off("player-toggle-song", handleToggleSongs)
    }
  }, [])

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  return <audio ref={audioRef} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}
const stateToProps = (state: any) => ({
  EventEmitter: state.EventEmitter,
  playListDetail: state.playListDetail,
  playList: state.playList,
  audioSrc: state.audioSrc,
  currentSongIndex: state.currentSongIndex,
})

const dispatchToProps = (dispatch: any) => ({
  dispatch () {
    return dispatch
  }
})

export default connect(stateToProps, dispatchToProps)(Player)
