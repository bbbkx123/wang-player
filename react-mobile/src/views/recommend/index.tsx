import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import {Toast} from "antd-mobile"

import Scroll from "@/components/Scroll";
import List from "@/components/List";
import Loading from "@/components/Loading";

import * as api from "@/service";
import * as define from "./define";
import { formatForNewSongList } from "@/utils/tools";
import { beforeCanPlayAction } from "@/store/audio/action";
import { useAsync, useTouchEvent } from "@/utils/hook";

import "./index.less";

const useBanners = (dispatch: Function, state: any) => {
  const { loading, execute, data, error } = useAsync(
    useCallback(async () => await api.fetchBanner(0), [])
  );
  useEffect(() => {
    if (state.recommend.banners.length <= 0) execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const banners = data?.data?.banners;
    if (Array.isArray(banners) && banners.length > 0)
      dispatch({ type: "views/recommend/banners", value: banners });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    data,
    loading,
    error,
  };
};

const usePersonalization = (dispatch: Function, state: any) => {
  const { loading, execute, data, error } = useAsync(
    useCallback(async () => await api.fetchPersonalization(6), [])
  );
  useEffect(() => {
    if (state.recommend.personalization.length <= 0) execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const personalization = data?.data?.result;
    if (Array.isArray(personalization) && personalization.length > 0)
      dispatch({
        type: "views/recommend/personalization",
        value: personalization,
      });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    data,
    loading,
    error,
  };
};

const useNewSong = (dispatch: Function, state: any) => {
  const { loading, execute, data, error } = useAsync(
    useCallback(async () => await api.fetchNewSong(6), [])
  );
  useEffect(() => {
    if (state.recommend.newSongList.length <= 0) execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newSong = data?.data?.result;
    if (Array.isArray(newSong) && newSong.length > 0) {
      let list = newSong.map((item: any) => formatForNewSongList(item));
      dispatch({ type: "views/recommend/new-song-list", value: list });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    data,
    loading,
    error,
  };
};

const Recommend = (props: any) => {
  const { history } = props;
  const [icons] = useState<any[]>(define.icons);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const store = useStore();
  const banners = useSelector((state: any) => state.recommend.banners);
  const personalization = useSelector(
    (state: any) => state.recommend.personalization
  );
  const newSongList = useSelector((state: any) => state.recommend.newSongList);
  const showController = useSelector(
    (state: any) => state.global.showController
  );

  const { loading: bannersLoading } = useBanners(dispatch, store.getState());
  const { loading: personalizationLoading } = usePersonalization(
    dispatch,
    store.getState()
  );
  const { loading: newSongLoading } = useNewSong(dispatch, store.getState());

  const { onTouchStart, onTouchEnd } = useTouchEvent((songIndex: number) => {
    dispatch({ type: "play-list/data", value: [newSongList[songIndex]] });
    if (!showController && window.location.pathname !== "/play") {
      dispatch({ type: "global/show-controller", value: true });
    }
    dispatch(beforeCanPlayAction(0));
  });

  

  useEffect(() => {
    const isBoolean = [
      bannersLoading,
      personalizationLoading,
      newSongLoading,
    ].every((item: any) => typeof item === "boolean");
    // 问题: loading会闪一下
    /*
      原因: 首次加载, isBoolean为false后再变为true, setLoading快速改变; 
      如果!isBoolean时setLoading(true)会造成后续回到recommend页面一直处于loading
    */
    if (!isBoolean) {
      setLoading(false);
    } else {
      const loadingResult =
        bannersLoading || personalizationLoading || newSongLoading;
      if (!loadingResult) {
        setTimeout(() => setLoading(loadingResult), 500);
      } else {
        setLoading(loadingResult);
      }
    }
  }, [bannersLoading, personalizationLoading, newSongLoading]);

  const pageToPlaylistDetail = (id: number) => {
    history.push({ pathname: "/playlistdetails", query: { id } });
  };

  const toMoreDetail = useCallback(() => {
    history.push({ pathname: "/moredetails" });
  }, [])

  const testTouch = (index: number) => {
    // 纯音乐 453208524    like 129219563   英文 3185023336
    if (index === 1) {
      // pageToPlaylistDetail(3185023336);
      history.push({ pathname: "/moredetails" });
    } else if (index === 0) {
      const playList = [
        {
          artists: "Ellis/Laura Brehm",
          name: "Start Over",
          album: { name: "Start Over" },
          sid: 573027032,
        },
      ];
      const songIndex = 0;
      dispatch({ type: "play-list/data", value: playList });
      if (!showController && window.location.pathname !== "/play") {
        dispatch({ type: "global/show-controller", value: true });
      }
      dispatch(beforeCanPlayAction(songIndex));
    } else {
      Toast.offline('功能还未实现(；°○° )', 1);
    }
  };

  return (
    <div className="page-container">
      {loading && <Loading></Loading>}
      {!loading && (
        <Scroll
          mode="normal-scroll-y"
          config={{ bscroll: define.recommendPageConf }}
        >
          <div className="banner-container">
            {banners.length > 0 && (
              <Scroll
                mode="banner"
                config={{ bscroll: define.sliderConf }}
                width="100%"
              >
                {banners.map((banner: any, index: number) => {
                  return (
                    <img
                      style={{ width: "100%", height: 140 }}
                      src={`${banner.imageUrl}?param=375y140`}
                      key={`banner-${index}`}
                      alt=""
                    />
                  );
                })}
              </Scroll>
            )}
          </div>
          <div className="icon-wrapper">
            <Scroll
              mode="normal-scroll-x"
              config={{ bscroll: define.iconSliderConf }}
              height={70}
              width={50}
            >
              {icons.map((item, index) => {
                return (
                  <div
                    className="children-item"
                    key={`icon-${index}`}
                    onClick={() => testTouch(index)}
                  >
                    <img
                      style={{ height: 50, width: 50 }}
                      src={
                        process.env.PUBLIC_URL + "/image/" + item.name + ".png"
                      }
                      alt=""
                    />
                    <span>{item.name}</span>
                  </div>
                );
              })}
            </Scroll>
          </div>
          <div className="recommend-wrapper">
            <p className="recommend-wrapper--title">
              <span className="text">推荐歌单</span>
              <span
                onTouchStart={toMoreDetail}
                className="text"
                style={{ fontSize: "12px", lineHeight: "18px" }}
              >
                更多歌单
              </span>
            </p>
            {personalization.length > 0 && (
              <Scroll
                mode="normal-scroll-x"
                config={{ bscroll: define.personalizeConf }}
                height={175}
                width={140}
              >
                {personalization.map((item: any, index: number) => {
                  return (
                    <div
                      className="children-item"
                      key={`recommend-detail-${index}`}
                      onClick={() => pageToPlaylistDetail(item.id)}
                    >
                      <img
                        src={`${item.picUrl}?param=140y140`}
                        alt={item.name}
                      />
                      <span className="text">{item.name}</span>
                    </div>
                  );
                })}
              </Scroll>
            )}
          </div>
          <div className="new-song-list--wrapper">
            <p className="title">不可错过的精选</p>
            {newSongList.length > 0 && (
              <List
                data={newSongList}
                mode="NEW_SONG"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              ></List>
            )}
            <div style={{ width: "100%", height: 100 }}></div>
          </div>
        </Scroll>
      )}
    </div>
  );
};

export default Recommend;
