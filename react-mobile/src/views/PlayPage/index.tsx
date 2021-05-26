import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import ProgressBar from "@/components/ProgressBar"
import { beforeCanPlayAction, changeSongAction } from "@/store/audio/action"
import {
  fetchLyricAction,
  getCurrentLineNumAction,
  getter_IsProgressChanging,
  setCurrentTimeAction,
} from "@/store/playpage/action"
import { togglePlayAction } from "@/store/audio/action"
import { formatForPlayTime } from "@/utils/tools"
import { useWatch } from "@/utils/hook"
import List from "@/components/List"
import "./index.less"

const INITIAL_TOP = 200
const MOVE = -50

const PlayPage = (props: any) => {
  const { EventEmitter, listDetail, duration, currentSongIndex, playList, lyric, currentLyricLine, songId, percent, isProgressChanging,paused, detailId} = props
  const { play, fetchLyricData, setCurrentLineNum, getter_isProgressChanging, togglePlayStatus, toggleSonge, progressChanging } = props
  const playRef = useRef<any>(null)
  const posterElemRef = useRef<any>()
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

  const onTimeupdate = (payload: any) => {
    const { currentTime } = payload
    
    if (!getter_isProgressChanging()) {
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

  useEffect(() => {
    degRef.current.deg = 0
    EventEmitter.on("timeupdate", onTimeupdate)
    return () => {
      EventEmitter.off("timeupdate", onTimeupdate)
    }
  }, [])

  useWatch(detailId, (prev) => {
    if (prev && prev === detailId) return
    const initIndex = 0
    play(initIndex)
  })

  useEffect(() => {
    fetchLyricData(songId)
  }, [songId])

  useEffect(() => {
    scroll()
  }, [currentLyricLine])

  useEffect(() => {
    if (showLyric) {
      scroll()
    }
  }, [showLyric])

  useEffect(() => {
    console.log(isProgressChanging);
  }, [isProgressChanging])

  return (
    <div ref={playRef} className="play">
      <div className="play--main-container" onClick={toggleMainView}>
        {!showLyric && (
          <div className="play--poster">
            <div ref={posterElemRef} className="play--poster-wrapper">
              {playList[currentSongIndex] && <img src={poster()} alt="" />}
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
          <div
            style={{ fontSize: "48px" }}
            className={`iconfont ${typeof paused === "boolean" && !paused ? "iconpause-circle" : "iconstart"}`}
            onClick={togglePlay}
          ></div>
          <div style={{ fontSize: "32px" }} className="iconfont iconnext" onClick={handleNextSong}></div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  EventEmitter: state.global.EventEmitter,
  listDetail: state.detail.data,
  detailId: state.detail.id,
  playList: state.playlist.data,
  currentSongIndex: state.playlist.currentSongIndex,
  duration: state.audio.duration,
  lyric: state.playpage.lyric,
  currentLyricLine: state.playpage.currentLyricLine,
  songId: state.playpage.songId,
  isProgressChanging: state.playpage.isProgressChanging,
  percent: state.playpage.percent,
  paused: state.audio.paused,
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
  getter_isProgressChanging() {
    return dispatch(getter_IsProgressChanging())
  },
  togglePlayStatus() {
    dispatch(togglePlayAction())
  },
  setCurrentTime(currentTime: any) {
    dispatch(setCurrentTimeAction(currentTime))
  },
  toggleSonge(type: any) {
    dispatch(changeSongAction(type))
  },
  progressChanging(percent: any) {
    dispatch({type: "play-page/percent", value: percent})
  },
})

export default connect(stateToProps, dispatchToProps)(PlayPage)
