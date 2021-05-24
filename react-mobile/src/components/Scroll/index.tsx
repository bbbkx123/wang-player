import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import BScroll from "@better-scroll/core"
import PullDown from "@better-scroll/pull-down"
import PullUp from "@better-scroll/pull-up"
import Slide from '@better-scroll/slide'
import './index.less'

// normal-scroll-y 普通纵向滑动
// normal-scroll-x 普通横向滑动
// banner banner模式

const Slider = (props: any) => {
  const { mode, config, children, height, width, pullDown, pullUp, click} = props
  // const { EventEmitter } = props

  const instance = useRef<any>()
  const sliderRef = useRef<any>(null)
  const sliderGroupRef = useRef<any>(null)
  const sliderWrapperElemRef = useRef<any>()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [dots, setDots] = useState<any[]>([])

  const initial = () => {
    if (children.length === 0) return
    if (mode === 'banner') BScroll.use(Slide)
    if (mode === "list-detail") {
      const use: any = BScroll.use
      use(PullDown)
      use(PullUp)
    }
    instance.current = { ...instance.current, bscroll: new BScroll(sliderRef.current, config.bscroll) }
    let hooks = instance.current.bscroll.scroller.actionsHandler.hooks
    hooks.on('click', (event: any) => {
      // EventEmitter.emit('hook-click', event)
      click && click()
    })
    if (mode === 'banner') {
      instance.current.bscroll.on('slideWillChange', (page: any) => {
        setCurrentPageIndex(page.pageX)
      })
    }
    
    // 问题: 没有进行事件解绑
    if (mode === "list-detail" && pullDown && pullUp) {
      instance.current.bscroll.on('pullingDown', () => {
        pullDown(instance.current.bscroll)
      })
      instance.current.bscroll.on('pullingUp', () => {
        pullUp(instance.current.bscroll)
      })
    }
  }

  const setSliderWidth = () => {
    let elRefSlider = sliderRef.current
    let elRefSliderGroup = sliderGroupRef.current
    let children = elRefSliderGroup.children
    let sliderWidth = elRefSlider.clientWidth

    const marginLeft = 10
    if (mode === 'banner') {
      setDots(Array.from({ length: 10 }).map(item => true))
    }
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      child.classList.add('slider-item')
      if (mode === 'normal-scroll-x') {
        // 添加margin-left: 5px, 用于隔开
        child.classList.add('margin')
        child.style.width = typeof width === "number" ? `${width}px` : width
      }
    }
    if (mode === 'banner') {
      elRefSliderGroup.style.width = `${sliderWidth * children.length}px`
    } else if (mode === 'normal-scroll-x') {
      const childClientWidth = children[0].children[0].clientWidth
      elRefSliderGroup.style.width = `${(childClientWidth + marginLeft) * children.length}px`
    }
  }

  const setSliderHeight = () => {
    sliderRef.current.style.height = sliderWrapperElemRef.current.clientHeight + 'px'
  }

  useEffect(() => {
    // 存在children 为false的情况， 避免children不存在又创建BScroll实例
    if (instance.current === undefined) {
      if (Array.isArray(children) && children.length > 0) {
        if (mode === 'banner' || mode === 'normal-scroll-x') setSliderWidth()
      } else if (children && !Array.isArray(children)) {
        if (mode === 'normal-scroll-y') {
          setSliderHeight()
        }
      }
      instance.current = { excuting: true }
      initial()
      return () => {
        console.log("children clean?");
        
      }
    }
  }, [children])

  useEffect(() => {
    return () => {
      sliderRef.current = null
      sliderGroupRef.current = null
      sliderWrapperElemRef.current = null
    }
  }, [])

  return (
    <div className="slider-wrapper" ref={sliderWrapperElemRef} style={{height : (typeof height === "number" ? `${height}px`: height) || undefined}}>
      <div className="slider" ref={sliderRef}>
        <div className="slider-group" ref={sliderGroupRef}>
          {children}
        </div>
      </div>
      {mode === 'banner' && dots.length > 0 && (
        <div className="dots">
          {dots.map((dot, index) => {
            let className = currentPageIndex === index ? 'active' : ''
            className += ' dots-item'
            return <div key={index} className={className}></div>
          })}
        </div>
      )}
    </div>
  )
}

const stateToProps = (state: any) => ({
  // EventEmitter: state.global.EventEmitter,
})

const dispatchToProps = (dispatch: any) => ({})

export default connect(stateToProps, dispatchToProps)(Slider)
