<template>
  <div class="container">
    <div class="header"></div>
    <div class="main1"></div>
    <div class="bottom"></div>
    <transition name="fade">
      <div v-if="show" class="show"></div>
    </transition>
    <button @click="open">open</button><br>
    <button @click="close">close</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="less">
.container {
  position: relative;
  width: 500px;
  border: 1px solid red;
  .header {
    height: 50px;
  }
  .main1 {
    height: 400px;
  }
  .bottom {
    height: 50px;
  }
  .show {
    position: absolute;
    top: 50px;
    width: 500px;
    height: 400px;
    border: 1px solid blue;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 1s linear;
  }
  .fade-enter, .fade-leave-to {
    width: 0;
    height: 0;
  }
  // .fade-enter-to, .fade-leave {
  //   width: 500px;
  //   height: 400px;
  // }
}
</style>