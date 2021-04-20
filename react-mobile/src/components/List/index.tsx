import { useState, useEffect, useContext } from "react"
import { formatForPlayTime } from "@/utils/tools"

import { StoreContext } from "@/store"
import { label } from "./define"
import "./index.less"

const List = (props: any) => {
  const { data, listType } = props

  const { EventEmitter, dispatch, currentSongIndex } = useContext<any>(StoreContext)

  const [listData, setListData] = useState([])

  const play = (song: any, index: number) => {
    if (listType === "search") {
      EventEmitter.$emit("song-play", song)
    } else if (listType === "details") {
      // EventEmitter.$emit('song-play-all', {songlist: this.$store.getters.showlist, index})
    }
  }

  const listRow = (listRow: any) => {
    const artistStr = (artArr: any[]) => {
      let str = artArr.reduce((prev, cur) => prev + cur.name + ",", "")
      return str.substring(0, str.length - 1)
    }
    return label.map((item, i) => {
      return (
        <div className="list__row--item" style={{ width: "33%" }} key={`list__row--item-${i}`}>
          {
            item.type === "artist" && artistStr(listRow.artist)
          }
          {
            item.type !== "artist" && listRow[item.type]
          }
        </div>
      )
    })
  }

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      let _data = JSON.parse(JSON.stringify(data))
      _data.forEach((item: any) => {
        // 处理时间格式
        item.duration = formatForPlayTime(item.duration / 1000)
      })
      setListData(_data)
    }
  }, [data])

  return (
    <div className="list--wrapper">
      {data.length > 0 && (
        <div className="list__header">
          <div className="list__header--item"></div>
          <div className="list__header--item">操作</div>
          {label.map((item, i) => {
            return (
              <div className="list__header--item" style={{ width: item.style.width }} key={`list__header--item-${i}`}>
                {item.name}
              </div>
            )
          })}
        </div>
      )}

      {listData.map((item: any, index) => {
        debugger
        return (
          <div onDoubleClick={() => play(item, index)} className={`${index === currentSongIndex ? "click" : ""} list__row`} key={`list-item-${index}`}>
            <div className="list__row--item">{index + 1}</div>
            <div className="list__row--item">
              <span style={{ display: "inline-block" }} className="aixin">
                <i
                  style={{
                    fontSize: "13px",
                    color: item.favourite ? "#e03f40" : "#fff",
                  }}
                  className={`${item.favourite ? "icon-aixin" : ""} ${!item.favourite ? "icon-aixin1" : ""} iconfont`}
                ></i>
              </span>
              {/* <span style="display:inline-block;">
                  <i class="iconfont icon-xiazai1" style="font-size: 13px;color: rgba(255,255,255,0.3);"></i>
                </span>  */}
            </div>
            {listRow(item)}
          </div>
        )
      })}
    </div>
  )
}

export default List
