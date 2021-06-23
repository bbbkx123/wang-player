import { useCallback, useEffect } from "react"
import { useSelector, useDispatch, useStore } from "react-redux"
import { withRouter } from "react-router-dom"
import actionCreator from "@/store/action"
import { useAsync, useTouchEvent } from "@/utils/hook"
import { formatForPlayListDetail, page as formatPageData, formatForSong } from "@/utils/tools"
import * as api from "@/service"
import Loading from "@/components/Loading"
import List from "@/components/List"
import Scroll from "@/components/Scroll"
import { instanceRef } from "./define"

import "./index.less"

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const getSongs = async (ids: string) => {
  const res = await api.fetchSongsDetail(ids)
  return res.data.songs.map(formatForSong)
}

const action = async (detailId: string, dispatch: Function) => {
  try {
    const res: Pick<any, 'data'> = await api.fetchPlayListDetail(detailId)
    const data = formatForPlayListDetail(res.data)
    dispatch({ type: "detail/data", value: data })
    const pageModel = formatPageData(data.listData, 10)
    dispatch({ type: "detail/page-model", value: formatPageData(data.listData, 10) })
    dispatch({ type: "detail/songs-total", value: data.listData.length })
    dispatch({ type: "detail/page-total", value: Math.ceil(data.listData.length / 10) })
    const ids = pageModel[0].join(",")
    let value = await getSongs(ids)
    dispatch({ type: "detail/play-list", value })
    return new Promise(resolve => setTimeout(() => resolve(true), 1000))
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

// 初始化hook, 用于详情页
const useInitial = (history: any, dispatch: Function) => {
  const id = history?.location?.query?.id
  const detailId = useSelector((state: StoreState) => state.detail.id)
  const { loading, execute } = useAsync(useCallback(action, []))
  // 加载数据
  useEffect(() => {
    if (!!id && detailId !== id) {
      dispatch({ type: "detail/id", value: id })
      execute(id, dispatch )
    }
  }, [detailId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!id) history.push({ pathname: "/" })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return {
    loading,
  }
}

const handleAppendPlayList = async (state: any, dispatch: Function) => {
  const { pageNo, pageTotal } = state.detail
  if (pageNo + 2 > pageTotal) {
    return Promise.resolve({ success: false, msg: "没有选择歌曲 (￣o￣) . z Z　" })
  }
  dispatch({ type: "detail/page-no", value: pageNo + 1 })
  const ids = state.detail.pageModel[pageNo + 1].join(",")
  const value = await getSongs(ids)
  dispatch({ type: "detail/play-list", value: state.detail.playList.concat(value) })
  return Promise.resolve({ success: true })
}

const PlayListDetails = (props: any) => {
  const { history } = props
  const store = useStore()
  const state = store.getState()
  const dispatch = useDispatch()
  const listDetail = useSelector((state: StoreState) => state.detail.data)
  const playList = useSelector((state: StoreState) => state.detail.playList)
  const { loading } = useInitial(history, dispatch)
  const { onTouchStart, onTouchEnd } = useTouchEvent((songIndex: number) => {
    dispatch({ type: "play-list/data", value: playList })
    dispatch(actionCreator.beforeCanPlayAction(songIndex))
  })

  const onReload = () => {}

  // 问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例

  return (
    <div className="page-container">
      {loading && <Loading></Loading>}
      {playList.length > 0 && (
        <Scroll mode="list-detail" config={instanceRef} onReload={onReload} fetchDataForPullUp={() => handleAppendPlayList(state, dispatch)}>
          <div className="list-detail">
            {/* {!beforePullDown && <div style={{ color: "red" }}>pulldown!</div>} */}
            <div>
              {listDetail && (
                <div className="list-detail--top">
                  <div className="detail">
                    <div className="list-detail--coverImg">
                      <img src={listDetail.coverImgUrl} alt="" />
                    </div>
                    <div className="list-detail--info">
                      <div className="list-detail--name">{listDetail.name}</div>
                      <div className="list-detail--creator-info">
                        <img src={listDetail.avatarUrl} alt="" />
                        <div className="list-detail--nickname">{listDetail.nickname}</div>
                      </div>
                    </div>
                  </div>
                  <div className="edit"></div>
                </div>
              )}
              <div className="song-list" id="song-list">
                <List data={playList} mode="PLAY_LIST" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
              </div>
            </div>
            <div style={{ width: "100%", height: "50px" }}></div>
          </div>
        </Scroll>
      )}
    </div>
  )
}

export default withRouter(PlayListDetails)
