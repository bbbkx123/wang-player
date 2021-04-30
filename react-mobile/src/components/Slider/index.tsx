import { useState, useEffect, useRef, useContext } from "react"
import {connect} from "react-redux"

import BScroll from "@better-scroll/core"
import Slide from "@better-scroll/slide"
import "./index.less"

const Slider = (props: any) => {
  const { mode, config,children} = props
  const {EventEmitter} = props

  const instance = useRef<any>()
  const sliderRef = useRef<any>(null)
  const sliderGroupRef = useRef<any>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [dots, setDots] = useState<any[]>([])
  
  
  instance.current = {bscroll: null, excuting: false, mark: Math.random()}

  const initial = () => {
    if (mode === "banner") {
      BScroll.use(Slide)
    }
    if (instance.current.bscroll !== null) return
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
    let width = 0
    let children = elRefSliderGroup.children
    let sliderWidth = elRefSlider.clientWidth
    let _width = typeof config.sliderItemWidth === "number" ? config.sliderItemWidth : sliderWidth
    let _height = config.sliderItemHeight
    let needSetHeight = typeof _height === "number" && _height > 0
    if (mode === "banner") setDots([...elRefSliderGroup.children].map(() => true))
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      child.classList.add("slider-item")
      child.style.width = `${_width}px`
      if (needSetHeight) child.style.height = `${_height}px`
      width += _width
    }
    elRefSliderGroup.style.width = `${width}px`
  }

  useEffect(() => {
    console.log();
    debugger
    // 存在children 为false的情况， 避免children不存在又创建BScroll实例
    if (instance.current.bscroll === null && !instance.current.excuting && children.length > 0) {
      setSliderWidth()
      instance.current.excuting = true
      initial()
    }
    return () => {
      console.log("destory");
      
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
  EventEmitter: state.EventEmitter,
})

const dispatchToProps = (dispatch: any) => ({

})

export default connect(stateToProps, dispatchToProps)(Slider)