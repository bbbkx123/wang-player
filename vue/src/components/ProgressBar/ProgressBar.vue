<template>
  <div class="progress-bar-container" ref="progressBar" @click="progressClick">
    <div class="progress-bar"
      @mousedown.prevent="progressMouseStart"
      @mousemove.prevent="_progressMouseMove"
      @mouseup.stop="progressMouseEnd">
      <div class="progress-background"></div>
      <!-- 进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 当前进度按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn">
          <div class="progress-btn"></div>
      </div>
    </div>
  </div> 
</template>

<script>
import * as common from '../../base/util/common'
// 进度条按钮宽度
const progressBarWidth = 16
// mousedown到mopuseup间隔时间, 用于区分click和mouseup, 超过150ms为mouse事件, 否则为click事件
const refelctTime = 0.1

export default {
  props: {
    precent: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      touch: {
        initiated: false,
        startX: 0
      },
      barWidth: null
    }
  },
  watch: {
    precent (newValue) {
      // timeupdate事件触发
      if (newValue > 0 && !this.touch.initiated && this.barWidth) {
        const offsetWidth = newValue * this.barWidth
        this.handleOffset(offsetWidth)
      }
    }
  },
  methods: {
    progressMouseStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.pageX
      this.progressClientWidth = this.$refs.progress.clientWidth
      window.startTime = new Date().getTime()
    },
    // touchmove 和 mousemove 不一致
    progressMouseMove (e) {
      // ?   Math.max(0, this.progressClientWidth + deltaX) -->  0  移动超出左边界
      // ?   Math.max(0, this.progressClientWidth + deltaX) -->  delta  正常移动
      // ?
      // ?   this.barWidth 实际进度条宽度
      // ?   b = Math.max(0, this.progressClientWidth + deltaX)
      // ?   Math.min(a, b)  -->  a 超出右边界
      // ?   Math.min(a, b)  -->  b 正常移动
      if (!this.touch.initiated) return 
      const deltaX = e.pageX - this.touch.startX
      const offsetWidth = Math.min(this.barWidth, Math.max(0, this.progressClientWidth + deltaX))
      this.handleOffset(offsetWidth)
        .then(() => {
          this.$emit('progress-changing', this.getPrecent())
        })
    },
    // 节流目标函数
    _progressMouseMove (e) {
      common.throttle(this.progressMouseMove, 200, 0)(e)
    },
    progressMouseEnd () {
      // 出现问题: 从$refs获取样式数据会取到更新之前的数据
      // 在move事件上启用节流后, 可以避免使用定时器
      // 先抛出事件, 再将initiated修改为false
      this.$emit('progress-change', this.getPrecent())
      this.touch.initiated = false
    },
    progressClick (e) {
      // 解决mouseup和click重发触发的问题
      let diff = (new Date().getTime() - window.startTime) / 1000
      if (diff > refelctTime) return
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this.handleOffset(offsetWidth)
        .then(() => {
          this.$emit('progress-change', this.getPrecent())
        })
    },
    handleOffset (offsetWidth) {
      return new Promise((resolve, reject) => {
        try {
          this.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        } catch (err) {
          reject(err)
        }
        // 保证获取更新后的dom
        this.$nextTick(() => resolve())
      })
    },
    getPrecent (clientWidth) {
      return this.$refs.progress.clientWidth / this.barWidth
      // return new Promise((resolve, reject) => {
      //   let barWidth = this.$refs.progressBar.clientWidth - progressBarWidth
      //   resolve(this.$refs.progress.clientWidth / barWidth)
      //   // this.$nextTick(() => {
      //     // let width = this.$refs.progress.clientWidth
      //     // width = parseFloat(width.substring(0, width.length - 2))
      //     // resolve(width / barWidth)
      //   //})
      // })
    }
  },
  created () {},
  mounted () {
    this.barWidth = this.$refs.progressBar.clientWidth - progressBarWidth
  }
}
</script>

<style lang="less">
  .progress-bar-container {
    display: block;
    width: 100%;// 14px是block-current直径
    height: 50px;
    .progress-bar {
      position: relative;
      width: calc(~"100% - 16px");
      height: 100%;
      .progress-background, .progress {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 5px;
        // background-color: rgba(255, 255, 255, 0.2);
      }
      .progress-background {
        z-index: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.2);
      }
      .progress {
        transition: all .17s linear;
        z-index: 10;
        background-color: rgb(184, 37, 37);
      }
      .progress-btn-wrapper {
        position: absolute;
        top: 16px;
        transition: all .2s linear;
        z-index: 10;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
  } 
</style>
