import {useContext, useRef} from 'react'

import {AppContext} from '@/store'

// 进度条按钮宽度
const progressBarWidth = 16
// mousedown到mopuseup间隔时间, 用于区分click和mouseup, 超过150ms为mouse事件, 否则为click事件
const refelctTime = 0.1

const ProgressBar = (props: any) => {
  const progressBar = useRef<any>(null), progress = useRef<any>(null), progressBtn = useRef<any>(null)
  const {startTime, dispatch, $emit} = useContext<any>(AppContext)

  const progressClick = (e: any) => {
    // 解决mouseup和click重发触发的问题
    let diff = (new Date().getTime() - startTime) / 1000
    if (diff > refelctTime) return
    // .getBoundingClientRect()
    const rect = progressBar.current.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    handleOffset(offsetWidth)
      .then(() => {
        $emit('progress-change', getPrecent())
      })
  }

  const handleOffset = (offsetWidth: any) => {
    return new Promise((resolve, reject) => {
      try {
        progress.current.style.width = `${offsetWidth}px`
        progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      } catch (err) {
        reject(err)
      }
      // 保证获取更新后的dom
      this.$nextTick(() => resolve())
    })
  }

  const progressMouseStart= (e) => {
    this.touch.initiated = true
    this.touch.startX = e.pageX
    this.progressClientWidth = this.$refs.progress.clientWidth
    dispatch({type: 'startTime', value: new Date().getTime()})
  },

  const _progressMouseMove = (e) => {
    common.throttle(this.progressMouseMove, 200, 0)(e)
  }

  const progressMouseEnd = () => {
    // 出现问题: 从$refs获取样式数据会取到更新之前的数据
    // 在move事件上启用节流后, 可以避免使用定时器
    // 先抛出事件, 再将initiated修改为false
    this.$emit('progress-change', this.getPrecent())
    this.touch.initiated = false
  }

  const getPrecent = () => {
    return this.$refs.progress.clientWidth / this.barWidth
  }


  return (
    <div className="progress-bar-container" ref={progressBar} onClick={progressClick}>
    <div className="progress-bar"
      onMouseDown={progressMouseStart}
      onMouseMove={_progressMouseMove}
      onMouseUp={progressMouseEnd}>
      <div className="progress-background"></div>
      {/* 进度条 */}
      <div className="progress" ref={progress}></div>
      {/* 当前进度按钮 */}
      <div className="progress-btn-wrapper" ref={progressBtn}>
          <div className="progress-btn"></div>
      </div>
    </div>
  </div> 
  )
}

export default ProgressBar