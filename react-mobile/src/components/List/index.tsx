import { useState, useEffect,useContext } from "react";
import { formatForPlayTime } from "@/utils/tools";

import { AppContext } from "@/store";
import { label as _label } from "./define";

const List = (props: any) => {
  const { data,listType } = props;

  const { EventEmitter, dispatch, currentSongIndex} = useContext<any>(AppContext)

  const [label, setLabel] = useState(_label);
  const [listData, setListData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(currentSongIndex);

  const play = (song: any, index: number) => {
    if (listType === 'search') {
      EventEmitter.$emit('song-play', song)
    } else if (listType === 'details') {
      // EventEmitter.$emit('song-play-all', {songlist: this.$store.getters.showlist, index})
    }
  }

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      let _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        // 处理时间格式
        item.duration = formatForPlayTime(item.duration / 1000);
      });
      setListData(_data);
    }
  }, [data]);

  useEffect(() => {
    setCurrentIndex(currentSongIndex)
  }, [currentSongIndex])

  return (
    <div className="list-wrapper">
      {data.length > 0 && (
        <div className="list-header">
          <div className="list-header-item" style={{ width: "50px" }}></div>
          <div className="list-header-item" style={{ width: "50px" }}>
            操作
          </div>
          {label.map((item, i) => {
            return (
              <div
                className="list-header-item"
                style={{ width: item.style.width }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      )}

      {listData.map((item: any, index) => {
        return (
          <div onDoubleClick={() => play(item, index)} className={`${index === currentIndex ? "click" : ""} list-row`}>
            <div className="list-row-item" style={{ width: "50px" }}>
              {index + 1}
            </div>
            <div className="list-row-item" style={{ width: "50px" }}>
              <span style={{ display: "inline-block" }} className="aixin">
                <i
                  style={{
                    fontSize: "13px",
                    color: item.favourite ? "#e03f40" : "#fff",
                  }}
                  className={`${item.favourite ? "icon-aixin" : ""} ${
                    !item.favourite ? "icon-aixin1" : ""
                  } iconfont`}
                ></i>
              </span>
              {/* <span style="display:inline-block;">
                  <i class="iconfont icon-xiazai1" style="font-size: 13px;color: rgba(255,255,255,0.3);"></i>
                </span>  */}
            </div>
            {label.map((headerItem, i) => {
              return (
                <div
                  className="list-row-item"
                  style={{ width: headerItem.style.width }}
                >
                  {item[headerItem.type]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default List;
