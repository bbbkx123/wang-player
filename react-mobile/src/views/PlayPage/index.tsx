import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import ProgressBar from "@/components/ProgressBar"
import {songReadyAction} from "@/store/actionCreator"
import { formatForPlayTime } from "@/utils/tools"
import { useWatch } from "@/utils/hook"
import "./index.less"

const PlayPage = (props: any) => {
  const playRef = useRef<any>(null)
  const posterElemRef = useRef<any>()
  const deg = useRef<number>()
  const { EventEmitter, playListDetail, playStatus, duration, currentSongIndex, playList, } = props
  const {handlePlay, setPlayStatus} = props
  const [percent, setPercent] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [progressWidth, setProgressWidth] = useState<number>(0)
  // const [loop, setLoop] = useState<boolean>(false)
  // const eventsName = EventEmitter.eventNames()

  // progress事件订阅
  // useEffect(() => {
  //   if (!eventsName.includes("progress-changing")) {
  // EventEmitter.addListener(
  //   "progress-changing",
  //   (percent: number) => {
  //     setPercent(percent)
  //   },
  //   { passive: false }
  // )
  //   }
  //   return () => {
  //     EventEmitter.removeAllListeners(["progress-changing"])
  //   }
  // }, [])

  // useEffect(() => {
  // EventEmitter.addListener(
  //   "progress-change",
  //   (percent: number) => {
  //     setPercent(percent)
  // audioRef.current.currentTime = duration * percent;
  //     EventEmitter.emit("set-current-time", duration * percent)
  //   },
  //   { passive: false }
  // )

  //   return () => {
  //     EventEmitter.removeAllListeners(["progress-change"])
  //   }
  // }, [duration])

  /**
   * 问题: 在useEffect(()=>{}, [])中, timeupdate回调中无法读取 currentTime 和 duration, 暂时使用useEffect来更新percent
   * 解决: 独立使用useEffect, useEffect(()=>{}, [currentTime, duration])可以获取到
   * 后续发现不存在问题, 待观察
   */
  // useEffect(() => {
  // EventEmitter.addListener("timeupdate", (payload: any) => {
  //   const { currentTime } = payload
  //   setCurrentTime(currentTime)
  //   setPercent(currentTime / duration)
  //   // console.log(duration, currentTime);
  // })

  //   return () => {
  //     EventEmitter.removeAllListeners(["timeupdate"])
  //   }
  // }, [duration])

  const handleProgressChanging = (percent: number) => {
    setPercent(percent)
  }

  const handleProgressChange = (percent: number) => {
    setPercent(percent)
    EventEmitter.emit("set-current-time", duration * percent)
  }

  const onTimeupdate = (payload: any) => {
    const { currentTime } = payload
    setCurrentTime(currentTime)
    setPercent(currentTime / duration)
    // console.log(duration, currentTime);
    deg.current = (deg.current || 0) + 3
    rotate(deg.current)
    // debugger
  }

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const togglePlay = () => {
    EventEmitter.emit("player-toggle-status")
  }

  const handleNextSong = () => {
    EventEmitter.emit("player-toggle-song", "NEXT")
  }

  const handlePrevSong = () => {
    EventEmitter.emit("player-toggle-song", "PREV")
  }

  const togglePlayStatusClass = () => {
    return 
  }

  const rotate = (deg: number) => {
    if (posterElemRef.current && posterElemRef.current.style) {
      posterElemRef.current.style.transform = `rotate(${deg}deg)`
    }
  }

  useEffect(() => {
    deg.current = 0
    if (playRef.current && playRef.current.clientWidth) {
      setProgressWidth(playRef.current.clientWidth - 70)
    }

    EventEmitter.on("progress-changing", handleProgressChanging, { passive: false })
    EventEmitter.on("progress-change", handleProgressChange, { passive: false })
    EventEmitter.on("timeupdate", onTimeupdate)
    return () => {
      EventEmitter.off("progress-changing", handleProgressChanging, { passive: false })
      EventEmitter.off("progress-change", handleProgressChange, { passive: false })
      EventEmitter.off("timeupdate", onTimeupdate)
    }
  }, [])

  useWatch(playListDetail, (prev) => {
    if (prev && prev.detailId === playListDetail.detailId) return
    const initIndex = 0
    handlePlay(initIndex)
  })

  // useEffect(() => {
  //   if () {

  //   }
  // }, [playStatus])

  return (
    <div ref={playRef} className="play">
      <div className="play--poster">
        <div ref={posterElemRef} className="play--poster-wrapper">
          {
            playList[currentSongIndex] && <img src={playList[currentSongIndex].album.picUrl + '?param=300y300'} alt=""/>
          } 
        </div>
      </div>
      <div className="play--progress">
        <span className="time left">{formatForPlayTime(currentTime)}</span>
        <ProgressBar percent={percent} progressWidth={progressWidth}></ProgressBar>
        <span className="time right">{formatForPlayTime(duration)}</span>
      </div>
      <div className="play--control">
        <div style={{ fontSize: "32px" }} className="iconfont iconprev" onClick={handlePrevSong}></div>
        <div style={{ fontSize: "48px" }} className={`iconfont ${typeof playStatus === "boolean" && playStatus ? "iconpause-circle" : "iconstart"}`} onClick={togglePlay}></div>
        <div style={{ fontSize: "32px" }} className="iconfont iconnext" onClick={handleNextSong}></div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  EventEmitter: state.EventEmitter,
  playListDetail: state.playListDetail,
  playList: state.playList,
  playStatus: state.playStatus,
  currentSongIndex: state.currentSongIndex,
  duration: state.duration,
})

const dispatchToProps = (dispatch: any) => ({
  handlePlay (songIndex: number) {
    dispatch(songReadyAction(songIndex))
  },
  setPlayStatus(status: boolean) {
    dispatch({type: "playStatus", value: status})
  },
})

export default connect(stateToProps, dispatchToProps)(PlayPage)
