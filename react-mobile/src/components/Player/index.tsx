import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { songReadyAction } from "@/store/actionCreator"
import { Toast } from "antd-mobile"

// forwardRef((props: PlayerProps, audioElemRef: any)  --- "react"
const Player = (props: any) => {
  const { playListDetail, currentSongIndex, EventEmitter, audioSrc, dispatchForPlayStatus, diapatchForDuration, Ready, setCurrentSongIndex } = props
  const audioElemRef = useRef<any>(null)
    // 问题: 直接访问playListDetail为null, 暂时将playListDetail存入ref
  const temp = useRef<any>({playListDetail, currentSongIndex})

  const [loop] = useState<boolean>(false)
  // const [autoPlay, setAutoPlay] = useState<boolean>(false)

  // 问题: buffer加载时, currentTime需要loading效果
  const onEnded = () => {
    audioElemRef.current.pause()
    const len = playListDetail.listData.length
    if (currentSongIndex < len - 1) {
      Ready(currentSongIndex + 1)
    } else if (currentSongIndex === len - 1) {
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
    diapatchForDuration(audioElemRef.current.duration)
    audioElemRef.current.play()
  }
  const handlePlay = () => {
    debugger
    const { paused, src } = audioElemRef.current
    if (!src) return Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 3, () => {}, false)
    paused ? audioElemRef.current.play() : audioElemRef.current.pause()
    dispatchForPlayStatus(!audioElemRef.current.paused )
  }

  const setCurrentTime = (currentTime: any) => {
    audioElemRef.current.currentTime = currentTime
  }

  const handleToggleSongs = (toggleType: string) => {
    let index = null
    const {playListDetail, currentSongIndex} = temp.current
    if (!audioElemRef.current || !audioElemRef.current.src) return
    if (toggleType === "NEXT") {
      index = playListDetail.listData.lentgh <= currentSongIndex ? 0 : currentSongIndex + 1
    } else {
      if (currentSongIndex === 0) {
        return
      }else if (currentSongIndex < playListDetail.listData.length) {
        index = currentSongIndex - 1
      }
    }
    Ready(index)
  }

  useEffect(() => {
    audioElemRef.current.volume = 0.5
    return () => {}
  }, [])

  // 问题: react-hooks/exhaustive-deps
  // 解决: 如果不需要在useEffect外使用方法, 可以简单的将方法移入useEffect内, 或者禁用
  useEffect(() => {
    currentSongIndex === null && setCurrentSongIndex(0)
    // 不能生效
    // temp.current = {playListDetail, currentSongIndex}
    EventEmitter.on("player-toggle-status", handlePlay)
    EventEmitter.on("set-current-time", setCurrentTime)
    EventEmitter.on("player-toggle-song", handleToggleSongs)
    return () => {
      EventEmitter.off("player-toggle-status", handlePlay)
      EventEmitter.off("set-current-time", setCurrentTime)
      EventEmitter.off("player-toggle-song", handleToggleSongs)
    }
  }, [])

  useEffect(() => {
    temp.current.playListDetail = playListDetail
  }, [playListDetail])

  useEffect(() => {
    temp.current.currentSongIndex = currentSongIndex
  }, [currentSongIndex])

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  return <audio ref={audioElemRef} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}
const stateToProps = (state: any) => {
  return {
    EventEmitter: state.EventEmitter,
    playListDetail: state.playListDetail,
    playList: state.playList,
    audioSrc: state.audioSrc,
    currentSongIndex: state.currentSongIndex,
  }
}

const dispatchToProps = (dispatch: any) => ({
  diapatchForDuration (duration: any) {
    dispatch({ type: "duration", value: duration })
  },
  dispatchForPlayStatus (playStatus: boolean) {
    dispatch({ type: "playStatus", value: playStatus })
  },
  Ready (currentSongIndex: number) {
    dispatch(songReadyAction(currentSongIndex))
  },
  setCurrentSongIndex (index: number) {
    dispatch({type: "currentSongIndex", value: index})
  },
})

export default connect(stateToProps, dispatchToProps)(Player)
