import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
// import { withRouter } from "react-router-dom"

import Scroll from "@/components/Scroll"
import List from "@/components/List"

import * as api from "@/service"
import * as define from "./define"
import { formatForNewSongList } from "@/utils/tools"
import { beforeCanPlayAction } from "@/store/audio/action"
import { withLoading } from "@/components/HOC/Loading"

import "./index.less"

const Recommend = (props: any) => {
  const { history } = props
  const { bannerArr, newSongList, personalize } = props
  const { setBannerArr, setPersonalize, setNewSongList, play, setPlayList, setDetailId } = props
  const [icons] = useState<any[]>(define.icons)
  const [loading, setLoading] = useState<boolean>(false)
  const touchTimeRef = useRef<any>()

  const pageToPlaylistDetail = (id: number) => {
    history.push({ pathname: "/playlistdetails",  query: {id}})
  }

  const fun1 = (index: number) => {
    if (index === 1) {
      pageToPlaylistDetail(3185023336)
    } else {
      setPlayList([{ artists: "Ellis/Laura Brehm", name: "Start Over", album: { name: "Start Over" }, sid: 573027032 }])
      play(0)
    }
  }

  const onTouchStart = () => {
    touchTimeRef.current = { date: new Date().getTime() }
  }

  const onTouchEnd = (songIndex: number) => {
    const date = new Date().getTime()
    if (date - touchTimeRef.current.date <= 100) {
      // 单曲播放通过模拟歌单播放, 将单曲存入playlist中
      setPlayList([newSongList[songIndex]])
      play(0)
    }
    touchTimeRef.current = null
  }

  useEffect(() => {
    let count = 0
    if (bannerArr.length === 0) {
      setLoading(true)
      api.getBanner(0).then((res: any) => {
        setBannerArr(res.data.banners)
        if (++count === 1) setTimeout(() => setLoading(false), 1000)
      })
    }

    if (personalize.length === 0) {
      setLoading(true)
      api.getPersonalized(6).then((res: any) => {
        setPersonalize(res.data.result)
        if (++count === 1) setTimeout(() => setLoading(false), 1000)
      })
    }

    if (newSongList.length === 0) {
      setLoading(true)
      api.getNewSong(6).then((res: any) => {
        const data = res.data.result.map((item: any) => formatForNewSongList(item))
        setNewSongList(data)
        if (++count === 1) setTimeout(() => setLoading(false), 1000)
      })
    }

    return () => {
      touchTimeRef.current = null
    }
  }, [])

  const RecommendMain = () => (
    <Scroll mode="normal-scroll-y" config={{ bscroll: define.recommendPageConf }}>
      {/* banner滑动存在问题 */}
      <div className="banner-container">
        {bannerArr.length > 0 && (
          <Scroll mode="banner" config={{ bscroll: define.sliderConf }} width="100%">
            {bannerArr.map((banner: any, index: number) => {
              return <img style={{ width: "100%", height: 140 }} src={`${banner.imageUrl}?param=375y140`} key={`banner-${index}`} />
            })}
          </Scroll>
        )}
      </div>
      <div className="icon-wrapper">
        <Scroll mode="normal-scroll-x" config={{ bscroll: define.iconSliderConf }} height={70} width={50}>
          {icons.map((item, index) => {
            return (
              <div className="children-item" key={`icon-${index}`} onClick={() => fun1(index)}>
                <img style={{ height: 50, width: 50 }} src={process.env.PUBLIC_URL + "/image/" + item.name + ".png"} alt="" />
                <span>{item.name}</span>
              </div>
            )
          })}
        </Scroll>
      </div>
      <div className="recommend-wrapper">
        <p className="recommend-wrapper--title">推荐歌单</p>
        {personalize.length > 0 && (
          <Scroll mode="normal-scroll-x" config={{ bscroll: define.personalizeConf }} height={175} width={140}>
            {personalize.map((item: any, index: number) => {
              return (
                <div className="children-item" key={`recommend-detail-${index}`} onClick={() => pageToPlaylistDetail(item.id)}>
                  <img src={`${item.picUrl}?param=140y140`} alt={item.name} />
                  <span className="text">{item.name}</span>
                </div>
              )
            })}
          </Scroll>
        )}
      </div>
      <div className="new-song-list--wrapper">
        <p className="title">不可错过的精选</p>
        {newSongList.length > 0 && <List data={newSongList} mode="NEW_SONG" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>}
        <div style={{ width: "100%", height: 100 }}></div>
      </div>
    </Scroll>
  )

  const RecommendWithLoading = withLoading(RecommendMain)

  return (
    <div className="page-container">
      <RecommendWithLoading loading={loading} />
    </div>
  )
}

const stateToProps = (state: any) => ({
  playList: state.playlist.data,
  bannerArr: state.recommend.banner,
  personalize: state.recommend.personalize,
  newSongList: state.recommend.newSongList,
})

const dispatchToProps = (dispatch: any) => ({
  
  setPlayList(playlist: any[]) {
    dispatch({ type: "play-list/data", value: playlist })
  },
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  setBannerArr(banner: any[]) {
    dispatch({ type: "views/recommend/banner", value: banner })
  },
  setPersonalize(personalize: any[]) {
    dispatch({ type: "views/recommend/personalize", value: personalize })
  },
  setNewSongList(newSongList: any[]) {
    dispatch({ type: "views/recommend/new-song-list", value: newSongList })
  },
})

export default connect(stateToProps, dispatchToProps)(Recommend)
