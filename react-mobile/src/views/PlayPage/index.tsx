import { useState, useEffect, useContext, useRef } from "react";

import ProgressBar from "@/components/ProgressBar";
import { AppContext } from "@/store";
import {
  fetchPlayListDetail,
  fetchSongsDetail,
  fetchSongUrl,
} from "@/service/index";
import {formatForPlayListDetail, formatForSong} from "@/utils/tools"
import { useWatch } from "@/utils/hook";

import Player from "@/components/Player";

import "./index.less";

const PlayPage = () => {
  const audioRef = useRef<any>(null);
  const { dispatch, EventEmitter } = useContext<any>(AppContext);
  const { count, playListDetail, duration, volume } = useContext<any>(
    AppContext
  );
  const [percent, setPercent] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isProgressChanging, setIsProgressChanging] = useState<boolean>(false);
  // const [volume, setVolume] = useState<number>(0)
  // const [loop, setLoop] = useState<boolean>(false)
  const [audioSrc, setAudioSrc] = useState<string>("");
  const eventsName = EventEmitter.eventNames();

  const getPlayListDetail = () => {
    return fetchPlayListDetail("129219563")
      .then((res: any) => Promise.resolve(formatForPlayListDetail(res)))
      .then((res: any) => {
        const ids = res.listData
          .splice(0, 10)
          .reduce((prev: any, cur: any) => prev.concat(cur, [","]), []).slice(0, -1)
        return fetchSongsDetail(ids.join("")).then((res1: any) => {
          const _ids = ids.join("").split(",")
          let _listData = res1.data.songs.map((item: any, index: number) => formatForSong(item, _ids[index]));
          dispatch({
            type: "playListDetail",
            value: {
              ...res,
              listData: _listData,
            },
          });
        });
      });
  };

  const getSongUrl = (sid: string) => {
    return fetchSongUrl(sid).then((res: any) => {
      return Promise.resolve(res.data.data[0].url);
    });
  };  

  // progress事件订阅
  useEffect(() => {
    if (!eventsName.includes("progress-changing")) {
      EventEmitter.addListener(
        "progress-changing",
        (percent: number) => {
          setIsProgressChanging(true);
          setPercent(percent);
        },
        { passive: false }
      );
    }
    return () => {
      EventEmitter.removeAllListeners(["progress-changing"]);
    };
  }, []);

  useEffect(() => {
    getPlayListDetail();
  }, []);

  useEffect(() => {
    EventEmitter.addListener(
      "progress-change",
      (percent: number) => {
        setPercent(percent);
        setIsProgressChanging(false);
        audioRef.current.currentTime = duration * percent;
      },
      { passive: false }
    );
    
    return () => {
      EventEmitter.removeAllListeners(["progress-change"]);
    };
  }, [duration]);

  /**
   * 问题: 在useEffect(()=>{}, [])中, timeupdate回调中无法读取 currentTime 和 duration, 暂时使用useEffect来更新percent
   * 解决: 独立使用useEffect, useEffect(()=>{}, [currentTime, duration])可以获取到
   */
  useEffect(() => {
      EventEmitter.addListener("timeupdate", (payload: any) => {
        const {currentTime} = payload
        setCurrentTime(currentTime)
        setPercent(currentTime / duration);
        console.log(duration, currentTime);
      });

    return () => {
      EventEmitter.removeAllListeners(["timeupdate"]);
    };
  }, [duration]);


  // 初始audio实例
  // 1. 通过audio.current.src直接设置无效, 在标签中设置src可以生效 src={xxx}
  // 2. chrome66以及更高的版本不允许媒体自动播放, 76前可以通过设置  chrome://flags/#autoplay-policy 设置 autoplay-policy 为  “No user gesture is required”
  //  77需要通过查看网站信息 设置允许声音

  const fun1 = () => {
    // () => dispatch({type: 'count'})
    audioRef.current.paused
      ? audioRef.current.play()
      : audioRef.current.pause();
  };

  useWatch(playListDetail, () => {
    getSongUrl(playListDetail.listData[0].sid).then((url: any) => setAudioSrc(url));
  });

  return (
    <div className="play">
      <div className="play--poster">play {count}</div>
      <div className="play--control">
        <ProgressBar percent={percent}></ProgressBar>
        <span>{currentTime}</span>
        <span onClick={() => fun1()}>click</span>
      </div>
      <Player ref={audioRef} songUrl={audioSrc}></Player>
    </div>
  );
};

export default PlayPage;
