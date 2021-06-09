import { CSSTransition } from "react-transition-group"
import { useSelector, useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"

import action from "@/store/action"
import "./index.less"

const MiniController = (props: any) => {
  const { history } = props
  const dispatch = useDispatch()

  const currentSongIndex = useSelector((state: any) => state.playlist.currentSongIndex)
  const playList = useSelector((state: any) => state.playlist.data)
  const showController = useSelector((state: any) => state.global.showController)
  const paused = useSelector((state: any) => state.audio.paused)

  const onShowMiniList = (e: any) => {
    e.stopPropagation()
    dispatch({ type: "global/show-mini-list", value: true })
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.push("/playlistdetails")
    } else {
      // 进入播放页面隐藏
      dispatch({ type: "global/show-controller", value: false })
      history.push("/play")
    }
  }

  const play = (e: any) => {
    e.stopPropagation()
    dispatch(action.togglePlayAction())
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


export default withRouter(MiniController)
