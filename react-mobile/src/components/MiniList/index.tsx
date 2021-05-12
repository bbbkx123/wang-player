import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { CSSTransition } from "react-transition-group"

import List from "@/components/List"
import Slider from "@/components/Slider"

import { fetchPlayListAction } from "@/store/actionCreator"

import "./index.less"

const MiniList = (props: any) => {
  const { listDetail, show } = props
  const { getSongs } = props
  const [data, setData] = useState<any[]>([])
  const miniListConf = useRef<any>({
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  })

  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  useEffect(() => {
    if (listDetail && listDetail.listData.length > 0) {
      getSongs(listDetail.listData).then((res: any) => {
      console.log(JSON.stringify(res))
      setData(res)
    })
    }
    return () => {}
  }, [listDetail])

  return (
    <>
      <CSSTransition in={show} timeout={500} classNames="mini-list">
        <div className="mini-list--container">
          {data.length > 0 && (
            <Slider mode="normal-scroll-y" config={miniListConf.current}>
              <List mode="MINI_LIST" data={data} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
            </Slider>
          )}
        </div>
      </CSSTransition>
    </>
  )
}

const stateToProps = (state: any) => ({
  listDetail: state.global.listDetail,
})

const dispatchToProps = (dispatch: any) => ({
  async getSongs(songIds: any[]) {
    let songs = await dispatch(fetchPlayListAction(songIds))
    return Promise.resolve(songs)
  },
})

export default connect(stateToProps, dispatchToProps)(MiniList)
