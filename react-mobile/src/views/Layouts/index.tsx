import React from "react"
import { withRouter, Switch, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"
import MiniController from "@/components/MiniController"
import MiniList from "@/components/MiniList"
import Loading from "@/components/Loading"

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
  const dispatch = useDispatch()
  const goBack = (e: any) => {
    const { pathname } = history.location
    if (pathname === "/") {
      return
    } else if (pathname === "/play") {
      dispatch({ type: "global/show-controller", value: true })
    }
    history.goBack()
  }

  const goSearch = () => {
    history.push("/search")
  }

  // 问题: 理解过渡实现逻辑
  let classNames = ""
  if (history.action === "PUSH") {
    classNames = "forward-" + getSceneConfig(location)?.enter
  } else if (history.action === "POP" && oldLocation) {
    classNames = "back-" + getSceneConfig(oldLocation)?.exit
  }

  // 更新旧location
  oldLocation = location

  return (
    <>
      <div className="layouts">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={goBack}
          rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} onClick={goSearch} />]}
        ></NavBar>
        <TransitionGroup childFactory={(child) => React.cloneElement(child, { classNames })} className="router-view">
          <CSSTransition timeout={500} key={location.pathname} unMountOnExit>
            {/* 注意  location移除会存在问题*/}
            <React.Suspense fallback={<Loading />}>
              <Switch location={location}>
                {RouterConfig.map((config: any, index: number) => (
                  <Route key={index} {...config}></Route>
                ))}
              </Switch>
            </React.Suspense>
          </CSSTransition>
        </TransitionGroup>
        <MiniController></MiniController>
        <MiniList></MiniList>
      </div>
      <Player></Player>
    </>
  )
}

export default withRouter(Layouts)
