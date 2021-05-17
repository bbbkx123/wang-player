import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"

import { beforeCanPlayAction } from "@/store/actionCreator"
import { initialActionForListDetail, appendPlayListAction } from "@/store/global/action"

import { Toast } from "antd-mobile"
import List from "@/components/List"
import Slider from "@/components/Slider"

import "./index.less"

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const PlayListDetails = (props: any) => {
  const { listDetail, history, detailId, playListOfListDetail } = props
  const { play, diapatchForPlayList, initialForListDetail, appendPlayList } = props
  const pullDownWrapperRef = useRef<any>()
  const instanceRef = useRef<any>(null)
  const touchTimeRef = useRef<any>()

  const [beforePullDown, setBeforePullDown] = useState<boolean>(true)
  const [beforePullUp, setBeforePullUp] = useState<boolean>(true)

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
      diapatchForPlayList(playListOfListDetail)
      play(songIndex)
    }
    touchTimeRef.current = null
  }

  // *问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    if (detailId !== null) {
      initialForListDetail(detailId)
    } else {
      history.push({ pathname: "/" })
    }

    return () => {
      pullDownWrapperRef.current = null
    }
  }, [])

  const PlayListDetailMain = (
    <Slider mode="list-detail" config={instanceRef.current} pullDown={pullingDown} pullUp={pullingUp}>
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
                  <div className="text">{listDetail.name}</div>

                  <div style={{ display: "flex" }}>
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                      src={listDetail.avatarUrl}
                      alt=""
                    />
                    <div>{listDetail.nickname}</div>
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
    </Slider>
  )

  return <div className="page-container">{playListOfListDetail.length > 0 && PlayListDetailMain}</div>
}

const stateToProps = (state: any) => ({
  listDetail: state.global.listDetail,
  playList: state.playlist.data,
  detailId: state.global.detailId,
  playListOfListDetail: state.global.playList,
})

const dispatchToProps = (dispatch: any) => ({
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  diapatchForPlayList(playList: any[]) {
    dispatch({ type: "play-list/data", value: playList })
  },
  diapatchForListDetail(listDetail: any) {
    dispatch({ type: "global/list-detail", value: listDetail })
  },
  dispatchForPlayStatus(status: boolean) {
    dispatch({ type: "audio/play-status", value: status })
  },
  appendPlayList() {
    return dispatch(appendPlayListAction())
  },
  initialForListDetail(detailId: any) {
    dispatch(initialActionForListDetail(detailId))
  },
})

export default connect(stateToProps, dispatchToProps)(PlayListDetails)
