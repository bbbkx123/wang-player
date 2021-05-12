import { useState, useEffect, useRef } from "react"
import {connect} from "react-redux"
// import { withRouter } from "react-router-dom"

import Slider from "@/components/Slider"
import List from "@/components/List"

import * as api from "@/service"
import * as define from "./define"
import { formatForNewSongList } from "@/utils/tools"
import {beforeCanPlayAction} from "@/store/actionCreator"
import Loading from "@/utils/Loading"

import "./index.less"



const Recommend = (props: any) => {
  const { history } = props
  const {dispatchForDetailId, dispatchForPlayList, play} = props
  const [bannerArr, setBannerArr] = useState([])
  const [icons] = useState<any[]>(define.icons)
  const [recommendDetails, setRecommendDetails] = useState<any[]>([])
  const [newSongList, setNewSongList] = useState<any[]>([])
  const [dataReady, setDataReady] = useState<boolean>(false)
  const iconSliderConf = useRef<any>()
  const sliderConf = useRef<any>()
  const recommendConf = useRef<any>()
  const recommendPageConfRef = useRef<any>()
  const loadingInstance = useRef<any>()
  const touchTimeRef = useRef<any>()

  const pageToPlaylistDetail = (id: number) => {
    dispatchForDetailId(id)
    history.push({ pathname: "/playlistdetails"})
  }
  sliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false,
      probeType: 3,
    },
  }

  iconSliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
  }

  recommendConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
  }

  recommendPageConfRef.current = {
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = (songIndex: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 100) {
      // 单曲播放通过模拟歌单播放, 将单曲存入playlist中
      dispatchForPlayList([newSongList[songIndex]])
      play(0)
    }
    touchTimeRef.current = null
  }

  useEffect(() => {
    // if (loadingInstance.current === undefined) {
    //   loadingInstance.current = new Loading({ tipLabel: "xxxx", type: 3 })
    // }
    // loadingInstance.current.init()
    Promise.all([api.getBanner(0), api.getPersonalized(6), api.getNewSong(6)])
      .then(([res1, res2, res3]) => {
        setBannerArr(res1.data.banners)
        setRecommendDetails(res2.data.result)
        const data = res3.data.result.map((item: any) => formatForNewSongList(item))
        setNewSongList(data)
        setDataReady(true)
        return Promise.resolve()
      })
      .then(() => {
        // setTimeout(() => {
        //   loadingInstance.current.hide()
        // }, 500)
      })
    return () => {
      sliderConf.current = null
      iconSliderConf.current = null
      recommendConf.current = null
      recommendPageConfRef.current = null
      loadingInstance.current = null
      touchTimeRef.current = null
    }
  }, [])

  const recommendPage = (
    <>
      {/* banner滑动存在问题 */}
      <div className="banner-container">
        {/* <Slider mode="banner" config={sliderConf.current}>
          {bannerArr.length > 0 &&
            bannerArr.map((banner: any, index: number) => {
              return <img style={{ height: 130, width: "100%" }} src={`${banner.imageUrl}?param=375y140`} key={`banner-${index}`} />
            })}
        </Slider> */}
      </div>
      <div className="icon-wrapper">
        {/* <Slider mode="normal-scroll-x" config={iconSliderConf.current}>
          {icons.map((item, index) => {
            return (
              <div className="children-item" style={{ width: 50, height: 50 }} key={`icon-${index}`} onClick={() => pageToPlaylistDetail(0)}>
                <img src={process.env.PUBLIC_URL + "/image/" + item.name + ".png"} alt="" />
                <span>{item.name}</span>
              </div>
            )
          })}
        </Slider> */}
      </div>
      <div className="recommend-wrapper">
        <p className="recommend-wrapper--title">推荐歌单</p>
        {recommendDetails.length > 0 && (
          <Slider mode="normal-scroll-x" config={recommendConf.current}>
            {recommendDetails.map((item: any, index: number) => {
              return (
                <div className="children-item" style={{ width: 140, height: 160 }} key={`recommend-detail-${index}`} onClick={() => pageToPlaylistDetail(item.id)}>
                  <img src={item.picUrl} alt={item.name} />
                  <span className="text">{item.name}</span>
                </div>
              )
            })}
          </Slider>
        )}
      </div>
      <div>
        {/* <p>不可错过的精选</p>
        {newSongList.length > 0 && <List data={newSongList} mode="NEW_SONG"  onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>} */}
        <div style={{ width: "100%", height: 100 }}></div>
      </div>
    </>
  )

  return (
    <div style={{ position: "absolute", height: "calc(100% - 45px)", width: "calc(100% - 20px)" }}>
      {dataReady && (
        <Slider mode="normal-scroll-y" config={recommendPageConfRef.current}>
          {recommendPage}
        </Slider>
      )}
    </div>
  )
}

const stateToProps = (state: any) => ({
  // detailId: state.global.detailId,
})

const dispatchToProps = (dispatch: any) => ({
  dispatchForDetailId (id: number) {
    dispatch({type: "global/detail-id", value: id})
  },
  dispatchForPlayList (playlist: any[]) {
    dispatch({type: "play-list/data", value: playlist})
  },
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
})

export default connect(stateToProps, dispatchToProps)(Recommend)
