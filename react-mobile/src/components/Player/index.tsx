import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { songReadyAction } from "@/store/actionCreator"
import { Toast } from "antd-mobile"

const Player = (props: any) => {
  const { listDetail, currentSongIndex, EventEmitter, audioSrc, showMiniPlayer } = props
  const { dispatchForPlayStatus, diapatchForDuration, toggleSong, dispatchForShowMiniPlayer  } = props
  const audioElemRef = useRef<any>(null)
  // *问题: 直接访问listDetail为null, 暂时将listDetail存入ref
  // 在useEffect(() => {}, [])访问, listDetail是初始值null, 暂时这样实现
  const temp = useRef<any>({ listDetail, currentSongIndex })
  const [loop] = useState<boolean>(false)

  // !问题: buffer加载时, currentTime需要loading效果
  const onEnded = () => {
    audioElemRef.current.pause()
    const len = listDetail.listData.length
    if (currentSongIndex < len - 1) {
      toggleSong(currentSongIndex + 1)
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
    dispatchForPlayStatus(true)
    if (!showMiniPlayer) dispatchForShowMiniPlayer(true)
    audioElemRef.current.play()
  }
  const handlePlay = () => {
    const { paused, src } = audioElemRef.current
    if (!src) return Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 3, () => {}, false)
    paused ? audioElemRef.current.play() : audioElemRef.current.pause()
    dispatchForPlayStatus(!audioElemRef.current.paused)
  }

  const setCurrentTime = (currentTime: any) => {
    audioElemRef.current.currentTime = currentTime
  }

  const handleToggleSongs = (toggleType: string) => {
    let index = null
    const { listDetail, currentSongIndex } = temp.current
    if (!audioElemRef.current || !audioElemRef.current.src) return
    if (toggleType === "NEXT") {
      index = listDetail.listData.lentgh <= currentSongIndex ? 0 : currentSongIndex + 1
    } else {
      if (currentSongIndex === 0) {
        return
      } else if (currentSongIndex < listDetail.listData.length) {
        index = currentSongIndex - 1
      }
    }
    toggleSong(index)
  }

  useEffect(() => {
    audioElemRef.current.volume = 0.5
    return () => {}
  }, [])

  // *问题: react-hooks/exhaustive-deps
  // 解决: 如果不需要在useEffect外使用方法, 可以简单的将方法移入useEffect内, 或者禁用
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

  useEffect(() => {
    temp.current.listDetail = listDetail
  }, [listDetail])

  useEffect(() => {
    temp.current.currentSongIndex = currentSongIndex
  }, [currentSongIndex])

  return <audio ref={audioElemRef} src={audioSrc} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}
const stateToProps = (state: any) => {
  return {
    EventEmitter: state.global.EventEmitter,
    listDetail: state.global.listDetail,
    playList: state.playlist.data,
    audioSrc: state.audio.src,
    currentSongIndex: state.playlist.currentSongIndex,
    showMiniPlayer: state.global.showMiniPlayer,
  }
}

const dispatchToProps = (dispatch: any) => ({
  diapatchForDuration(duration: any) {
    dispatch({ type: "audio/duration", value: duration })
  },
  dispatchForPlayStatus(playStatus: boolean) {
    dispatch({ type: "audio/play-status", value: playStatus })
  },
  dispatchForShowMiniPlayer(status: boolean) {
    dispatch({ type: "global/show-mini-player", value: status })
  },
  toggleSong(currentSongIndex: number) {
    dispatch(songReadyAction(currentSongIndex))
  },
})

export default connect(stateToProps, dispatchToProps)(Player)
