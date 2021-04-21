import { useState, useContext, useEffect, useRef } from "react"
import { StoreContext } from "@/store"
import { fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

// import List from "@/components/List"
import "./index.less"

const PlayListDetails = () => {
  const { dispatch } = useContext<any>(StoreContext)
  const listDetailRef = useRef<any>()

  const [data, setData] = useState<any>()

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

  useEffect(() => {
    console.log("create")
    getPlayListDetail("129219563").then((data) => {
      setData(data)
    })
    return () => {
      console.log("destory")
    }
  }, [])

  return (
    <div>
      <div>
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
                    // onClick={handlePlay(index)}
                    <div className="song-item" key={`song-item-${index}`}>
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
