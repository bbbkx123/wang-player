import { useState, useContext, useEffect, useRef } from "react"
import { StoreContext } from "@/store"
import {songPlayAction} from "@/store/actions"
import { fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

// import List from "@/components/List"
import "./index.less"

import BScroll from "@better-scroll/core"
import PullDown from "@better-scroll/pull-down"
interface useFun {
  (plugin: any): any
}

const use: useFun = BScroll.use
use(PullDown)

const PlayListDetails = () => {
  const { dispatch } = useContext<any>(StoreContext)
  const listDetailRef = useRef<any>()
  const pullDownWrapperRef = useRef<any>()

  const [data, setData] = useState<any>()
  let BSInstance: any = null

  const getPlayListDetail = (detailId: string) => {
    return fetchPlayListDetail(detailId)
      .then((res: any) => {
        const _res = formatForPlayListDetail(res)
        const ids = _res.listData
          .splice(0, 10)
          .reduce((prev: any, cur: any) => prev.concat(cur, [","]), [])
          .slice(0, -1)
        return Promise.resolve({ ids, playlist: res.data.playlist })
      })
      .then((payload) => {
        const { ids, playlist } = payload
        return fetchSongsDetail(ids.join("")).then((res: any) => {
          const _ids = ids.join("").split(",")
          let listData = res.data.songs.map((item: any, index: number) => formatForSong(item, _ids[index]))
          const value = {
            listData,
            playlist: { ...playlist },
          }
          dispatch({
            type: "playListDetail",
            value,
          })
          return Promise.resolve(value)
        })
      })
  }
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
    })

    BSInstance.on("pullingDown", () => {
      console.log("pull-down")
      BSInstance.finishPullDown()
    })

    BSInstance.on("scroll", () => {
      // console.log("scroll")
    })

    BSInstance.openPullDown({})
  }

  const handlePlay = (songIndex: number) => {
    dispatch(songPlayAction(songIndex));
  }

  // better-scroll 实例
  useEffect(() => {
    if (BSInstance === null) {
      init()
    }
    return () => {}
  }, [])

  useEffect(() => {
    console.log("create")
    // 纯音乐 453208524    like 129219563   英文 3185023336
    getPlayListDetail("3185023336").then((data) => {
      setData(data)
    })
    return () => {
      console.log("destory")
    }
  }, [])

  return (
    <div style={{height: "100%"}}>
      <div ref={pullDownWrapperRef} style={{height: "100%"}}>
        <div className="list-detail" ref={listDetailRef}>
          {!!data && data.playlist && (
            <div className="list-detail-content">
              <div className="detail-wrapper">
                <div className="detail">
                  <div className="coverImg">
                    <img src={data.playlist.coverImgUrl} alt="" />
                  </div>
                  <div className="info">
                    <div>{data.playlist.name}</div>
                    <div>{data.playlist.nickname}</div>
                    <div>
                      <img
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                        src={data.playlist.avatarUrl}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="edit"></div>
              </div>
              <div className="song-list">
                {data.listData.map((item: any, index: any) => {
                  return (
                    <div className="song-item" key={`song-item-${index}`} onClick={() => handlePlay(index)}>
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
    </div>
  )
}

export default PlayListDetails
