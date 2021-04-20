import { useState, useContext, useEffect } from "react"
import { StoreContext } from "@/store"
import { fetchPlayListDetail, fetchSongsDetail } from "@/service/index"
import { formatForPlayListDetail, formatForSong } from "@/utils/tools"

import List from "@/components/List"

const PlayListDetails = () => {
  const { dispatch } = useContext<any>(StoreContext)

  const [listData, setListData] = useState([])

  const getPlayListDetail = (detailId: string) => {
    return fetchPlayListDetail(detailId)
      .then((res: any) => {
        const _res = formatForPlayListDetail(res)
        const ids = _res.listData
          .splice(0, 10)
          .reduce((prev: any, cur: any) => prev.concat(cur, [","]), [])
          .slice(0, -1)
        return Promise.resolve(ids)
      })
      .then((ids) => {
        return fetchSongsDetail(ids.join("")).then((res: any) => {
          const _ids = ids.join("").split(",")
          let listData = res.data.songs.map((item: any, index: number) => formatForSong(item, _ids[index]))
          const value = {
            ...res.data,
            detailId,
            listData,
          }
          delete value.code

          dispatch({
            type: "playListDetail",
            value,
          })
          return Promise.resolve(value)
        })
      })
  }

  useEffect(() => {
    console.log("create");
    getPlayListDetail("129219563").then(res => {
      setListData(res.listData)
    })
    return () => {
      console.log("destory");
      
    }
  }, [])

  return (
    <div>
      playListDetails
      <List listType="details" data={listData}></List>
    </div>
  )
}

export default PlayListDetails
