import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"

import { fetchPlayListDetailAction, fetchPlayListAction, songReadyAction } from "@/store/actionCreator"

import BScroll from "@better-scroll/core"
import PullDown from "@better-scroll/pull-down"
import PullUp from "@better-scroll/pull-up"

import { Toast } from "antd-mobile"
import List from "@/components/List"

import { page as formatPageData } from "@/utils/tools"
import Loading from "@/utils/Loading"

import "./index.less"
interface useFun {
  (plugin: any): any
}

const use: useFun = BScroll.use
use(PullDown)
use(PullUp)

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const PlayListDetails = (props: any) => {
  const { listDetail, history, detailId, playListOfListDetail } = props
  const { handlePlay, getSongList, getPlayListDetail, handlePullUp, diapatchForListDetail, diapatchForPlayList, dispatchForPlayListOfListDetail } = props
  const pullDownWrapperRef = useRef<any>()
  const instanceRef = useRef<any>(null)
  const touchTimeRef = useRef<any>()
  const playList = useRef<any>()
  const pageRef = useRef<any>({
    size: 10,
    pageNo: 0,
    total: null,
    totalPage: null,
    modelForClient: [],
    modelForPage: [],
  })

  const [beforePullDown, setBeforePullDown] = useState<boolean>(true)
  const [beforePullUp, setBeforePullUp] = useState<boolean>(true)

  const pullingDown = () => {
    console.log("pull-down")
    // setBeforePullDown(true)
    instanceRef.current.finishPullDown()
  }

  const pullingUp = async () => {
    setBeforePullUp(false)
    handlePullUp(pageRef, instanceRef).then(
      () => setBeforePullUp(true),
      (err: any) => {
        setBeforePullUp(true)
        Toast.fail(err, 1.5, () => {}, false)
      }
    )
    instanceRef.current.finishPullUp()
  }

  const init = () => {
    instanceRef.current = new BScroll(pullDownWrapperRef.current, {
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
    })

    instanceRef.current.on("pullingDown", pullingDown)
    instanceRef.current.on("pullingUp", pullingUp)
    // instanceRef.current.on("scroll", () => {
    //   // console.log("scroll")
    // })
  }

  const handlePage = (listData: string[], pageSize: number) => {
    pageRef.current.modelForPage = formatPageData(listData, pageSize)
    pageRef.current.total = listData.length
    pageRef.current.totalPage = Math.ceil(listData.length / pageSize)
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = (songIndex: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 75) {
      diapatchForPlayList(playListOfListDetail)
      handlePlay(songIndex)
    }
    touchTimeRef.current = null
  }

  // *问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例
  useEffect(() => {
    // 数据加载完成
    if (Array.isArray(playListOfListDetail) && playListOfListDetail.length > 0) {
      if (instanceRef.current === null) {
        init()
      }
    }
  }, [playListOfListDetail])

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    const fetch = async () => {
      // const loadingInstance = new Loading({ tipLabel: "xxxx", type: 3, })
      // loadingInstance.init()

      let listData = await getPlayListDetail(detailId)
      handlePage(listData, 10)
      let payload = await getSongList(pageRef.current.modelForPage[0])
      dispatchForPlayListOfListDetail(payload.value)
      setTimeout(() => {
        //
        // loadingInstance.hide()
      }, 500)
    }
    if (detailId !== null) fetch()
    else {
      history.push({ pathname: "/" })
    }
    return () => {
      if (instanceRef.current) {
        instanceRef.current.off("pullingDown", pullingDown)
        instanceRef.current.off("pullingUp", pullingUp)
      }
      pullDownWrapperRef.current = null
    }
  }, [])

  return (
    <div className="transition-group">
      <div ref={pullDownWrapperRef} className="pull-down-wrapper">
        <div className="list-detail">
          {!beforePullDown && <div style={{ color: "red" }}>pulldown!</div>}

          <div>
            {listDetail && (
              <div className="detail-wrapper">
                <div className="detail">
                  <div className="coverImg">
                    <img src={listDetail.coverImgUrl} alt="" />
                  </div>
                  <div className="info">
                    <div>{listDetail.name}</div>
                    <div>{listDetail.nickname}</div>
                    <div>
                      <img
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                        src={listDetail.avatarUrl}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="edit"></div>
              </div>
            )}

            <div className="song-list" id="song-list">
              {playListOfListDetail.length > 0 && <List data={playListOfListDetail} mode="PLAY_LIST" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>}
            </div>
          </div>

          <div className="pullup-tips">
            {beforePullUp && (
              <div className="before-trigger">
                <span className="pullup-txt">Pull up and load more</span>
              </div>
            )}
            {!beforePullUp && (
              <div className="after-trigger">
                <span className="pullup-txt">Loading...</span>
              </div>
            )}
          </div>
          <div style={{ width: "100%", height: "50px" }}></div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  listDetail: state.global.listDetail,
  playList: state.playlist.data,
  detailId: state.global.detailId,
  playListOfListDetail: state.global.playList,
})

const dispatchToProps = (dispatch: any) => ({
  async getPlayListDetail(detailId: any) {
    const listData = await dispatch(fetchPlayListDetailAction(detailId))
    return Promise.resolve(listData)
  },
  async getSongList(songIdArr: string[]) {
    const payload = await dispatch(fetchPlayListAction(songIdArr))
    return Promise.resolve(payload)
  },
  handlePlay(songIndex: number) {
    dispatch(songReadyAction(songIndex))
  },
  diapatchForPlayList(playList: any[]) {
    dispatch({ type: "play-list/data", value: playList })
  },
  diapatchForListDetail(listDetail: any) {
    dispatch({ type: "global/list-detail", value: listDetail })
  },
  dispatchForPlayListOfListDetail(playList: any[]) {
    dispatch({ type: "global/play-list", value: playList })
  },
  dispatchForPlayStatus(status: boolean) {
    dispatch({ type: "audio/play-status", value: status })
  },
  async handlePullUp(pageRef: any, instanceRef: any) {
    console.log("pull-up")
    const { totalPage, modelForPage } = pageRef.current
    // pageNo从0开始, 需要转为实际页码
    if (pageRef.current.pageNo + 2 > totalPage) {
      Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 1.5, () => {}, false)
      instanceRef.current.finishPullUp()
      return
    }
    pageRef.current.pageNo += 1
    const songsId = modelForPage[pageRef.current.pageNo]
    const payload = await dispatch(fetchPlayListAction(songsId))
    const state = payload.getState()
    const prommise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          dispatch({ type: "play-list/data", value: state.playlist.data.concat(payload.value) })
          instanceRef.current.finishPullUp()
          instanceRef.current.refresh()
          resolve(true)
        } catch (err) {
          reject(err)
        }
      }, 1500)
    })

    return prommise
  },
})

export default connect(stateToProps, dispatchToProps)(PlayListDetails)
