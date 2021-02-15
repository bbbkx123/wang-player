<template>
  <div v-if="show" class="loading-view-container">loading...
    <loading></loading>  
  </div>  
  
</template>

<script>
import loading from './loading'
import EventBus from '../../util/EventBus'

export default {
  components: {
    loading
  },
  data () {
    return {
      show: false
    }
  },
  methods: {

  },
  created () {
    EventBus.$on('show-loading-view', () => {
      this.show = true
    })
    EventBus.$on('hide-loading-view', () => {
      this.show = false
    })
  }
}
</script>

<style lang="less">
  .loading-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7)
  }
</style>
