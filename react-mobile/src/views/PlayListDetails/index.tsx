import { useCallback, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import actionCreator from "@/store/action"
import { useAsync, useTouchEvent } from "@/utils/hook"
import { formatForPlayListDetail, page as formatPageData, formatForSong } from "@/utils/tools"
import * as api from "@/service"
import Loading from "@/components/Loading"
import List from "@/components/List"
import Scroll from "@/components/Scroll"

import "./index.less"

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const action = async (detailId: any, dispatch: Function) => {
  try {
    const listDetail: any = await api.fetchPlayListDetail(detailId)
    const data = formatForPlayListDetail(listDetail.data)
    dispatch({ type: "detail/data", value: data })
    const pageModel = formatPageData(data.listData, 10)
    dispatch({ type: "detail/page-model", value: formatPageData(data.listData, 10) })
    dispatch({ type: "detail/songs-total", value: data.listData.length })
    dispatch({ type: "detail/page-total", value: Math.ceil(data.listData.length / 10) })
    const ids = pageModel[0].join(",")
    const response1 = await api.fetchSongsDetail(ids)
    let value = response1.data.songs.map((item: any, index: number) => formatForSong(item, pageModel[0][index]))
    dispatch({ type: "detail/play-list", value })
    return new Promise((resolve, reject) => setTimeout(() => resolve(true), 1000))
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

const useInitial = (dispatch: Function, history: any) => {
  const id = history?.location?.query?.id
  const detailId = useSelector((state: any) => state.detail.id)
  const { loading, execute } = useAsync(useCallback(action, []))
  // 加载数据
  useEffect(() => {
    if (!!id && detailId !== id) {
      dispatch({ type: "detail/id", value: id })
      execute(id, dispatch)
    }
  }, [detailId]) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    if (!id) history.push({ pathname: "/" })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return {
    loading,
  }
}

const instanceRef = {
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

const PlayListDetails = (props: any) => {
  const { history } = props
  const dispatch = useDispatch()
  const listDetail = useSelector((state: any) => state.detail.data)
  const playList = useSelector((state: any) => state.detail.playList)
  const { loading } = useInitial(dispatch, history)
  const { onTouchStart, onTouchEnd } = useTouchEvent((songIndex: any) => {
    dispatch({ type: "play-list/data", value: playList })
    dispatch(actionCreator.beforeCanPlayAction(songIndex))
  })

  const pullingDown = (instance: any) => {
    console.log("pull-down")
    instance.finishPullDown()
  }

  // 问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例

  return (
    <div className="page-container">
      {loading && <Loading></Loading>}
      {playList.length > 0 && (
        <Scroll mode="list-detail" config={instanceRef} pullDown={pullingDown} fetchDataForPullUp={() => dispatch(actionCreator.appendPlayListAction())}>
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
