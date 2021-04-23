import { useState, useEffect, useRef } from "react"
import { withRouter, Redirect, Route } from "react-router-dom"
// import {createBrowserHistory} from "history";
import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player";

import { StoreContext, useThunkReducer } from "@/store"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import "./index.less"


const Layouts = (props: any) => {
  const { history } = props

  const [state, dispatch] = useThunkReducer()
  const [pageTitle, setPageTitle] = useState<string>("default title")

  const handleClick = () => {
    history.go(-1)
  }

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
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
      </div>
      {/* ref={audioRef} songUrl={_state.audioSrc} */}
      <Player></Player>
    </StoreContext.Provider>
  )
}

export default withRouter(Layouts)
