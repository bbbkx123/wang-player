import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { beforeCanPlayAction } from "@/store/audio/action"
import { appendPlayListAction } from "@/store/detail/action"
import { initialActionForListDetail } from "@/store/detail/action"
import Loading from "@/components/Loading"
import {useLoading} from "@/utils/hook"
import { fetchPlayListDetail } from "@/service/index"

import { Toast } from "antd-mobile"
import List from "@/components/List"
import Scroll from "@/components/Scroll"

import "./index.less"

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const PlayListDetails = (props: any) => {
  const { listDetail, history, detailId, playListOfListDetail } = props
  const { play, setPlayList, initialForListDetail, appendPlayList, setDetailId } = props
  // const [loading, setLoading] = useState<boolean>(false)
  const pullDownWrapperRef = useRef<any>()
  const instanceRef = useRef<any>(null)
  const touchTimeRef = useRef<any>()

  // const [beforePullDown, setBeforePullDown] = useState<boolean>(true)
  const [beforePullUp, setBeforePullUp] = useState<boolean>(true)

  const {loading, fetch} = useLoading(fetchPlayListDetail)

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
    console.log("pull-down")
    instance.finishPullDown()
  }

  // 问题: 待优化
  const pullingUp = async (instance: any) => {
    setBeforePullUp(false)
    let res = await appendPlayList()
    if (!res.success) {
      Toast.fail(res.msg, 1.5, () => {}, false)
      instance.finishPullUp()
    } else {
      instance.finishPullUp()
      instance.refresh()
    }
    setBeforePullUp(true)
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = (songIndex: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 75) {
      setPlayList(playListOfListDetail)
      play(songIndex)
    }
    touchTimeRef.current = null
  }

  // *问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    const id = history?.location?.query?.id
    if (!id) history.push({ pathname: "/" })
    if (detailId === null || detailId !== id) {
      setDetailId(id)
      fetch(id).then((res: any) => {
        const {setLoading} = res
        // setLoading(false)
      })
    }

    return () => {
      pullDownWrapperRef.current = null
    }
  }, [])

  const PlayListDetailMain = () => (
    <Scroll mode="list-detail" config={instanceRef.current} pullDown={pullingDown} fetchDataForPullUp={appendPlayList}>
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
            <List data={playListOfListDetail} mode="PLAY_LIST" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
          </div>
        </div>
        <div style={{ width: "100%", height: "50px" }}></div>
      </div>
    </Scroll>
  )

  // const ViewMainWithLoading = withLoading(PlayListDetailMain)

  return (
    <div className="page-container">
      {/* <ViewMainWithLoading loading={loading} /> */}
      {JSON.stringify(loading)}
      {loading && <Loading></Loading>}
      { !loading && playListOfListDetail.length > 0 && PlayListDetailMain()}
    </div>
  )
}

const stateToProps = (state: any) => ({
  listDetail: state.detail.data,
  playList: state.playlist.data,
  detailId: state.detail.id,
  playListOfListDetail: state.detail.playList,
})

const dispatchToProps = (dispatch: any) => ({
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  setPlayList(playList: any[]) {
    dispatch({ type: "play-list/data", value: playList })
  },
  appendPlayList() {
    return dispatch(appendPlayListAction())
  },
  initialForListDetail(detailId: any) {
    return dispatch(initialActionForListDetail(detailId))
  },
  setDetailId(id: number) {
    dispatch({ type: "detail/id", value: id })
  },
})

export default connect(stateToProps, dispatchToProps)(withRouter(PlayListDetails))
