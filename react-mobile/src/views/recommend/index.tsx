import { useState, useEffect, useRef, useCallback } from "react"
import { connect } from "react-redux"

import Scroll from "@/components/Scroll"
import List from "@/components/List"

import * as api from "@/service"
import * as define from "./define"
import { formatForNewSongList } from "@/utils/tools"
import { beforeCanPlayAction } from "@/store/audio/action"
import { useAsync } from "@/utils/hook"
import Loading from "@/components/Loading"

import "./index.less"

const useBanners = (dispatch: Function) => {
  const { loading, execute, data, error } = useAsync(useCallback(async () => await api.fetchBanner(0), []))
  useEffect(() => execute(), [execute])
  useEffect(() => {
    const banners = data?.data?.banners
    if (Array.isArray(banners) && banners.length > 0) dispatch(banners)
  }, [data])
  return {
    _banners: data,
    bannersLoading: loading,
    bannersError: error,
  }
}

const usePersonalization = (dispatch: Function) => {
  const { loading, execute, data, error } = useAsync(useCallback(async () => await api.fetchPersonalization(6), []))
  useEffect(() => execute(), [execute])
  useEffect(() => {
    const personalization = data?.data?.result
    if (Array.isArray(personalization) && personalization.length > 0) dispatch(personalization)
  }, [data])
  return {
    _personalization: data,
    personalizationLoading: loading,
    personalizationError: error,
  }
}

const useNewSong = (dispatch: Function) => {
  const { loading, execute, data, error } = useAsync(useCallback(async () => await api.fetchNewSong(6), []))
  useEffect(() => execute(), [execute])
  useEffect(() => {
    const newSong = data?.data?.result
    if (Array.isArray(newSong) && newSong.length > 0) dispatch(newSong.map((item: any) => formatForNewSongList(item)))
  }, [data])
  return {
    newSong: data,
    newSongLoading: loading,
    newSongError: error,
  }
}

const Recommend = (props: any) => {
  const { history } = props
  const { banners, newSongList, personalization } = props
  const { setBanners, setPersonalization, setNewSongList, play, setPlayList } = props
  const [icons] = useState<any[]>(define.icons)
  const [loading, setLoading] = useState<boolean>(false)
  const touchTimeRef = useRef<any>()
  const { bannersLoading } = useBanners(setBanners)
  const { personalizationLoading } = usePersonalization(setPersonalization)
  const { newSongLoading } = useNewSong(setNewSongList)

  useEffect(() => {
    const isBoolean = [bannersLoading, personalizationLoading, newSongLoading].every((item: any) => typeof item === "boolean")
    if (!isBoolean) {
      setLoading(true)
    } else {
      const loadingResult = bannersLoading || personalizationLoading || newSongLoading
      if (!loadingResult) {
        setTimeout(() => setLoading(loadingResult), 500)
      } else {
        setLoading(loadingResult)
      }
    }
  }, [bannersLoading, personalizationLoading, newSongLoading])

  const pageToPlaylistDetail = (id: number) => {
    history.push({ pathname: "/playlistdetails", query: { id } })
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

  return (
    <div className="page-container">
      {loading && <Loading></Loading>}
      <Scroll mode="normal-scroll-y" config={{ bscroll: define.recommendPageConf }}>
        <div className="banner-container">
          {banners.length > 0 && (
            <Scroll mode="banner" config={{ bscroll: define.sliderConf }} width="100%">
              {banners.map((banner: any, index: number) => {
                return <img style={{ width: "100%", height: 140 }} src={`${banner.imageUrl}?param=375y140`} key={`banner-${index}`} alt="" />
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
          {personalization.length > 0 && (
            <Scroll mode="normal-scroll-x" config={{ bscroll: define.personalizeConf }} height={175} width={140}>
              {personalization.map((item: any, index: number) => {
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
    </div>
  )
}

const stateToProps = (state: any) => ({
  banners: state.recommend.banner,
  personalization: state.recommend.personalization,
  newSongList: state.recommend.newSongList,
})

const dispatchToProps = (dispatch: any) => ({
  setPlayList(playlist: any[]) {
    dispatch({ type: "play-list/data", value: playlist })
  },
  play(songIndex: number) {
    dispatch(beforeCanPlayAction(songIndex))
  },
  setBanners(banner: any[]) {
    dispatch({ type: "views/recommend/banner", value: banner })
  },
  setPersonalization(personalization: any[]) {
    dispatch({ type: "views/recommend/personalization", value: personalization })
  },
  setNewSongList(newSongList: any[]) {
    dispatch({ type: "views/recommend/new-song-list", value: newSongList })
  },
})

export default connect(stateToProps, dispatchToProps)(Recommend)
