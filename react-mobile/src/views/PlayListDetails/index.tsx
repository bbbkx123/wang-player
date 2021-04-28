import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { page as formatPageData } from "@/utils/tools"
import { Toast } from "antd-mobile"
import { fetchPlayListDetailAction, fetchPlayListAction, songPlayAction } from "@/store/actionCreator"

import "./index.less"

import BScroll from "@better-scroll/core"
import PullDown from "@better-scroll/pull-down"
import PullUp from "@better-scroll/pull-up"
interface useFun {
  (plugin: any): any
}

const use: useFun = BScroll.use
use(PullDown)
use(PullUp)

// 待添加: pullup

const PlayListDetails = (props: any) => {
  const { playList, playListDetail } = props
  const { handlePlay, getSongList, getPlayListDetail, handlePullUp } = props
  const listDetailRef = useRef<any>()
  const pullDownWrapperRef = useRef<any>()
  const instanceRef = useRef<any>(null)
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

  const init = () => {
    instanceRef.current = new BScroll(pullDownWrapperRef.current, {
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

    instanceRef.current.on("pullingDown", () => {
      // console.log("pull-down")
      setBeforePullDown(false)
      setBeforePullDown(true)
      instanceRef.current.finishPullDown()
    })

    instanceRef.current.on("pullingUp", async () => {
      setBeforePullUp(false)
      handlePullUp(pageRef, instanceRef).then(() => {
        setBeforePullUp(true)
      })
    })

    instanceRef.current.on("scroll", () => {
      // console.log("scroll")
    })
  }

  const handlePage = (listData: string[], pageSize: number) => {
    pageRef.current.modelForPage = formatPageData(listData, pageSize)
    pageRef.current.total = listData.length
    pageRef.current.totalPage = Math.ceil(listData.length / pageSize)
  }

  // better-scroll 实例
  // 问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度小), 因此在data.playlist获取到后在进行实例
  useEffect(() => {
    // 数据加载完成
    if (Array.isArray(playList) && playList.length > 0) {
      if (instanceRef.current === null) {
        init()
      } else {
        // if (!beforePullUp) {
          
        // }
      }
    }
  }, [playList])

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    const fun = async () => {
      let listData = await getPlayListDetail("3185023336")
      handlePage(listData, 10)
      if (playList.length === 0) {
        await getSongList(pageRef.current.modelForPage[0])
      }
    }
    fun()
    return () => {}
  }, [])

  return (
    <div ref={pullDownWrapperRef} className="pull-down-wrapper">
      <div className="list-detail" ref={listDetailRef}>
        {!beforePullDown && <div style={{ color: "red" }}>pulldown!</div>}
        {playListDetail && (
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
              {playList &&
                playList.map((item: any, index: any) => {
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
    return Promise.resolve(listData)
  },
  async getSongList(songIdArr: string[]) {
    debugger
    const playList = await dispatch(fetchPlayListAction(songIdArr))
    return Promise.resolve(playList)
  },
  handlePlay(songIndex: number) {
    dispatch(songPlayAction(songIndex))
  },
  async handlePullUp (pageRef: any, instanceRef: any) {
    debugger
    console.log("pull-up")
    
    // pageNo从0开始, 需要转为实际页码
    if (pageRef.current.pageNo + 2 > pageRef.current.totalPage) {
      Toast.fail("没有选择歌曲 (￣o￣) . z Z　", 3, () => {}, false)
      instanceRef.current.finishPullUp()
      return
    }
    pageRef.current.pageNo += 1
    const songsId = pageRef.current.modelForPage[pageRef.current.pageNo]
    await dispatch(fetchPlayListAction(songsId))

    setTimeout(() => {
      instanceRef.current.finishPullUp()
      instanceRef.current.refresh()
      // setBeforePullUp(true)
    }, 1000)
    return Promise.resolve()
  },
})

export default connect(stateToProps, dispatchToProps)(PlayListDetails)
