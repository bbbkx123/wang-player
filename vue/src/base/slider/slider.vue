<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span :class="{active: currentPageIndex === index}" v-for="(dot, index) in dots" :key="`dot-${index}`"></span>
    </div>
  </div>
</template>

<script>
import BetterScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BetterScroll.use(Slide)
let BSInstance = null

export default {
  props: {
    loop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  methods: {
    initSlider () {
      BSInstance = new BetterScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        slide: {
          loop: this.loop,
          threshold: 0.3
        }
      })
    },
    setSliderWidth () {
      let SliderWidth = this.$refs.slider.clientWidth
      let children = this.$refs.sliderGroup.children
      let width = 0

      for (let i = 0, len = children.length; i < len - 1; i++) {
        let child = children[i]
        child.classList.add('slider-item')
        child.style.width = `${SliderWidth}px`
        width += SliderWidth
      }

      this.$refs.sliderGroup.style.width = `${width}px`
    }
  },
  mounted () {
    setTimeout(() => {
      this.setSliderWidth()
      this.initSlider()
    }, 20)
  },
  // activated () {
  //   BSInstance.enable()
  //   let pageIndex = BSInstance.getCurrentPage().pageX
  //   BSInstance.goToPage(pageIndex, 0, 0)
  //   this.currentPageIndex = pageIndex
  //   if (this.autoPlay) {
  //     this._play()
  //   }
  // },
}
</script>

<style lang="less">
@import '../../base/css/common.less';

.slider {
  overflow: hidden;
  width: @banner-width;
  .slider-group {
    // position: relative;
    white-space: nowrap;
    .slider-item {
      float: left;
      overflow: hidden;
      box-sizing: border-box;
      text-align: center;
    }
  }
}
</style>
