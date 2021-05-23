import { useEffect, useRef, useState } from 'react'
import { SearchBar } from 'antd-mobile'
import { connect } from 'react-redux'
// import {Route, Switch} from "react-router-dom"

import * as api from '@/service'
import { formatForSearchResult } from '@/utils/tools'
import { beforeCanPlayAction } from '@/store/actionCreator'
// import {appendPlayListAction} from "@/store/global/action"
import List from '@/components/List'
import Slider from '@/components/Slider'

import './index.less'

const Search = (props: any) => {
  const { diapatchForPlayList, play } = props

  const [data, setData] = useState<any[]>([])
  const [beforePullUp, setBeforePullUp] = useState<boolean>(true)
  const [value, setValue] = useState<any>()
  const autoFocusInst = useRef<any>()
  const touchTimeRef = useRef<any>()
  const instanceRef = useRef<any>()

  instanceRef.current = {
    bscroll: {
      scrollY: true,
      scrollX: false,
      // 锁定方向
      directionLockThreshold: 0,
      freeScroll: false,
      pullDownRefresh: {
        threshold: 100,
        stop: 50,
      },
      pullUpLoad: {
        threshold: -125,
        stop: 50,
      },
    },
  }

  const pullingDown = (instance: any) => {
    console.log('pull-down')
    instance.finishPullDown()
  }

  // 问题: 待优化
  const pullingUp = async (instance: any) => {
    setBeforePullUp(false)
    getSearchResult(value).then((res: any) => {
      const { songs } = res.data.result
      let data = songs.map((item: any) => formatForSearchResult(item))
      setData((prev: any[]) => prev.concat(data))
      instance.finishPullUp()
      instance.refresh()
      setBeforePullUp(true)
    })
  }

  const onChange = (value: any) => {
    setValue(value)
  }

  const onSubmit = (value: any) => {
    getSearchResult(value).then((res: any) => {
      const { songs } = res.data.result
      let data = songs.map((item: any) => formatForSearchResult(item))
      setData(data)
    })
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = async (songIndex: number, id: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 100) {
      diapatchForPlayList([data[songIndex]])
      console.log(JSON.stringify(data[songIndex]))
      play(0)
    }
    touchTimeRef.current = null
  }

  const getSearchResult = (keywords: any) => {
    return api.getSearchResult(keywords, 10, 0)
  }

  useEffect(() => {
    // 问题: 自动获取光标动画为从右到左, 路由动画为从左到右;
    // autoFocusInst.current.focus()
    return () => {
      touchTimeRef.current = {}
    }
  }, [])

  return (
    <div className="search--page page-container">
      <div className="search--input-container">
        <SearchBar placeholder="自动获取光标" ref={ref => (autoFocusInst.current = ref)} onChange={onChange} onSubmit={onSubmit} />
      </div>
      {data.length > 0 && (
        <Slider mode="list-detail" config={instanceRef.current} pullDown={pullingDown} pullUp={pullingUp}>
          <List mode="PLAY_LIST" data={data} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
        </Slider>
      )}
    </div>
  )
}

const stateToProps = (state: any) => ({
  listDetail: state.global.listDetail,
})

const dispatchToProps = (dispatch: any) => ({
  diapatchForPlayList(playList: any[]) {
    dispatch({ type: 'play-list/data', value: playList })
  },
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  // appendPlayList() {
  //   return dispatch(appendPlayListAction())
  // },
})

export default connect(stateToProps, dispatchToProps)(Search)
