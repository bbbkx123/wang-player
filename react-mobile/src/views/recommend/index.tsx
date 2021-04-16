import {useState} from 'react'
import {withRouter} from 'react-router-dom'
import Slider from "@/components/Slider"

import * as api from "@/service"

const Recommend = (props: any) => {
  const {history} = props
  const [bannerArr, setBannerArr] = useState([])
  const fun1 = () => {
    history.push("/playlistdetails")
  }

  const getBanner = () => {
    let type = 0
    api.getBanner(type).then((res) => {
      if (res.data.code === 200) {
        setBannerArr(res.data.banners)
      }
    })
  }

  return (
    <div>
      <button onClick={fun1}>click</button>
      <div>
        {/* <Slider>
           {
             bannerArr.map((banner, bIndex) => {
               if (banner) {
                 return <img :src="`${banner.imageUrl}?param=540y${bannerActions[bIndex].current ? 200 : 190}`" alt=""></Slider>
               }
             })
           }
        </Slider> */}
      </div>
    </div>
  )
}

export default withRouter(Recommend)