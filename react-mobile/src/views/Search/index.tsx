import { useEffect, useRef, useState } from "react"
import {SearchBar} from "antd-mobile"
import {connect} from "react-redux"
// import {Route, Switch} from "react-router-dom"

import * as api from "@/service"
import {formatForSearchResult,} from "@/utils/tools"
import {beforeCanPlayAction} from "@/store/actionCreator"
import List from "@/components/List"

import "./index.less"

const SearchHome = () => {
  return <div>SearchHome</div>
}

const SearchResult = () => {
  return <div>SearchResult</div>
}



const Search = (props: any) => {
  const {diapatchForPlayList, play} = props

  const [data, setData] = useState<any[]>([])
  const autoFocusInst = useRef<any>()
  const touchTimeRef = useRef<any>()

  const onChange = (value: any) => {
    // setValue(value)
  }

  const onSubmit = (value: any) => {
    getSearchResult(value)
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = async (songIndex: number, id: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 100) {
      diapatchForPlayList([data[songIndex]])
      console.log(JSON.stringify(data[songIndex]));
      play(0)
    }
    touchTimeRef.current = null
  }

  const getSearchResult = (keywords: any) => {
    api.getSearchResult(keywords, 10, 0).then((res:any) => {
      const {songs} = res.data.result
      let data = songs.map((item: any) => formatForSearchResult(item))
      setData(data)
    })
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
      <SearchBar placeholder="自动获取光标" ref={ref => autoFocusInst.current = ref} onChange={onChange} onSubmit={onSubmit}/>
      </div>
      <div>
         {data.length > 0 && <List mode="PLAY_LIST" data={data} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>}
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  listDetail: state.global.listDetail,
})

const dispatchToProps = (dispatch: any) => ({
  diapatchForPlayList (playList: any[]) {
    dispatch({type: "play-list/data", value: playList})
  },
  play (songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  }
})


export default connect(stateToProps, dispatchToProps)(Search)