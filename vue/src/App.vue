<template>
  <div v-if="show" id="app" :style="{height}">
    <div class="background" >
      <img :src="`${publicPath}background-image/p1.jpg`" style="width:100%;height:100%;">
    </div>
   <Layout></Layout>
    <!-- <test></test> -->

  </div>
</template>

<script>
import Layout from 'components/Layout'
import * as common from 'util/common'

// import test from './components/test/test'

export default {
  name: 'App',
  components: {
    // test
    Layout
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      height: 0,
      show: true
    }
  },
  created () {
    this.height = window.innerHeight + 'px'
    if (common.getBrowser() !== 'Chrome') {
      alert('推荐使用谷歌浏览器, 下载地址: https://www.google.cn/chrome/')
      this.show = false
    } else {
      this.show = true
    }
    
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-top: 60px; */
  .background {
    position: absolute;
    z-index: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
