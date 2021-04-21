import { useState, useEffect, useRef, useContext } from "react"
// import { getSlot } from "@/utils/tools"
import { StoreContext } from "@/store"
import BScroll from "@better-scroll/core"
import Slide from "@better-scroll/slide"
import "./index.less"

const Slider = (props: any) => {
  const { mode, sliderConf, children } = props
  const { EventEmitter, dispacth } = useContext<any>(StoreContext)
  let SliderInstance: any = null

  const sliderRef = useRef<any>(null)
  const sliderGroupRef = useRef<any>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [dots, setDots] = useState<any[]>([])

  const initial = () => {
    if (mode === "Slide") {
      BScroll.use(Slide)
    }
    if (SliderInstance !== null) return
    SliderInstance = new BScroll(sliderRef.current, sliderConf)
    let hooks = SliderInstance.scroller.actionsHandler.hooks
    if (props.mode === "Slide") {
      SliderInstance.on("slideWillChange", (page: any) => {
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
    let _width = typeof props.sliderItemWidth === "number" ? props.sliderItemWidth : sliderWidth
    let _height = props.sliderItemHeight
    let needSetHeight = typeof _height === "number" && _height > 0
    setDots([...elRefSliderGroup.children].map(() => true))

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
    // 存在children 为false的情况， 避免children不存在又创建BScroll实例
    if (SliderInstance === null && Array.isArray(children)) {
      initial()
      setSliderWidth()
    }
  }, [children])

  return (
    <div className="slider">
      <div className="slider-wrapper" ref={sliderRef}>
        <div className="slider-group" ref={sliderGroupRef}>
          {/* {getSlot(slots)} */}
          {children}
        </div>
      </div>
      {mode === "Slide" && dots.length > 0 && (
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

export default Slider