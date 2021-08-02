import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import ProgressBar from "@/components/ProgressBar"
import { changeSongAction } from "@/store/audio/action"
import { fetchLyricAction, getCurrentLineNumAction } from "@/store/playpage/action"
import { togglePlayAction } from "@/store/audio/action"
import { formatForPlayTime } from "@/utils/tools"
import { useReactiveSelector } from "@/utils/hook"
import List from "@/components/List"
import "./index.less"

const INITIAL_TOP = 200
const MOVE = -50

const PlayPage = (props: any) => {
  const { history } = props
  const ref = useRef<any>(null)
  const cdWrapperElemRef = useRef<any>()
  const lyricElemRef = useRef<any>()
  const degRef = useRef<any>({
    deg: null,
    start: true,
  })
  const [showLyric, setShowLyric] = useState<boolean>(false)
  const [displayCurrentTime, setDisplayCurrentTime] = useState<string>('')
  const [displayDuration, setDisplayDuration] = useState<string>('')

  const dispatch = useDispatch()
  const playList = useSelector((state: any) => state.playlist.data)
  const currentSongIndex = useSelector((state: any) => state.playlist.currentSongIndex)
  const duration = useSelector((state: any) => state.audio.duration)
  const lyric = useSelector((state: any) => state.playpage.lyric)
  const currentLyricLine = useSelector((state: any) => state.playpage.currentLyricLine)
  const songId = useSelector((state: any) => state.playpage.songId)
  const percent = useSelector((state: any) => state.playpage.percent)
  const paused = useSelector((state: any) => state.audio.paused)
  const currentTime = useSelector((state: any) => state.audio.currentTime)
  const isProgressChanging = useReactiveSelector((state: any) => state.playpage.isProgressChanging)

  const testLog = useSelector((state: any) => state.test.log)

  /**
   * 问题: 在useEffect(()=>{}, [])中, timeupdate回调中无法读取 currentTime 和 duration, 暂时使用useEffect来更新percent
   * 解决: 独立使用useEffect, useEffect(()=>{}, [currentTime, duration])可以获取到
   * 后续发现不存在问题, 待观察
   */

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const togglePlay = () => {
    dispatch(togglePlayAction())
  }

  const handleNextSong = () => {
    dispatch(changeSongAction("NEXT"))
  }

  const handlePrevSong = () => {
    dispatch(changeSongAction("PREV"))
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

  const pageToComment = (e: any) => {
    e.stopPropagation()
    history.push({ pathname: "/comment" })
  }

  useEffect(() => {
    // if (lyric.lyricList.length === 0) dispatch(fetchLyricAction(songId))
    degRef.current.deg = 0
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isProgressChanging.current) {
      const percent = Math.floor((currentTime / duration) * 10000) / 10000
      // console.log(percent, currentTime, duration);
      dispatch({ type: "play-page/percent", value: percent })
    }
    dispatch(getCurrentLineNumAction(currentTime))

    if (degRef.current.start) {
      degRef.current.deg = (degRef.current.deg || 0) + 2
      if (degRef.current.deg >= 360) degRef.current.deg = 0
      rotate(degRef.current.deg)
    }
  }, [currentTime]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // if (!songId || songId === ref.current) return
    ref.current = songId
    dispatch(fetchLyricAction(songId))
  }, [songId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => scroll(), [currentLyricLine]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showLyric) scroll()
  }, [showLyric]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDisplayCurrentTime(formatForPlayTime(duration * percent))
  }, [duration, currentTime]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDisplayDuration(formatForPlayTime(duration))
  }, [duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="play">
      <div className="play--main-container" onClick={toggleMainView}>
        {!showLyric ? (
          <div className="play--main">
            <div ref={cdWrapperElemRef} className="play--cd-wrapper">
              {playList[currentSongIndex] && <img src={image()} alt="" />}
            </div>
            <div className="play--other-btn" onClick={pageToComment}>
              <div style={{ fontSize: "24px", width: "30px" }} className="iconfont iconcomment"></div>
            </div>
          </div>
        ) : (
          <div className="play--lyric" ref={(ref) => (lyricElemRef.current = ref)}>
            {lyric && lyric.lyricList.length > 0 && <List mode="LYRIC" data={lyric.lyricList} current={currentLyricLine}></List>}
          </div>
        )}
      </div>
      <div className="edit-container">
        <div className="play--progress">
          <span className="time left">{displayCurrentTime}</span>
          <div style={{ width: "calc(100% - 70px)" }}>
            <ProgressBar percent={percent}></ProgressBar>
          </div>
          <span className="time right">{displayDuration}</span>
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

export default withRouter(PlayPage)
