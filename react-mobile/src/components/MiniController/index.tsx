import { CSSTransition } from "react-transition-group"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { togglePlayAction } from "@/store/audio/action"

import "./index.less"

const MiniController = (props: any) => {
  const { history, currentSongIndex, playList, dispatchForShowMiniList, dispatchForShowController, togglePlay } = props
  const { paused, showController } = props

  const onShowMiniList = (e: any) => {
    e.stopPropagation()
    dispatchForShowMiniList(true)
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.push("/playlistdetails")
    } else {
      // 进入播放页面隐藏
      dispatchForShowController(false)
      history.push("/play")
    }
  }

  const play = (e: any) => {
    e.stopPropagation()
    togglePlay()
  }

  return (
    <CSSTransition in={showController} classNames="show-mini" timeout={200}>
      <div className="mini-controller" onClick={togglePlayPage}>
        {playList.length > 0 && typeof currentSongIndex === "number" && (
          <>
            <div className="mini-controller--song-info">
              <div className="mini-controller--song-name">{playList[currentSongIndex].name}</div>
              <div className="mini-controller--split"> - </div>
              <div className="mini-controller--artist">{playList[currentSongIndex].artists}</div>
            </div>
            <div className="mini-controller--btn-group">
              <div className="btn" onClick={play}>
                <i className={`iconfont ${typeof paused === "boolean" && !paused ? "iconpause-circle" : "iconstart"}`}></i>
              </div>
              <div className="btn" onClick={onShowMiniList}>
                <i className="iconfont iconlist-v4-full"></i>
              </div>
            </div>
          </>
        )}
      </div>
    </CSSTransition>
  )
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.playlist.currentSongIndex,
    playList: state.playlist.data,
    showController: state.global.showController,
    paused: state.audio.paused,
  }
}

const dispatchToProps = (dispatch: any) => ({
  dispatchForShowMiniList(status: boolean) {
    dispatch({ type: "global/show-mini-list", value: status })
  },
  dispatchForShowController(status: boolean) {
    dispatch({ type: "global/show-controller", value: status })
  },
  togglePlay() {
    dispatch(togglePlayAction())
  },
})
export default connect(stateToProps, dispatchToProps)(withRouter(MiniController))
