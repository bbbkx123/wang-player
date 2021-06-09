import { useEffect, useRef, useState } from "react"
import { useDispatch, useStore } from "react-redux"

import "./index.less"

// 进度条按钮宽度
const progressBarWidth = 16

// 问题: 全面屏手势滑动会进行翻页, 导致touchmove不能正确调用
// 测试发现小米手机浏览器存在原生滑动事件, 导致问题, 在微信中可正常使用

const ProgressBar = (props: any) => {
  const { percent } = props
  const dispatch = useDispatch()
  const store = useStore()
  const state = store.getState()
  const progressBar = useRef<any>(null)
  const progress = useRef<any>(null)
  const progressBtn = useRef<any>(null)
  const [touch, setTouch] = useState({
    initiated: false,
    startX: 0,
  })
  const [progressClientWidth, setProgressClientWidth] = useState<number>(0)
  const [barWidth, setBarWidth] = useState<number>(0)

  const changeProgress = (percent: number) => {
    dispatch({ type: "play-page/percent", value: percent })
    state.audio.instance.currentTime = state.audio.instance.duration * percent
  }

  const progressClick = (e: any) => {
    const rect = progressBar.current.getBoundingClientRect()
    const offsetWidth = e.clientX - rect.left
    const percent = offsetWidth / barWidth
    changeProgress(Math.floor(percent * 100) / 100)
  }

  const handleOffset = (offsetWidth: any) => {
    progress.current.style.width = `${offsetWidth}px`
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  const progressTouchStart = (e: any) => {
    dispatch({ type: "play-page/is-progress-changing", value: true })
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
    dispatch({ type: "play-page/percent", value: getPrecent() })
  }

  const progressTouchEnd = () => {
    // *问题: 从$refs获取样式数据会取到更新之前的数据
    // 在move事件上启用节流后, 可以避免使用定时器
    // 先抛出事件, 再将initiated修改为false
    dispatch({ type: "play-page/is-progress-changing", value: false })
    changeProgress(getPrecent())
    setTouch({
      ...touch,
      initiated: false,
    })
  }

  const getPrecent = () => {
    let num = progress.current.clientWidth / (barWidth === null ? 0 : barWidth)
    return Math.floor(num * 10000) / 10000
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
  }, [percent]) // eslint-disable-line react-hooks/exhaustive-deps

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

export default ProgressBar
