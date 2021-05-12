import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import ProgressBar from '@/components/ProgressBar'
import { beforeCanPlayAction } from '@/store/actionCreator'
import { formatForPlayTime } from '@/utils/tools'
import { useWatch } from '@/utils/hook'
import './index.less'

const PlayPage = (props: any) => {
  const playRef = useRef<any>(null)
  const posterElemRef = useRef<any>()
  const degRef = useRef<number>()
  const { EventEmitter, listDetail, playStatus, duration, currentSongIndex, playList } = props
  const { play, dispatchForShowMiniPlayer } = props
  const [percent, setPercent] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [progressWidth, setProgressWidth] = useState<number>(0)

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
    EventEmitter.emit('set-current-time', duration * percent)
  }

  const onTimeupdate = (payload: any) => {
    const { currentTime } = payload
    setCurrentTime(currentTime)
    setPercent(currentTime / duration)
    degRef.current = (degRef.current || 0) + 2
    rotate(degRef.current)
  }

  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const togglePlay = () => {
    EventEmitter.emit('player-toggle-status')
  }

  const handleNextSong = () => {
    EventEmitter.emit('player-toggle-song', 'NEXT')
  }

  const handlePrevSong = () => {
    EventEmitter.emit('player-toggle-song', 'PREV')
  }

  const rotate = (deg: number) => {
    if (posterElemRef.current && posterElemRef.current.style) {
      posterElemRef.current.style.transform = `rotate(${deg}deg)`
    }
  }

  useEffect(() => {
    // if (deg !== null) {
    //   degRef.current = deg
    //   posterElemRef.current.style.transform = `rotate(${deg}deg)`
    // } else {
    degRef.current = 0
    // }
    if (playRef.current && playRef.current.clientWidth) {
      setProgressWidth(playRef.current.clientWidth - 70)
    }
    // 进入播放页面隐藏miniplayer
    dispatchForShowMiniPlayer(false)

    EventEmitter.on('progress-changing', handleProgressChanging, { passive: false })
    EventEmitter.on('progress-change', handleProgressChange, { passive: false })
    EventEmitter.on('timeupdate', onTimeupdate)
    return () => {
      EventEmitter.off('progress-changing', handleProgressChanging, { passive: false })
      EventEmitter.off('progress-change', handleProgressChange, { passive: false })
      EventEmitter.off('timeupdate', onTimeupdate)
      dispatchForShowMiniPlayer(true)
      // let deg = (degRef.current || 0) % 360
      // dispatchForDeg(deg)
    }
  }, [])

  useWatch(listDetail, prev => {
    if (prev && prev.detailId === listDetail.detailId) return
    const initIndex = 0
    play(initIndex)
  })

  return (
    <div ref={playRef} className="play">
      <div className="play--poster">
        <div ref={posterElemRef} className="play--poster-wrapper">
          {playList[currentSongIndex] && <img src={playList[currentSongIndex].album.picUrl + '?param=300y300'} alt="" />}
        </div>
      </div>
      <div className="play--progress">
        <span className="time left">{formatForPlayTime(currentTime)}</span>
        <ProgressBar percent={percent}></ProgressBar>
        <span className="time right">{formatForPlayTime(duration)}</span>
      </div>
      <div className="play--control">
        <div style={{ fontSize: '32px' }} className="iconfont iconprev" onClick={handlePrevSong}></div>
        <div style={{ fontSize: '48px' }} className={`iconfont ${typeof playStatus === 'boolean' && playStatus ? 'iconpause-circle' : 'iconstart'}`} onClick={togglePlay}></div>
        <div style={{ fontSize: '32px' }} className="iconfont iconnext" onClick={handleNextSong}></div>
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
  // deg: state.playpage.deg,
  // showMiniPlayer: state.global.showMiniPlayer,
})

const dispatchToProps = (dispatch: any) => ({
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  dispatchForShowMiniPlayer (status:boolean) {
    dispatch({type: "global/show-mini-player", value: status})
  },
  // dispatchForDeg (deg: number) {
  //   dispatch({type: "play-page/deg", value: deg})
  // }
})

export default connect(stateToProps, dispatchToProps)(PlayPage)
