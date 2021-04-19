import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Slider from "@/components/Slider";

import * as api from "@/service";

const Recommend = (props: any) => {
  const { history } = props;
  const [bannerArr, setBannerArr] = useState([]);
  const [bannerActions, setBannerActions] = useState<any[]>([]);
  const [currentIndexOfBanner, setCurrentIndexOfBanner] = useState<number>(0);
  const fun1 = () => {
    history.push("/playlistdetails");
  };

  const getBanner = () => {
    let type = 0;
    api.getBanner(type).then((res) => {
      if (res.data.code === 200) {
        setBannerArr(res.data.banners);
      }
    });
  };

  const handleBannerInit = (bannerArr: any[]) => {
    return bannerArr.map(() => {
      return { prev: false, current: false, next: false };
    });
  };

  const handleBannerAutoScroll = () => {
    // if (!this.timer) {
    //   // console.log(this.timer)
    //   this.timer = setInterval(() => {
    //     this.handleBannerScrollForNextBtn()
    //     // console.log('auto')
    //   }, 5000)
    // }
  };

  const handleBannerActive = (index: number) => {
    const _bannerActions = handleBannerInit(bannerArr);
    if (!_bannerActions) return console.log("bannerActions is null");
    if (index === 0) {
      _bannerActions[_bannerActions.length - 1].prev = true;
      _bannerActions[0].current = true;
      _bannerActions[1].next = true;
    } else if (index === _bannerActions.length - 1) {
      _bannerActions[_bannerActions.length - 2].prev = true;
      _bannerActions[_bannerActions.length - 1].current = true;
      _bannerActions[0].next = true;
    } else {
      _bannerActions[index - 1].prev = true;
      _bannerActions[index].current = true;
      _bannerActions[index + 1].next = true;
    }
    setBannerActions(_bannerActions);
  };

  useEffect(() => {
    getBanner();
  }, []);

  useEffect(() => {
    // ??? 长度小于3 需要处理
    if (bannerArr.length > 2) {
      setCurrentIndexOfBanner(0);
      handleBannerActive(currentIndexOfBanner);
      handleBannerAutoScroll();
    }
  }, [bannerArr]);

  return (
    <div>
      <button onClick={fun1}>click</button>
      <div className="banner-container">
        <Slider>
          {bannerActions.length > 0 &&
            bannerArr.map((banner: any, index: number) => {
              if (banner) {
                return (
                  <img
                    src={`${banner.imageUrl}?param=375y140`}
                    key={`banner-${index}`}
                  />
                );
              }
            })}
        </Slider>
      </div>
    </div>
  );
};

export default withRouter(Recommend);
