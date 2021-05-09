import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { page as formatPageData } from '@/utils/tools'
import { Toast } from 'antd-mobile'
import List from '@/components/List'
import { fetchPlayListDetailAction, fetchPlayListAction, songReadyAction } from '@/store/actionCreator'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'
import './index.less'
interface useFun {
  (plugin: any): any
}

const use: useFun = BScroll.use
use(PullDown)
use(PullUp)

// 问题: pullup后, 返回上个页面, 再次进入页面长度异常(很长)
// 猜想为pullup对transformY设置存在问题

const PlayListDetails = (props: any) => {
  const { playList, playListDetail, history, showMiniPlayer } = props
  const { handlePlay, getSongList, getPlayListDetail, handlePullUp, diapatchForPlayList, dispatchForPlayStatus, dispatchForShowMiniPlayer } = props
  const pullDownWrapperRef = useRef<any>()
  const instanceRef = useRef<any>(null)
  const touchTimeRef = useRef<any>()
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
    console.log('pull-down')
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

    instanceRef.current.on('pullingDown', pullingDown)
    instanceRef.current.on('pullingUp', pullingUp)
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
      handlePlay(songIndex)
      dispatchForPlayStatus(true)
      if (!showMiniPlayer) dispatchForShowMiniPlayer(true)
    }
    touchTimeRef.current = null
  }

  // *问题: list高度大于BScroll容器高度, 却不能拉到底部(视觉上像已经拉到底部的感觉)
  // 解决: 该effect会触发**两次**(data为undefined和data有值的时候), BScroll进行实例时, data.playlist未获取到, 造成实例时BScroll容器高度是没有list数据的高度(高度数值小), 因此在data.playlist获取到后在进行实例
  useEffect(() => {
    // 数据加载完成
    if (Array.isArray(playList) && playList.length > 0) {
      if (instanceRef.current === null) {
        init()
      }
    }
  }, [playList])

  useEffect(() => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    const fetch = async () => {
      if (!history.location.query || !history.location.query.id) return
      let listData = await getPlayListDetail(history.location.query.id)
      handlePage(listData, 10)
      let payload = await getSongList(pageRef.current.modelForPage[0])
      diapatchForPlayList(payload.value)
    }
    fetch()
    return () => {
      if (instanceRef.current) {
        instanceRef.current.off('pullingDown', pullingDown)
        instanceRef.current.off('pullingUp', pullingUp)
      }
      pullDownWrapperRef.current = null
    }
  }, [])

  return (
    <div ref={pullDownWrapperRef} className="pull-down-wrapper">
      <div className="list-detail">
        {!beforePullDown && <div style={{ color: 'red' }}>pulldown!</div>}
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
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
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
              <List data={playList} mode="PLAY_LIST" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
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
        <div style={{ width: '100%', height: '50px' }}></div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({
  playListDetail: state.playlist.detail,
  playList: state.playlist.data,
  showMiniPlayer: state.global.showMiniPlayer,
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
    dispatch({ type: 'play-list/data', value: playList })
  },
  dispatchForPlayStatus(status: boolean) {
    dispatch({ type: 'audio/play-status', value: status })
  },
  dispatchForShowMiniPlayer(status: boolean) {
    dispatch({ type: 'global/show-mini-player', value: status })
  },
  async handlePullUp(pageRef: any, instanceRef: any) {
    console.log('pull-up')
    const { totalPage, modelForPage } = pageRef.current
    // pageNo从0开始, 需要转为实际页码
    if (pageRef.current.pageNo + 2 > totalPage) {
      Toast.fail('没有选择歌曲 (￣o￣) . z Z　', 1.5, () => {}, false)
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
          dispatch({ type: 'play-list/data', value: state.playlist.data.concat(payload.value) })
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
