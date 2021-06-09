import { useSelector, useDispatch } from "react-redux"
import { CSSTransition } from "react-transition-group"

import List from "@/components/List"
import Scroll from "@/components/Scroll"

import "./index.less"

const miniListConf = {
  scrollY: true,
  scrollX: false,
  // 锁定方向
  directionLockThreshold: 0,
  freeScroll: false,
}

const MiniList = (props: any) => {
  const dispatch = useDispatch()
  const playList = useSelector((state: any) => state.playlist.data)
  const showMiniList = useSelector((state: any) => state.global.showMiniList)

  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  const onClick = () => {
    dispatch({ type: "global/show-mini-list", value: false })
  }

  return (
    <>
      {showMiniList && <div className="mini-list--mark" onClick={onClick}></div>}
      <CSSTransition in={showMiniList} timeout={500} classNames="transition">
        <div className="mini-list--container">
          <div className="mini-list--title">当前播放</div>
          {playList.length > 0 && (
            <Scroll mode="normal-scroll-y" config={miniListConf}>
              <List mode="MINI_LIST" data={playList} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
            </Scroll>
          )}
        </div>
      </CSSTransition>
    </>
  )
}

export default MiniList
