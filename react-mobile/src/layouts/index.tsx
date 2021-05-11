import React from "react"
import { withRouter, Switch, Route } from "react-router-dom"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"

import RouterConfig from "@/router"

import "./index.less"

let oldLocation: any = null
const DEFAULT_SCENE_CONFIG = {
  enter: "from-right",
  exit: "to-exit",
}

// 注意: 过渡实现逻辑
const getSceneConfig = (location: any) => {
  const matchedRoute = RouterConfig.find((config) => new RegExp(`^${config.path}$`).test(location.pathname))
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG
}

const Layouts = (props: any) => {
  const { history, location } = props
  const { currentSongIndex, playList, showMiniPlayer, get1 } = props
  const { dispatchForDetailId } = props

  const goBack = () => {
    const { location } = history
    const { pathname } = location
    if (pathname === "/") {
      dispatchForDetailId(null)
      return
    }
    history.goBack()
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.push("/playlistdetails")
    } else {
      history.push("/play")
    }
  }

  // 注意: 过渡实现逻辑
  let classNames = ""
  if (history.action === "PUSH") {
    classNames = "forward-" + getSceneConfig(location)?.enter
  } else if (history.action === "POP" && oldLocation) {
    classNames = "back-" + getSceneConfig(oldLocation)?.exit
  }

  // 更新旧location
  oldLocation = location

  const fun1 = () => {
    get1(true)
  }

  const dom = (
    <>
      <div className="layouts">
        <NavBar mode="dark" icon={<Icon type="left" />} onLeftClick={goBack} rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}></NavBar>
        <TransitionGroup
          childFactory={(child) => {
            return React.cloneElement(child, { classNames })
          }}
          className="router-view"
        >
          <CSSTransition timeout={500} key={location.pathname} unMountOnExit>
            <Switch location={location}>
              {RouterConfig.map((config: any, index: number) => (
                <Route key={index} exact {...config}></Route>
              ))}
            </Switch>
          </CSSTransition>
        </TransitionGroup>

        {
          <CSSTransition in={showMiniPlayer} classNames="show-mini" timeout={200}>
            <div className="player-control" onClick={togglePlayPage}>
            {/* <div>{JSON.stringify(currentSongIndex)}</div>
              <div>{JSON.stringify(playList)}</div> */}
              
              {playList.length > 0 && typeof currentSongIndex === "number" && (
                <>
                  <div>{playList[currentSongIndex].name} </div>
                  <div> - {playList[currentSongIndex].artist}</div>
                </>
              )}
            </div>
          </CSSTransition>
        }
      </div>

      <Player></Player>
    </>
  )

  return dom
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.playlist.currentSongIndex,
    playList: state.playlist.data,
    showMiniPlayer: state.global.showMiniPlayer,
  }
}

const dispatchToProps = (dispatch: any) => {
  return {
    get1() {
      dispatch({ type: "global/show-mini-player", value: true })
    },
    dispatchForDetailId(id: number) {
      dispatch({ type: "global/detail-id", value: id })
    },
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
