import { CSSTransition } from "react-transition-group"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { useEffect } from "react"

import "./index.less"

const MiniPlayer = (props: any) => {
  const { history, currentSongIndex, playList, showMiniPlayer } = props

  const display = () => {
    let temp = null
    if (playList.length > 0 && typeof currentSongIndex === "number") {
      temp = (
        <>
          <div>{playList[currentSongIndex].name} </div>
          <div> - {playList[currentSongIndex].artist}</div>
        </>
      )
    }
    return (
      <div className="player-control" onClick={togglePlayPage}>
        {temp}
      </div>
    )
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.push("/playlistdetails")
    } else {
      history.push("/play")
    }
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
  }
}
export default connect(stateToProps)(withRouter(MiniPlayer))
