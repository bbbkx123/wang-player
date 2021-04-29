import { useState, useEffect, useRef } from "react"
import { withRouter, Redirect, Route } from "react-router-dom"
import {connect} from "react-redux"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import "./index.less"

const PlayerControl = withRouter((props: any) => {
  const { history } = props

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      history.go(-1)
    } else {
      history.push("/play")
    }
  }

  return (
    <div className="player-control" onClick={togglePlayPage}>
      PlayerControl
    </div>
  )
})

const Layouts = (props: any) => {
  const { history } = props
  const [pageTitle, setPageTitle] = useState<string>("default title")

  const handleClick = () => {
    history.go(-1)
  }

  useEffect(() => {
    history.push("/recommend")
    return () => {

    }
  }, [])

  return (
    <>
      <div className="layouts">
        <NavBar mode="dark" icon={<Icon type="left" />} onLeftClick={handleClick} rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}>
          {pageTitle}
        </NavBar>
        {/* <Redirect from="/" to="/recommend" /> */}
        <div className="router-view">
          <Route path="/play" component={PlayPage}></Route>
          <Route path="/recommend" component={Recommend}></Route>
          <Route path="/playlistdetails" component={PlayListDetails}></Route>
        </div>
        <PlayerControl></PlayerControl>
      </div>
      <Player></Player>
    </>
  )
}

const stateToProps = (state: any) => {
  return {
  }
}

const dispatchToProps = (dispatch: any) => {
  return {
    
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
