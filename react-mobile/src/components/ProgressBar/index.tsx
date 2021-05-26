import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import {  changeProgressAction } from "@/store/playpage/action"

import "./index.less"

// 进度条按钮宽度
const progressBarWidth = 16
// mousedown到mopuseup间隔时间, 用于区分click和mouseup, 超过150ms为mouse事件, 否则为click事件
const refelctTime = 0.1

// ! 问题: 全面屏手势滑动会进行翻页, 导致touchmove不能正确调用
// 测试发现小米手机浏览器存在原生滑动事件, 导致问题, 在微信中可正常使用

const ProgressBar = (props: any) => {
  const { percent } = props
  const { dispatchForIsProgressChanging, progressChanging, progressChange } = props
  const progressBar = useRef<any>(null),
    progress = useRef<any>(null),
    progressBtn = useRef<any>(null)
  const [touch, setTouch] = useState({
    initiated: false,
    startX: 0,
  })
  const [progressClientWidth, setProgressClientWidth] = useState<number>(0)
  const [barWidth, setBarWidth] = useState<number>(0)

  const progressClick = (e: any) => {
    // 解决mouseup和click重发触发的问题
    const rect = progressBar.current.getBoundingClientRect()
    const offsetWidth = e.clientX - rect.left
    const percent = offsetWidth / barWidth
    progressChange( percent.toFixed(2))
  }

  const handleOffset = (offsetWidth: any) => {
    progress.current.style.width = `${offsetWidth}px`
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  const progressTouchStart = (e: any) => {
    dispatchForIsProgressChanging(true)
    setTouch({
      initiated: true,
      startX: e.touches[0].clientX,
    })
    setProgressClientWidth(progress.current.clientWidth)
  }

  const progressTouchMove = (e: any) => {
    //   Math.max(0, this.progressClientWidth + deltaX) -->  0  移动超出左边界
    //   Math.max(0, this.progressClientWidth + deltaX) -->  delta  正常移动
    //
    //   barWidth 实际进度条宽度
    //   b = Math.max(0, this.progressClientWidth + deltaX)
    //   Math.min(a, b)  -->  a 超出右边界
    //   Math.min(a, b)  -->  b 正常移动

    if (!touch.initiated) return
    const deltaX = e.touches[0].clientX - touch.startX
    const offsetWidth = Math.min(barWidth === null ? 0 : barWidth, Math.max(0, progressClientWidth + deltaX))
    handleOffset(offsetWidth)
    progressChanging(getPrecent())
  }

  const progressTouchEnd = () => {
    // *问题: 从$refs获取样式数据会取到更新之前的数据
    // 在move事件上启用节流后, 可以避免使用定时器
    // 先抛出事件, 再将initiated修改为false
    // dispatchForIsProgressChanging(false)
    progressChange(getPrecent())
    setTouch({
      ...touch,
      initiated: false,
    })
  }

  const getPrecent = () => {
    let num = progress.current.clientWidth / (barWidth === null ? 0 : barWidth)
    return num.toFixed(4)
  }

  useEffect(() => {
    // !问题: 能否移除setTimeout
    setTimeout(() => {
      if (progressBar.current) {
        setBarWidth(progressBar.current.clientWidth - progressBarWidth)
      }
    }, 0)
    return () => {
      progressBar.current = null
      progress.current = null
      progressBtn.current = null
    }
  }, [])

  useEffect(() => {
    // timeupdate事件触发
    if (percent > 0 && !touch.initiated && barWidth !== null) {
      const offsetWidth = percent * barWidth
      handleOffset(offsetWidth)
    }
  }, [percent])

  return (
    <div className="progress-bar__container" ref={progressBar} onClick={progressClick}>
      <div className="progress-bar" onTouchStart={progressTouchStart} onTouchMove={progressTouchMove} onTouchEnd={progressTouchEnd}>
        <div className="progress-bar__background"></div>
        {/* 进度条 */}
        <div className="progress-bar--progress" ref={progress}></div>
        {/* 当前进度按钮 */}
        <div className="progress-bar--btn__wrapper" ref={progressBtn}>
          <div className="progress-bar--btn"></div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state: any) => ({})

const dispatchToProps = (dispatch: any) => ({
  dispatchForIsProgressChanging(status: boolean) {
    dispatch({ type: "play-page/is-progress-changing", value: status })
  },
  progressChanging (percent: any) {
    dispatch({type: "play-page/percent", value: percent})
  },
  progressChange (percent: any) {
    dispatch(changeProgressAction(percent))
  },
})

export default connect(stateToProps, dispatchToProps)(ProgressBar)
