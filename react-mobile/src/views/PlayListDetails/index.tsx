import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import {  page } from "@/utils/tools"

import { fetchPlayListDetailAction, fetchPlayListAction } from "@/store/actionCreator"

import "./index.less"

import BScroll from "@better-scroll/core"
import PullDown from "@better-scroll/pull-down"
import PullUp from "@better-scroll/pull-up"
interface useFun {
  (plugin: any): any
}

const use: useFun = BScroll.use
use(PullDown)

// 待添加: pullup

const PlayListDetails = (props: any) => {
  const { playList, playListDetail, getPlayListDetail } = props
  const listDetailRef = useRef<any>()
  const pullDownWrapperRef = useRef<any>()

  const [data, setData] = useState<any>()
  const [beforePullDown, setBeforePullDown] = useState<boolean>(true)
  const [beforePullUp, setBeforePullUp] = useState<boolean>(true)

  let BSInstance: any = null

  const init = () => {
    BSInstance = new BScroll(pullDownWrapperRef.current, {
      scrollY: true,
      scrollX: false,
      // 锁定方向
      directionLockThreshold: 0,
      freeScroll: false,
      pullDownRefresh: {
        threshold: 90,
        stop: 40,
      },
      pullUpLoad: true,
    })

    BSInstance.on("pullingDown", () => {
      // console.log("pull-down")
      setBeforePullDown(false)
      setBeforePullDown(true)
      BSInstance.finishPullDown()
    })

    // BSInstance.on("pullingUp", () => {
    //   console.log("pull-up")
    //     BSInstance.finishPullDown()
    // })

    BSInstance.on("scroll", () => {
      // console.log("scroll")
    })
  }

  const handlePlay = (songIndex: number) => {
    // dispatch(songPlayAction(songIndex))
  }

  // better-scroll 实例
  // 问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度小), 因此在data.playlist获取到后在进行实例
  useEffect(() => {
    // 如果data变化过快, BSInstance 还未完成实例, 会导致init多次执行, 后续可以考虑加入 实例进行中的标志位
    if (!!data && Array.isArray(playList) && BSInstance === null) {
      init()
    }
    return () => {}
  }, [data])

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    getPlayListDetail("3185023336").then((res: any) => setData(res))
    return () => {}
  }, [])

  return (
    <div ref={pullDownWrapperRef} className="pull-down-wrapper">
      <div className="list-detail" ref={listDetailRef}>
        {!beforePullDown && <div style={{ color: "red" }}>pulldown!</div>}
        {!!playListDetail && (
          <div>
            <div className="detail-wrapper">
              <div className="detail">
                <div className="coverImg">
                  <img src={playListDetail.coverImgUrl} alt="" />
                </div>
                <div className="info">
                  <div>{playListDetail.name}</div>
                  <div>{playListDetail.nickname}</div>
                  <div>
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                      src={playListDetail.avatarUrl}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="edit"></div>
            </div>
            <div className="song-list">
              {playList.map((item: any, index: any) => {
                return (
                  <div className="song-item" key={`song-item-${index}`} onTouchStart={() => handlePlay(index)}>
                    <div className="index">{index + 1}</div>
                    <div className="main">
                      <div className="song-name">{item.name}</div>
                      <div className="other-info">
                        <span className="info">{`${item.artist.reduce((prev: any, cur: any) => prev + " " + cur.name, "")} - ${item.album.name}`}</span>
                        <span>{}</span>
                      </div>
                    </div>
                    <div className="edit"></div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  EventEmitter: state.EventEmitter,
  playListDetail: state.playListDetail,
  playList: state.playList,
  test: state.test,
})

const dispatchToProps = (dispatch: any) => ({
  async getPlayListDetail(detailId: any, props: any) {
    const listData = await dispatch(fetchPlayListDetailAction(detailId))
    const listByPage = page(listData, 10, 2)
    const playList = await dispatch(fetchPlayListAction(listByPage))
    return Promise.resolve(playList)
  },
})

export default connect(stateToProps, dispatchToProps)(PlayListDetails)
