import { useEffect, useRef, useState } from 'react'
import { SearchBar } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import {useTouchEvent} from "@/utils/hook"

import * as api from '@/service'
import { formatForSearchResult } from '@/utils/tools'
import action from '@/store/action'
import List from '@/components/List'
import Scroll from '@/components/Scroll'

import './index.less'

const Search = () => {
  const dispatch = useDispatch()

  const [data, setData] = useState<any[]>([])
  const [, setBeforePullUp] = useState<boolean>(true)
  const [value, setValue] = useState<any>()
  const autoFocusInst = useRef<any>()
  const instanceRef = useRef<any>()
  const {onTouchStart, onTouchEnd} = useTouchEvent((songIndex: number) => {
    dispatch({ type: 'play-list/data', value: [data[songIndex]] })
      dispatch(action.beforeCanPlayAction(0))
  })

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
    const res = await getSearchResult(value)
    const { songs } = res.data.result
    let data = songs.map((item: any) => formatForSearchResult(item))
    setData((prev: any[]) => prev.concat(data))
    instance.finishPullUp()
    instance.refresh()
    setBeforePullUp(true)
    
  }

  const onChange = (value: any) => {
    setValue(value)
  }

  const onSubmit = async (value: any) => {
    let res = await getSearchResult(value)
    const { songs } = res.data.result
    let data = songs.map((item: any) => formatForSearchResult(item))
    setData(data)
  }

  const getSearchResult = (keywords: any) => {
    return api.getSearchResult(keywords, 10, 0)
  }

  useEffect(() => {
    // 问题: 自动获取光标动画为从右到左, 路由动画为从左到右;
    // autoFocusInst.current.focus()
  }, [])

  return (
    <div className="search--page page-container">
      <div className="search--input-container">
        <SearchBar placeholder="自动获取光标" ref={ref => (autoFocusInst.current = ref)} onChange={onChange} onSubmit={onSubmit} />
      </div>
      {data.length > 0 && (
        <Scroll mode="list-detail" config={instanceRef.current} pullDown={pullingDown} pullUp={pullingUp}>
          <List mode="PLAY_LIST" data={data} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
        </Scroll>
      )}
    </div>
  )
}


export default Search
