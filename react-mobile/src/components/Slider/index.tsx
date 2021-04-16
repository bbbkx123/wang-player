import { useState, useRef, useEffect } from "react";

import BetterScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BetterScroll.use(Slide);

const Slider = (props: any) => {
  let BSInstance = null;
  const {children} = props

  const sliderRef = useRef<any>(null);
  const sliderGroupRef = useRef<any>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [dots, setDots] = useState([]);

  const initSlider = () => {
    BSInstance = new BetterScroll(sliderRef.current, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      slide: {
        // loop: this.loop,
        threshold: 0.3,
      },
    });
  };

  const setSliderWidth = () => {
    let SliderWidth = sliderRef.current.clientWidth;
    let children = sliderGroupRef.current.children;
    let width = 0;

    for (let i = 0, len = children.length; i < len - 1; i++) {
      let child = children[i];
      child.classList.add("slider-item");
      child.style.width = `${SliderWidth}px`;
      width += SliderWidth;
    }

    sliderGroupRef.current.style.width = `${width}px`;
  };

  useEffect(() => {
    setSliderWidth()
    initSlider()
  }, [])

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slider-group" ref={sliderGroupRef}>
        {children}
      </div>
      <div className="dots">
        {dots.map((dot, index) => {
          return (
            <span
              className={`${currentPageIndex === index ? "active" : ""}`}
            ></span>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
