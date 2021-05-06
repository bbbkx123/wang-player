import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"

import BScroll from "@better-scroll/core"
import Slide from "@better-scroll/slide"
import "./index.less"

// normal-scroll-x 普通横向滑动
// banner banner模式

const Slider = (props: any) => {
  const { mode, config, children } = props
  const { EventEmitter } = props

  const instance = useRef<any>()
  const sliderRef = useRef<any>(null)
  const sliderGroupRef = useRef<any>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [dots, setDots] = useState<any[]>([])

  instance.current = { bscroll: null, excuting: false, mark: Math.random() }

  const initial = () => {
    if (children.length === 0) return
    if (instance.current.bscroll !== null) return
    if (mode === "banner") BScroll.use(Slide)
    instance.current.bscroll = new BScroll(sliderRef.current, config.bscroll)
    let hooks = instance.current.bscroll.scroller.actionsHandler.hooks
    if (mode === "banner") {
      instance.current.bscroll.on("slideWillChange", (page: any) => {
        setCurrentPageIndex(page.pageX)
      })
    }
    hooks.on("click", (event: any) => {
      EventEmitter.emit("hook-click", event)
    })
  }

  const setSliderWidth = () => {
    let elRefSlider = sliderRef.current
    let elRefSliderGroup = sliderGroupRef.current
    let children = elRefSliderGroup.children
    let sliderWidth = elRefSlider.clientWidth

    const marginLeft = 5
    if (mode === "banner") {
      setDots(Array.from({ length: 10 }).map((item) => true))
    }

    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      child.classList.add("slider-item")
      if (mode === "normal-scroll-x") {
        // 添加margin-left: 5px, 用于隔开
        child.classList.add("margin")
      }
    }
    if (mode === "banner") {
      elRefSliderGroup.style.width = `${sliderWidth * children.length}px`
    } else if (mode === "normal-scroll-x") {
      const childClientWidth = children[0].children[0].clientWidth
      elRefSliderGroup.style.width = `${(childClientWidth + marginLeft) * children.length}px`
    }
  }

  useEffect(() => {
    console.log()
    // 存在children 为false的情况， 避免children不存在又创建BScroll实例
    if (instance.current.bscroll === null && !instance.current.excuting && children.length > 0) {
      setSliderWidth()
      instance.current.excuting = true
      initial()
    }
    return () => {
      console.log("destory")
    }
  }, [children])

  useEffect(() => {
    return () => {
      sliderRef.current = null
      sliderGroupRef.current = null
    }
  }, [])

  return (
    <div className="slider">
      <div className="slider-wrapper" ref={sliderRef}>
        <div className="slider-group" ref={sliderGroupRef}>
          {children}
        </div>
      </div>
      {mode === "banner" && dots.length > 0 && (
        <div className="dots">
          {dots.map((dot, index) => {
            let className = currentPageIndex === index ? "active" : ""
            className += " dots-item"
            return <div key={index} className={className}></div>
          })}
        </div>
      )}
    </div>
  )
}

const stateToProps = (state: any) => ({
  EventEmitter: state.global.EventEmitter,
})

const dispatchToProps = (dispatch: any) => ({})

export default connect(stateToProps, dispatchToProps)(Slider)
