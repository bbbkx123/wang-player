import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {playStatusAction} from "@/store/global/action"

import './index.less'

const MiniController = (props: any) => {
  const { history, currentSongIndex, playList, dispatchForShowMiniList, dispatchForShowController,  togglePlayStatus} = props
  const { playStatus, showController } = props

  const display = () => {
    let temp = null
    if (playList.length > 0 && typeof currentSongIndex === 'number') {
      temp = (
        <>
          <div className="mini-controller--song-info">
            <div className="mini-controller--song-name">{playList[currentSongIndex].name}</div>
            <div className="mini-controller--split"> - </div>
            <div className="mini-controller--artist">{playList[currentSongIndex].artist}</div>
          </div>
          <div className="mini-controller--btn-group">
            <div className="btn" onClick={togglePlay}>
              <i className={`iconfont ${typeof playStatus === 'boolean' && playStatus ? 'iconpause-circle' : 'iconstart'}`}></i>
            </div>
            <div className="btn" onClick={onShowMiniList}>
              <i className="iconfont iconlist-v4-full"></i>
            </div>
          </div>
        </>
      )
    }
    return (
      <div className="mini-controller" onClick={togglePlayPage}>
        {temp}
      </div>
    )
  }

  const onShowMiniList = (e: any) => {
    e.stopPropagation()
    dispatchForShowMiniList(true)
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === '/play') {
      history.push('/playlistdetails')
    } else {
      // 进入播放页面隐藏
      dispatchForShowController(false)
      history.push('/play')
    }
  }

  const togglePlay = (e: any) => {
    e.stopPropagation()
    togglePlayStatus()
  }

  return (
    <CSSTransition in={showController} classNames="show-mini" timeout={200}>
      {display()}
    </CSSTransition>
  )
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.playlist.currentSongIndex,
    playList: state.playlist.data,
    showController: state.global.showController,
    playStatus: state.audio.playStatus,
    audio: state.global.audio,
  }
}

const dispatchToProps = (dispatch: any) => ({
  dispatchForShowMiniList(status: boolean) {
    dispatch({ type: "global/show-mini-list", value: status })
  },
  dispatchForShowController(status: boolean) {
    dispatch({ type: "global/show-controller", value: status })
  },
  togglePlayStatus() {
    dispatch(playStatusAction())
  },
})
export default connect(stateToProps, dispatchToProps)(withRouter(MiniController))
