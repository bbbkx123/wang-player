import { useRef, } from "react"
import { connect } from "react-redux"
import { CSSTransition } from "react-transition-group"

import List from "@/components/List"
import Scroll from "@/components/Scroll"


import "./index.less"

const MiniList = (props: any) => {
  const { playList, showMiniList } = props
  const { dispatchForShowMiniList } = props
  const miniListConf = useRef<any>({
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  })

  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  const onClick = () => {
    dispatchForShowMiniList(false)
  }
  
  return (
    <>
      {showMiniList && <div className="mini-list--mark" onClick={onClick}></div>}
      <CSSTransition in={showMiniList} timeout={500} classNames="transition">
        <div className="mini-list--container">
          <div className="mini-list--title">当前播放</div>
          {playList.length > 0 && (
            <Scroll mode="normal-scroll-y" config={miniListConf.current}>
              <List mode="MINI_LIST" data={playList} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
            </Scroll>
          )}
        </div>
      </CSSTransition>
    </>
  )
}

const stateToProps = (state: any) => ({
  playList: state.playlist.data,
  showMiniList: state.global.showMiniList,
})

const dispatchToProps = (dispatch: any) => ({
  dispatchForShowMiniList(status: boolean) {
    dispatch({ type: "global/show-mini-list", value: status })
  },
})

export default connect(stateToProps, dispatchToProps)(MiniList)
