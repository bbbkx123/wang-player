import React, {useRef, useState} from "react"
import { withRouter, Switch, Route } from "react-router-dom"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"
import MiniPlayer from "@/components/MiniPlayer"
import MiniList from "@/components/MiniList"

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
 
  const { dispatchForDetailId } = props

  const [show, setShow] = useState<boolean>(false)

  const goBack = () => {
    const { location } = history
    const { pathname } = location
    if (pathname === "/") {
      dispatchForDetailId(null)
      return
    }
    history.goBack()
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
    setShow((prev: boolean) => !prev)
  }

  const dom = (
    <>
      <div className="layouts">
        <NavBar mode="dark" icon={<Icon type="left" />} onLeftClick={goBack} rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}></NavBar>
        <button onClick={fun1}>mini-list</button>
        
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
        <MiniPlayer></MiniPlayer>
        <MiniList show={show}></MiniList>
      </div>

      <Player></Player>
    </>
  )

  return dom
}

const stateToProps = (state: any) => ({})

const dispatchToProps = (dispatch: any) => {
  return {
    dispatchForDetailId(id: number) {
      dispatch({ type: "global/detail-id", value: id })
    },
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
