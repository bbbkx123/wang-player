import React, { useState, useEffect, useRef } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { NavBar, Icon } from 'antd-mobile'
import Player from '@/components/Player'

import RouterConfig from '@/router'

import './index.less'


// 问题: token了解
// 问题: 
/**
 * 1. react实现路由守卫 
 * 2. mini歌曲列表 
 * 3. 单曲播放(歌单逻辑) 
 * 4. miniplayer transition过渡 
 * 5. 搜索页面 
 * 6. 歌词
 * 7. 评论
 */
 
let oldLocation: any = null
const DEFAULT_SCENE_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit',
}

const getSceneConfig = (location: any) => {
  const matchedRoute = RouterConfig.find(config => new RegExp(`^${config.path}$`).test(location.pathname))
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG
}

const Layouts = (props: any) => {
  const { history, location } = props
  const { currentSongIndex, playList, showMiniPlayer } = props

  const goBack = () => {
    const {location} = history
    const {pathname} = location
    if (pathname === "/") return 
    history.goBack()
  }

  const togglePlayPage = () => {
    const { pathname } = history.location
    if (pathname === '/play') {
      history.push('/playlistdetails')
    } else {
      history.push('/play')
    }
  }

  useEffect(() => {
    // history.push("/recommend")
    return () => {}
  }, [])

  let classNames = ''
  if (history.action === 'PUSH') {
    classNames = 'forward-' + getSceneConfig(location)?.enter
  } else if (history.action === 'POP' && oldLocation) {
    classNames = 'back-' + getSceneConfig(oldLocation)?.exit
  }

  // 更新旧location
  oldLocation = location

  const dom = (
    <>
      <div className="layouts">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={goBack}
          rightContent={[<Icon key="0" type="search" style={{ marginRight: '16px' }} />, <Icon key="1" type="ellipsis" />]}
        ></NavBar>

        <TransitionGroup
          childFactory={child => {
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

        {showMiniPlayer && (
          <div className="player-control" onClick={togglePlayPage}>
            <div>{playList[currentSongIndex].name} </div>
            <div> - {playList[currentSongIndex].artist}</div>
          </div>
        )}
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
      dispatch({ type: 'play-list/data', value: [] })
    },
  }
}

export default connect(stateToProps, dispatchToProps)(withRouter(Layouts))
