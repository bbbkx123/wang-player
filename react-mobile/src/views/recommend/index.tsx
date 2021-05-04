import { useState, useEffect, useRef } from "react"
import { withRouter } from "react-router-dom"
import { formatForNewSongList } from "@/utils/tools"
import Slider from "@/components/Slider"
import List from "@/components/List"

import * as api from "@/service"
import * as define from "./define"

import "./index.less"
import BScroll from "@better-scroll/core"

const Recommend = (props: any) => {
  const { history } = props
  const [bannerArr, setBannerArr] = useState([])
  const [icons, setIcons] = useState<any[]>(define.icons)
  const [recommendDetails, setRecommendDetails] = useState<any[]>([])
  const [newSongList, setNewSongList] = useState<any[]>([])
  const iconSliderConf = useRef<any>()
  const sliderConf = useRef<any>()
  const recommendConf = useRef<any>()
  const recommendInstanceRef = useRef<any>()
  const recommendElemRef = useRef<any>()


  const fun1 = () => {
    history.push("/playlistdetails")
  }
  sliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false,
      probeType: 3,
    },
  }

  iconSliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
  }

  recommendConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
  }

  const BScrollInit = () => {
    recommendInstanceRef.current = new BScroll(recommendElemRef.current, {
      scrollY: true,
      scrollX: false,
      // 锁定方向
      directionLockThreshold: 0,
      freeScroll: false,
    })
  }

  // const getBanner = () => {
  //   let type = 0
  //   api.getBanner(type).then((res) => {
  //     if (res.data.code === 200) {
        
  //     }
  //   })
  // }

  // const getPersonalized = () => {
  //   const limit = 6
  //   api.getPersonalized(limit).then((res) => {
      
  //   })
  // }

  // const getNewSong = () => {
  //   const limit = 6
  //   api.getNewSong(limit).then((res) => {
      
  //   })
  // }

  useEffect(() => {
    Promise.all([api.getBanner(0), api.getPersonalized(6), api.getNewSong(6)]).then(([res1, res2, res3]) => {
      setBannerArr(res1.data.banners)
      setRecommendDetails(res2.data.result)
      const data = res3.data.result.map((item: any) =>
        formatForNewSongList(item)
      )
      setNewSongList(data)
      return Promise.resolve()
    }).then(() => {
      !recommendInstanceRef.current && BScrollInit()
    })
    return () => {
      sliderConf.current = null
      iconSliderConf.current = null
      recommendConf.current = null
    }
  }, [])


  // useEffect(() => {
  //   // debugger
  //   // if (bannerArr.length > 0 && icons.length > 0 && recommendDetails.length > 0 && ) {
  //   //   BScrollInit()
  //   // }
  // }, [bannerArr, recommendDetails, newSongList])

  return (
    <div className="recommend" ref={recommendElemRef}>
      <div>
        {/* banner滑动存在问题 */}
        <div className="banner-container">
          <Slider mode="banner" config={sliderConf.current}>
            {bannerArr.length > 0 &&
              bannerArr.map((banner: any, index: number) => {
                return (
                  <img
                    style={{ height: 130, width: "100%" }}
                    src={`${banner.imageUrl}?param=375y140`}
                    key={`banner-${index}`}
                  />
                )
              })}
          </Slider>
        </div>
        <div className="icon-wrapper">
          <Slider config={iconSliderConf.current} mode="normal-scroll-x">
            {icons.map((item, index) => {
              return (
                <div
                  className="children-item"
                  style={{ width: 50, height: 50 }}
                  key={`icon-${index}`}
                  onClick={fun1}
                >
                  <img
                    src={
                      process.env.PUBLIC_URL + "/image/" + item.name + ".png"
                    }
                    alt=""
                  />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </Slider>
        </div>
        <div className="recommend-wrapper">
          <p className="recommend-wrapper--title">推荐歌单</p>
          {recommendDetails.length > 0 && (
            <Slider config={recommendConf.current} mode="normal-scroll-x">
              {recommendDetails.map((item: any, index: number) => {
                return (
                  <div
                    className="children-item"
                    style={{ width: 140, height: 160 }}
                    key={`recommend-detail-${index}`}
                    onClick={fun1}
                  >
                    <img src={item.picUrl} alt={item.name} />
                    <span className="text">{item.name}</span>
                  </div>
                )
              })}
            </Slider>
          )}
        </div>
        <div>
          <p>不可错过的精选</p>
          {newSongList.length > 0 && (
            <List data={newSongList} mode="NEW_SONG"></List>
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(Recommend)
