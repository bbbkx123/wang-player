import { useState, useEffect, useRef, useCallback, memo } from "react"
import { withRouter, Redirect, Route } from "react-router-dom"
import { connect } from "react-redux"

import { NavBar, Icon } from "antd-mobile"
import Player from "@/components/Player"

import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import "./index.less"

const PlayerControl = withRouter((props: any) => {
  const { history, song } = props
  
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
      <div>{song.name} </div>
      <div> - {song.artist}</div>
    </div>
  )
})

const Player1 = memo(Player)

const Layouts = (props: any) => {
  const { history } = props
  const {currentSongIndex, playList, get1} = props
  const [pageTitle, setPageTitle] = useState<string>("default title")
  const [currentSong, setCurrentSong] = useState<any>()

  const handleClick = () => {
    history.go(-1)
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === "/play") {
      // get1()
      history.push("/playlistdetails")
    } else {
      history.push("/play")
    }
  }

  useEffect(() => {
    history.push("/recommend")
    return () => {}
  }, [])

  // const getPlayer = useCallback(() => <Player></Player>,[])

  
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
          {pageTitle}
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
      <Player1></Player1>
    </>
  )
}

const stateToProps = (state: any) => {
  return {
    currentSongIndex: state.currentSongIndex,
    playList: state.playList,
  }
}

const dispatchToProps = (dispatch: any) => {
  return {
    get1 () {
      dispatch({type: "playList", value: []})
    }
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
