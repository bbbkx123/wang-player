<template>
  <div v-if="data.id" :style="{'width': `${width}px`}" class="simple-details-view-container">
    <div @mouseenter="mouseenter" @mouseleave="mouseleave" @click="goToListDetails" 
      style="position: relative; z-index: 0; cursor:pointer;">
      <div :style="_style" class="view" ></div>
      <div v-if="!isHover" class="play-count">
        <span class="text">{{playCount}}</span>
      </div>
      <div v-if="isHover" class="recommend-info">
        <span class="text">{{data.copywriter}}</span>
      </div>
      <div v-if="isHover" class="play-btn" >
        <i class="iconfont icon-bofang" style="font-size: 24px; color: #fff;"></i>
      </div>
    </div>
    <div class="name">{{data.name}}</div>
  </div>
</template>

<script>
export default {
  name: 'SimpleDetailsView',
  props: {
    width: {
      type: Number,
      default: 170
    },
    height: {
      type: Number,
      default: 170
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isHover: false
    }
  },
  computed: {
    _style () {
      return {
        height: `${this.height}px`,
        backgroundImage: `url(${this.data.picUrl}?param=${this.width}y${this.height})`
      }
    },
    playCount () {
      return `${parseInt(this.data.playCount / 10000)}万`
    }
  },
  methods: {
    goToListDetails () {
      this.$router.push({name: 'ListDetails', params:{listid: this.data.id}})
    },
    mouseenter () {
      this.isHover = true
    },
    mouseleave () {
      this.isHover = false
    }
  }
}
</script>

<style lang="less">
  .simple-details-view-container {
    box-sizing: border-box;
    font-size: 0;
    .name {
      margin-top: 10px;
      height: 28px;
      font-size: 14px;
      color: rgba(255, 255, 255, 1)
    }
    .play-count {
      position: absolute;
      top: 0;
      left: 0;
      transition: height linear 0.2s;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      padding-right: 5px;
      width: 100%;
      height: 20px;
      // 渐变
      background-image: linear-gradient(to right, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%);
      color: #ffffff;
      font-size: 12px;
      .text {
        display: inline-block;
        width: 100%;
        text-align: right;
      }
    }
    .recommend-info {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      transition: all linear 0.2s;
      width: 100%;
      height: 33%;
      background-color: rgba(0,0,0,0.5);
      font-size: 12px;
      color: #ffffff;
      .text {
        display: inline-block;
        width: 95%;
      }
    }
    .play-btn {
      position:  absolute;
      bottom: 5px;
      right: 5px;
      background-color: rgba(0,0,0,0.5);
      border-radius: 50%;
    }
  }  
</style>
