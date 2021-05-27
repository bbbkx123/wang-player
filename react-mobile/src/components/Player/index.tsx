import { useState, useEffect, useRef } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { beforeCanPlayAction } from "@/store/audio/action"

const Player = (props: any) => {
  const { history, currentSongIndex, EventEmitter, showController, playList } = props
  const { setDuration, toggleSong, setShowController, setInstance, setPaused } = props
  const audioElemRef = useRef<any>(null)
  const [loop] = useState<boolean>(false)

  // !问题: buffer加载时, currentTime需要loading效果
  const onEnded = () => {
    audioElemRef.current.pause()
    setPaused(true)
    if (playList.length > 0) {
      if (currentSongIndex < playList.length - 1) {
        toggleSong(currentSongIndex + 1)
      } else if (currentSongIndex === playList.length - 1) {
        // if (this.isLoopPlayList) {
        //     this.songChangeIndex = 0
        // }
      }
    }
  }

  const onTimeUpdate = (e: any) => {
    const currentTime = Number(e.target.currentTime.toFixed(2))
    EventEmitter.emit("timeupdate", { currentTime })
  }

  const onCanPlay = () => {
    const { pathname } = history.location
    setDuration(audioElemRef.current.duration)
    setPaused(false)
    if (!showController && pathname !== "/play") setShowController(true)
  }

  useEffect(() => {
    audioElemRef.current.volume = 0
    setInstance(audioElemRef.current)
    return () => {}
  }, [])

  // *问题: react-hooks/exhaustive-deps
  // 解决: 如果不需要在useEffect外使用方法, 可以简单的将方法移入useEffect内, 或者禁用

  // *问题: 直接访问listDetail为null, 暂时将listDetail存入ref
  // 在useEffect(() => {}, [])访问, listDetail是初始值null, 暂时这样实现

  return <audio ref={audioElemRef}  autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}
const stateToProps = (state: any) => {
  return {
    EventEmitter: state.global.EventEmitter,
    playList: state.playlist.data,
    currentSongIndex: state.playlist.currentSongIndex,
    showController: state.global.showController,
  }
}

const dispatchToProps = (dispatch: any) => ({
  setDuration(duration: any) {
    dispatch({ type: "audio/duration", value: duration })
  },
  setShowController(status: boolean) {
    dispatch({ type: "global/show-controller", value: status })
  },
  toggleSong(currentSongIndex: number) {
    dispatch(beforeCanPlayAction(currentSongIndex))
  },
  setInstance (audio: any) {
    dispatch({type: "audio/instance", value: audio})
  },
  setPaused (status: boolean) {
    dispatch({type: "audio/paused", value: status})
  },
})

export default connect(stateToProps, dispatchToProps)(withRouter(Player))
