import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import './index.less'

const MiniPlayer = (props: any) => {
  const { history, currentSongIndex, playList, showMiniPlayer, onShowMiniList } = props
  const { EventEmitter, playStatus } = props

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

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === '/play') {
      history.push('/playlistdetails')
    } else {
      history.push('/play')
    }
  }

  const togglePlay = () => {
    EventEmitter.emit('player-toggle-status')
  }

  return (
    <CSSTransition in={showMiniPlayer} classNames="show-mini" timeout={200}>
      {display()}
    </CSSTransition>
  )
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.playlist.currentSongIndex,
    playList: state.playlist.data,
    showMiniPlayer: state.global.showMiniPlayer,
    playStatus: state.audio.playStatus,
    EventEmitter: state.global.EventEmitter,
  }
}
export default connect(stateToProps)(withRouter(MiniPlayer))
