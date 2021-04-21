import { useState, useRef, useEffect } from "react";

import BetterScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

import "./index.less"

BetterScroll.use(Slide);

const Slider = (props: any) => {
  let BSInstance: any = null;
  const {children} = props

  const sliderRef = useRef<any>(null);
  const sliderGroupRef = useRef<any>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [dots, setDots] = useState<number[]>([]);

  const initSlider = () => {
    if (BSInstance !== null) return
    BSInstance = new BetterScroll(sliderRef.current, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      slide: {
        // loop: this.loop,
        threshold: 0.3,
      },
    });
    BSInstance.on('slideWillChange', (page: any) => {
      setCurrentPageIndex(page.pageX)
    })
  };

  const setSliderWidth = () => {
    let SliderWidth = sliderRef.current.clientWidth;
    let children = sliderGroupRef.current.children;
    let width = 0;
    let _dots = []

    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i];
      child.classList.add("slider-item");
      child.style.width = `${SliderWidth}px`;
      width += SliderWidth;
      _dots.push(0)
    }
    setDots(_dots.splice(0, _dots.length - 2))

    sliderGroupRef.current.style.width = `${width}px`;
  };

  useEffect(() => {
    // 存在children 为false的情况， 避免children不存在又创建BScroll实例
    if (BSInstance === null && Array.isArray(children)) {
      initSlider()
      setSliderWidth()
    }
  }, [children])

  useEffect(() => {
    return () => {
      
    }
  }, [])

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slider-group" ref={sliderGroupRef}>
        {children}
      </div>
      <div className="dots">
        <div className="dots-container">
          {
            dots.map((dot, index) => {
              return (
                <span
                  className={`${currentPageIndex === index ? "active" : ""} dot`}
                  key={`dot-${index}`}
                ></span>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Slider;
