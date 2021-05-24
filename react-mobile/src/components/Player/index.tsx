import { useState, useEffect, useRef } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { beforeCanPlayAction } from "@/store/action"
import { throttle } from "@/utils/tools"

const Player = (props: any) => {
  const { history, currentSongIndex, EventEmitter, audioSrc, showController, playList } = props
  const { dispatchForPlayStatus, diapatchForDuration, toggleSong, dispatchForShowController, dispatchForAudio } = props
  const audioElemRef = useRef<any>(null)
  const [loop] = useState<boolean>(false)

  // !问题: buffer加载时, currentTime需要loading效果
  const onEnded = () => {
    audioElemRef.current.pause()
    if (playList.length > 0) {
      if (currentSongIndex < playList.length - 1) {
        toggleSong(currentSongIndex + 1)
      } else if (currentSongIndex === playList.length - 1) {
        // if (this.isLoopPlayList) {
        //     this.songChangeIndex = 0
        // }
        dispatchForPlayStatus(false)
      }
    }
  }

  const onTimeUpdate = (e: any) => {
    let currentTime = Number(e.target.currentTime.toFixed(2))
    EventEmitter.emit("timeupdate", { currentTime })
  }

  const _onTimeUpdate = (e: any) => {
    throttle(onTimeUpdate, 30, 1)(e)
  }

  const onCanPlay = () => {
    const { pathname } = history.location
    diapatchForDuration(audioElemRef.current.duration)
    dispatchForPlayStatus(true)
    if (!showController && pathname !== "/play") dispatchForShowController(true)
  }

  useEffect(() => {
    audioElemRef.current.volume = 0.5
    dispatchForAudio(audioElemRef.current)
    return () => {}
  }, [])

  // *问题: react-hooks/exhaustive-deps
  // 解决: 如果不需要在useEffect外使用方法, 可以简单的将方法移入useEffect内, 或者禁用

  // *问题: 直接访问listDetail为null, 暂时将listDetail存入ref
  // 在useEffect(() => {}, [])访问, listDetail是初始值null, 暂时这样实现

  // useEffect(() => {
  //   temp.current.listDetail = listDetail
  // }, [listDetail])

  // useEffect(() => {
  //   temp.current.currentSongIndex = currentSongIndex
  // }, [currentSongIndex])

  return <audio ref={audioElemRef} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={_onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}
const stateToProps = (state: any) => {
  return {
    EventEmitter: state.global.EventEmitter,
    playList: state.playlist.data,
    audioSrc: state.audio.src,
    currentSongIndex: state.playlist.currentSongIndex,
    showController: state.global.showController,
  }
}

const dispatchToProps = (dispatch: any) => ({
  diapatchForDuration(duration: any) {
    dispatch({ type: "audio/duration", value: duration })
  },
  dispatchForPlayStatus(playStatus: boolean) {
    dispatch({ type: "audio/play-status", value: playStatus })
  },
  dispatchForShowController(status: boolean) {
    dispatch({ type: "global/show-controller", value: status })
  },
  toggleSong(currentSongIndex: number) {
    dispatch(beforeCanPlayAction(currentSongIndex))
  },
  dispatchForAudio (audio: any) {
    dispatch({type: "global/audio", value: audio})
  }
})

export default connect(stateToProps, dispatchToProps)(withRouter(Player))
