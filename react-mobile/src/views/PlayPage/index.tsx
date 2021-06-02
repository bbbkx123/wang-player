import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import ProgressBar from "@/components/ProgressBar"
import { beforeCanPlayAction, changeSongAction } from "@/store/audio/action"
import { fetchLyricAction, getCurrentLineNumAction } from "@/store/playpage/action"
import { togglePlayAction } from "@/store/audio/action"
import { formatForPlayTime } from "@/utils/tools"
import { useWatch, useReactiveProp } from "@/utils/hook"
import List from "@/components/List"
import "./index.less"

const INITIAL_TOP = 200
const MOVE = -50

const PlayPage = (props: any) => {
  const {
    duration,
    currentSongIndex,
    playList,
    lyric,
    currentLyricLine,
    songId,
    percent,
    _isProgressChanging,
    paused,
    detailId,
    history,
    timeupdate,
  } = props
  const { play, fetchLyricData, setCurrentLineNum, togglePlayStatus, toggleSonge, progressChanging } = props
  const playRef = useRef<any>(null)
  const cdWrapperElemRef = useRef<any>()
  const lyricElemRef = useRef<any>()
  const degRef = useRef<any>({
    deg: null,
    start: true,
  })
  const [showLyric, setShowLyric] = useState<boolean>(false)

  /**
   * 问题: 在useEffect(()=>{}, [])中, timeupdate回调中无法读取 currentTime 和 duration, 暂时使用useEffect来更新percent
   * 解决: 独立使用useEffect, useEffect(()=>{}, [currentTime, duration])可以获取到
   * 后续发现不存在问题, 待观察
   */

  const isProgressChanging = useReactiveProp(_isProgressChanging)

  const onTimeupdate = (currentTime: any) => {
    // const { currentTime } = payload
    if (!isProgressChanging.current) {
      progressChanging(currentTime / duration)
    }
    setCurrentLineNum(currentTime)

    if (degRef.current.start) {
      degRef.current.deg = (degRef.current.deg || 0) + 2
      if (degRef.current.deg >= 360) degRef.current.deg = 0
      rotate(degRef.current.deg)
    }
  }

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const togglePlay = () => {
    togglePlayStatus()
  }

  const handleNextSong = () => {
    toggleSonge("NEXT")
  }

  const handlePrevSong = () => {
    toggleSonge("PREV")
  }

  const rotate = (deg: number) => {
    if (cdWrapperElemRef.current && cdWrapperElemRef.current.style) {
      cdWrapperElemRef.current.style.transform = `rotate(${deg}deg)`
    }
  }

  const image = () => {
    if (playList[currentSongIndex].album.picUrl) {
      return playList[currentSongIndex].album.picUrl + "?param=300y300"
    } else {
      return process.env.PUBLIC_URL + "/image/wink.png"
    }
  }

  const scroll = () => {
    if (lyricElemRef.current) {
      lyricElemRef.current.style.top = INITIAL_TOP + currentLyricLine * MOVE + "px"
    }
  }

  const toggleMainView = () => {
    setShowLyric((prev) => {
      degRef.current.start = prev
      degRef.current.deg = 0
      return !prev
    })
  }

  const pageToComment = () => {
    history.push({pathname: "/comment"})
  }

  useEffect(() => {
    if (lyric.lyricList.length === 0) fetchLyricData(songId)
    degRef.current.deg = 0
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    onTimeupdate(timeupdate.currentTime)
  }, [timeupdate]) // eslint-disable-line react-hooks/exhaustive-deps

  useWatch(detailId, (prev) => {
    if (prev && prev === detailId) return
    const initIndex = 0
    play(initIndex)
  })

  useWatch(songId, (prev) => {
    if (prev && prev === detailId) return
    fetchLyricData(songId)
  })

  useEffect(() => scroll(), [currentLyricLine]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showLyric) scroll()
  }, [showLyric]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={playRef} className="play">
      <div className="play--main-container" onClick={toggleMainView}>
        {!showLyric && (
          <div className="play--main">
            <div ref={cdWrapperElemRef} className="play--cd-wrapper">
              {playList[currentSongIndex] && <img src={image()} alt="" />}
            </div>
            <div className="play--other-btn" onClick={pageToComment}>
              <div style={{ fontSize: "24px", width: "30px" }} className="iconfont iconcomment"></div>
            </div>
          </div>
        )}
        {showLyric && (
          <div className="play--lyric" ref={(ref) => (lyricElemRef.current = ref)}>
            {lyric && lyric.lyricList.length > 0 && <List mode="LYRIC" data={lyric.lyricList} current={currentLyricLine}></List>}
          </div>
        )}
      </div>
      <div className="edit-container">
        <div className="play--progress">
          <span className="time left">{formatForPlayTime(duration * percent)}</span>
          <div style={{ width: "calc(100% - 70px)" }}>
            <ProgressBar percent={percent}></ProgressBar>
          </div>
          <span className="time right">{formatForPlayTime(duration)}</span>
        </div>
        <div className="play--control">
          <div style={{ fontSize: "32px" }} className="iconfont iconprev" onClick={handlePrevSong}></div>
          <div style={{ fontSize: "48px" }} className={`iconfont ${typeof paused === "boolean" && !paused ? "iconpause-circle" : "iconstart"}`} onClick={togglePlay}></div>
          <div style={{ fontSize: "32px" }} className="iconfont iconnext" onClick={handleNextSong}></div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  detailId: state.detail.id,
  playList: state.playlist.data,
  currentSongIndex: state.playlist.currentSongIndex,
  duration: state.audio.duration,
  lyric: state.playpage.lyric,
  currentLyricLine: state.playpage.currentLyricLine,
  songId: state.playpage.songId,
  _isProgressChanging: state.playpage.isProgressChanging,
  percent: state.playpage.percent,
  paused: state.audio.paused,
  timeupdate: state.audio.timeupdate,
})

const dispatchToProps = (dispatch: any) => ({
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  fetchLyricData(songId: string | number) {
    dispatch(fetchLyricAction(songId))
  },
  setCurrentLineNum(time: number) {
    dispatch(getCurrentLineNumAction(time))
  },
  togglePlayStatus() {
    dispatch(togglePlayAction())
  },
  toggleSonge(type: any) {
    dispatch(changeSongAction(type))
  },
  progressChanging(percent: any) {
    dispatch({ type: "play-page/percent", value: percent })
  },
})

export default connect(stateToProps, dispatchToProps)(withRouter(PlayPage))
