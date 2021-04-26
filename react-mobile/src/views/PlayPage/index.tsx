import { useState, useEffect, useContext, useRef } from "react"

import ProgressBar from "@/components/ProgressBar"
import { StoreContext } from "@/store"
import { songPlayAction } from "@/store/actions"

import { formatForPlayTime } from "@/utils/tools"
import { useWatch } from "@/utils/hook"

// import Player from "@/components/Player";

import "./index.less"

const PlayPage = () => {
  const playRef = useRef<any>(null)
  const { dispatch, EventEmitter, playListDetail, duration, playStatus } = useContext<any>(StoreContext)
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
  }

  useEffect(() => {
    if (playRef.current && playRef.current.clientWidth) {
      setProgressWidth(playRef.current.clientWidth - 70)
    }

    EventEmitter.on("progress-changing", handleProgressChanging, { passive: false })
    EventEmitter.on("progress-change", handleProgressChange, handleProgressChange, { passive: false })
    EventEmitter.on("timeupdate", onTimeupdate)
    return () => {
      EventEmitter.off("progress-changing", handleProgressChanging, { passive: false })
      EventEmitter.off("progress-change", handleProgressChange, handleProgressChange, { passive: false })
      EventEmitter.off("timeupdate", onTimeupdate)
    }
  }, [])

  useWatch(playListDetail, (prev) => {
    if (prev && prev.detailId === playListDetail.detailId) return
    const initIndex = 0
    handlePlay(initIndex)
  })

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const togglePlay = () => {
    EventEmitter.emit("player-toggle-status")
  }

  const handleNextSong = () => {
    EventEmitter.emit("player-toggle-song", "PREV")
  }

  const handlePrevSong = () => {
    EventEmitter.emit("player-toggle-song", "NEXT")
  }

  const handlePlay = (songIndex: number) => {
    dispatch(songPlayAction(songIndex))
  }

  const togglePlayStatusClass = () => {
    return !playStatus ? "iconstart" : "iconpause-circle"
  }

  return (
    <div ref={playRef} className="play">
      <div className="play--poster">play</div>
      <div className="play--progress">
        <span className="time left">{formatForPlayTime(currentTime)}</span>
        <ProgressBar percent={percent} progressWidth={progressWidth}></ProgressBar>
        <span className="time right">{formatForPlayTime(duration)}</span>
      </div>
      <div className="play--control">
        <div style={{ fontSize: "32px" }} className="iconfont iconprev" onClick={handlePrevSong}></div>
        <div style={{ fontSize: "48px" }} className={`iconfont ${togglePlayStatusClass()}`} onClick={togglePlay}></div>
        <div style={{ fontSize: "32px" }} className="iconfont iconnext" onClick={handleNextSong}></div>
      </div>
    </div>
  )
}

export default PlayPage
