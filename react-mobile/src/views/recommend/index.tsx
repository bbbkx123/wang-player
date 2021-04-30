import { useState, useEffect, useRef } from "react"
import { withRouter } from "react-router-dom"
import Slider from "@/components/Slider"

import * as api from "@/service"
import * as define from "./define"

import "./index.less"

const Recommend = (props: any) => {
  const { history } = props
  const [bannerArr, setBannerArr] = useState([])
  const [icons, setIcons] = useState<any[]>(define.icons)
  const [recommendDetails, setRecommendDetails] = useState<any[]>([])
  const iconSliderConf = useRef<any>()
  const sliderConf = useRef<any>()
  const recommendConf = useRef<any>()

  const fun1 = () => {
    history.push("/playlistdetails")
  }
  sliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: false,
      slide: {
        loop: true,
        threshold: 0.1,
        speed: 400,
        listenFlick: true,
        autoplay: true,
        interval: 3000,
      },
    },
  }

  iconSliderConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
    sliderItemWidth: 75,
    sliderItemHeight: 75,
  }

  recommendConf.current = {
    bscroll: {
      scrollX: true,
      scrollY: false,
      momentum: true,
      click: true,
    },
    sliderItemWidth: 125,
    sliderItemHeight: 135,
  }

  const getBanner = () => {
    let type = 0
    api.getBanner(type).then((res) => {
      if (res.data.code === 200) {
        setBannerArr(res.data.banners)
      }
    })
  }

  const getPersonalized = () => {
    const limit = 6
    api.getPersonalized(limit).then((res) => {
      setRecommendDetails(res.data.result)
    })
  }


  useEffect(() => {
    getBanner()
    getPersonalized()
    return () => {
      sliderConf.current = null
      iconSliderConf.current = null
      recommendConf.current = null
    }
  }, [])

  return (
    <div>
      <div className="banner-container">
        <Slider mode="banner" config={sliderConf.current}>
          {bannerArr.map((banner: any, index: number) => {
            if (banner) {
              return <img src={`${banner.imageUrl}?param=375y140`} key={`banner-${index}`} />
            }
          })}
        </Slider>
        )
      </div>
      <div className="icon-wrapper">
        <Slider config={iconSliderConf.current}>
          {icons.map((item, index) => {
            return (
              <div className="children-item" key={index} onClick={fun1}>
                <img style={{ width: 50, height: 50 }} src={process.env.PUBLIC_URL + "/image/" + item.name + ".png"} alt="" />
                <span>{item.name}</span>
              </div>
            )
          })}
        </Slider>
      </div>
      <div className="recommend-wrapper">
        {recommendDetails.length > 0 && (
          <Slider config={recommendConf.current}>
            {recommendDetails.map((item: any, index: number) => {
              return (
                <div className="children-item" key={index} onClick={fun1}>
                  <img style={{ width: 100, height: 100 }} src={item.picUrl} alt={item.name} />
                  <span className="text">{item.name}</span>
                </div>
              )
            })}
          </Slider>
        )}
      </div>
    </div>
  )
}

export default withRouter(Recommend)
