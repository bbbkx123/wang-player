import { useState, useEffect, useRef } from "react"
import { withRouter, Redirect, Route } from "react-router-dom"
import { connect } from "react-redux"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import "./index.less"


const Layouts = (props: any) => {
  const { history } = props
  const {currentSongIndex, playList, get1} = props
  // const [pageTitle, setPageTitle] = useState<string>("default title")
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
    history.push("/recommend")
    return () => {}
  }, [])

  useEffect(() => {
    if (typeof currentSongIndex === "number" && playList.length > 0) {
      setCurrentSong(playList[currentSongIndex])
    }
  }, [currentSongIndex, playList])

  return (
    <>
      <div className="layouts">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={handleClick}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: "16px" }} />,
            <Icon key="1" type="ellipsis" />,
          ]}
        >
          {/* {pageTitle} */}
        </NavBar>
        {/* <Redirect from="/" to="/recommend" /> */}
        <div className="router-view">
          <Route path="/play" component={PlayPage}></Route>
          <Route path="/recommend" component={Recommend}></Route>
          <Route path="/playlistdetails" component={PlayListDetails}></Route>
        </div>
        {
          currentSong && (
            <div className="player-control" onClick={togglePlayPage}>
            <div>{currentSong.name} </div>
            <div> - {currentSong.artist}</div>
          </div>
          ) 
        }
      </div>
      <Player></Player>
    </>
  )
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.playlist.currentSongIndex,
    playList: state.playlist.data,
  }
}

const dispatchToProps = (dispatch: any) => {
  return {
    get1 () {
      dispatch({type: "play-list/data", value: []})
    }
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
