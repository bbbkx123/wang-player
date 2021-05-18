import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import ProgressBar from "@/components/ProgressBar"
import { beforeCanPlayAction } from "@/store/actionCreator"
import { fetchLyricAction, getCurrentLineNumAction } from "@/store/playpage/action"
import { formatForPlayTime } from "@/utils/tools"
import { useWatch } from "@/utils/hook"
import List from "@/components/List"
import "./index.less"

const INITIAL_TOP = 200

const PlayPage = (props: any) => {
  const { EventEmitter, listDetail, playStatus, duration, currentSongIndex, playList, lyric, currentLyricLine } = props
  const { play, dispatchForShowMiniPlayer, fetchLyricData, setCurrentLineNum } = props
  const playRef = useRef<any>(null)
  const posterElemRef = useRef<any>()
  const lyricElemRef = useRef<any>()
  const degRef = useRef<number>()
  const [percent, setPercent] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [showLyric, setShowLyric] = useState<boolean>(false)
  

  /**
   * 问题: 在useEffect(()=>{}, [])中, timeupdate回调中无法读取 currentTime 和 duration, 暂时使用useEffect来更新percent
   * 解决: 独立使用useEffect, useEffect(()=>{}, [currentTime, duration])可以获取到
   * 后续发现不存在问题, 待观察
   */

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
    setCurrentLineNum(currentTime)
    degRef.current = (degRef.current || 0) + 2
    rotate(degRef.current)
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

  const rotate = (deg: number) => {
    if (posterElemRef.current && posterElemRef.current.style) {
      posterElemRef.current.style.transform = `rotate(${deg}deg)`
    }
  }

  const poster = () => {
    if (playList[currentSongIndex].album.picUrl) {
      return playList[currentSongIndex].album.picUrl + "?param=300y300"
    } else {
      return process.env.PUBLIC_URL + "/image/wink.png"
    }
  }

  const scroll = () => {
    if (lyricElemRef.current) {
      lyricElemRef.current.style.top = INITIAL_TOP + currentLyricLine * -100 + "px"
    }
  }

  const toggleMainView = () => {
    setTimeout(() => scroll(), 0)
    setShowLyric((prev) => !prev)
  }

  useEffect(() => {
    degRef.current = 0
    // 进入播放页面隐藏miniplayer
    dispatchForShowMiniPlayer(false)
    fetchLyricData()
    EventEmitter.on("progress-changing", handleProgressChanging, { passive: false })
    EventEmitter.on("progress-change", handleProgressChange, { passive: false })
    EventEmitter.on("timeupdate", onTimeupdate)
    return () => {
      EventEmitter.off("progress-changing", handleProgressChanging, { passive: false })
      EventEmitter.off("progress-change", handleProgressChange, { passive: false })
      EventEmitter.off("timeupdate", onTimeupdate)
    }
  }, [])

  useWatch(listDetail, (prev) => {
    if (prev && prev.detailId === listDetail.detailId) return
    const initIndex = 0
    play(initIndex)
  })

  useEffect(() => {
    scroll()
    console.log(currentLyricLine)
  }, [currentLyricLine])

  return (
    <div ref={playRef} className="play">
      <div className="play--main-container" onClick={toggleMainView}>
        {
         showLyric && (<div className="play--poster">
          <div ref={posterElemRef} className="play--poster-wrapper">
            {playList[currentSongIndex] && <img src={poster()} alt="" />}
          </div>
        </div>)
        }
        {
         !showLyric && (<div className="play--lyric" ref={(ref) => (lyricElemRef.current = ref)}>
          {lyric && lyric.lyricList.length > 0 && <List mode="LYRIC" data={lyric.lyricList} current={currentLyricLine}></List>}
        </div>)
        }
      </div>

      <div className="edit-container">
        <div className="play--progress">
          <span className="time left">{formatForPlayTime(currentTime)}</span>
          <ProgressBar percent={percent}></ProgressBar>
          <span className="time right">{formatForPlayTime(duration)}</span>
        </div>
        <div className="play--control">
          <div style={{ fontSize: "32px" }} className="iconfont iconprev" onClick={handlePrevSong}></div>
          <div style={{ fontSize: "48px" }} className={`iconfont ${typeof playStatus === "boolean" && playStatus ? "iconpause-circle" : "iconstart"}`} onClick={togglePlay}></div>
          <div style={{ fontSize: "32px" }} className="iconfont iconnext" onClick={handleNextSong}></div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  EventEmitter: state.global.EventEmitter,
  listDetail: state.global.listDetail,
  playList: state.playlist.data,
  playStatus: state.audio.playStatus,
  currentSongIndex: state.playlist.currentSongIndex,
  duration: state.audio.duration,
  lyric: state.playpage.lyric,
  currentLyricLine: state.playpage.currentLyricLine,
})

const dispatchToProps = (dispatch: any) => ({
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  dispatchForShowMiniPlayer(status: boolean) {
    dispatch({ type: "global/show-mini-player", value: status })
  },
  fetchLyricData() {
    dispatch(fetchLyricAction())
  },
  setCurrentLineNum(time: number) {
    dispatch(getCurrentLineNumAction(time))
  },
})

export default connect(stateToProps, dispatchToProps)(PlayPage)
