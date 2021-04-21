import { useState } from "react"
import { withRouter, Redirect, Route } from "react-router-dom"
// import {createBrowserHistory} from "history";
import { NavBar, Icon } from "antd-mobile"

import { StoreContext, useThunkReducer } from "@/store"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import "./index.less"

const Layouts = (props: any) => {
  const { history } = props
  const [pageTitle, setPageTitle] = useState<string>("default title")

  const handleClick = () => {
    history.go(-1)
  }

  const [state, dispatch] = useThunkReducer()

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      <div className="layouts">
        {/* <div style={{ overflow: "hidden", height: "100%" }}> */}
          <NavBar mode="dark" icon={<Icon type="left" />} onLeftClick={handleClick} rightContent={[<Icon key="0" type="search" style={{ marginRight: "16px" }} />, <Icon key="1" type="ellipsis" />]}>
            {pageTitle}
          </NavBar>
          {/* <Redirect from="/" to="/recommend" /> */}
          <Route path="/play" component={PlayPage}></Route>
          <Route path="/recommend" component={Recommend}></Route>
          <Route path="/playlistdetails" component={PlayListDetails}></Route>
        {/* </div> */}
      </div>
    </StoreContext.Provider>
  )
}

export default withRouter(Layouts)
