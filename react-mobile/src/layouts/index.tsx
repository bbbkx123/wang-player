import React, { useState, useEffect, useRef } from "react"
import { withRouter, Switch, Route } from "react-router-dom"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"

import RouterConfig from "@/router"

import "./index.less"

let oldLocation: any = null
const DEFAULT_SCENE_CONFIG = {
  enter: "from-right",
  exit: "to-exit",
}

const getSceneConfig = (location: any) => {
  const matchedRoute = RouterConfig.find((config) => new RegExp(`^${config.path}$`).test(location.pathname))
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG
}

const Layouts = (props: any) => {
  const { history, location } = props
  const { currentSongIndex, playList } = props
  const [currentSong, setCurrentSong] = useState<any>()

  const handleClick = () => {
    history.go(-1)
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.push("/playlistdetails")
    } else {
      history.push("/play")
    }
  }

  useEffect(() => {
    // history.push("/recommend")
    return () => {}
  }, [])

  let classNames = ""
  if (history.action === "PUSH") {
    classNames = "forward-" + getSceneConfig(location)?.enter
  } else if (history.action === "POP" && oldLocation) {
    classNames = "back-" + getSceneConfig(oldLocation)?.exit
  }

  // 更新旧location
  oldLocation = location

  const fun1 = () => {
    history.push("/playlistdetails")
  }

  const fun2 = () => {
    history.goBack()
  }

  useEffect(() => {
    if (typeof currentSongIndex === "number" && playList.length > 0) {
      setCurrentSong(playList[currentSongIndex])
    }
  }, [currentSongIndex, playList])

  const dom = (
    <>
      <div className="layouts">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={handleClick}
          rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}
        ></NavBar>

        <button onClick={fun1}>to about</button>
        <button onClick={fun2}>back</button>

        <TransitionGroup
          childFactory={(child) => {
            return React.cloneElement(child, { classNames })
          }}
          className="router-view"
        >
          <CSSTransition timeout={500} key={location.pathname}>
            <Switch location={location}>
              {RouterConfig.map((config: any, index: number) => (
                <Route key={index} exact {...config}></Route>
              ))}
            </Switch>
          </CSSTransition>
        </TransitionGroup>

        {/* {currentSong && (
          <div className="player-control" onClick={togglePlayPage}>
            <div>{currentSong.name} </div>
            <div> - {currentSong.artist}</div>
          </div>
        )} */}
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
  }
}

const dispatchToProps = (dispatch: any) => {
  return {
    get1() {
      dispatch({ type: "play-list/data", value: [] })
    },
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
