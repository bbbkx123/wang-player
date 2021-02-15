<template>
  <div class="page-container">
    <ul class="page">
      <!-- 无法取得未记录再otherList的lastUpdateTIme, 例如当前otherList为第五页, 无法回到第一页 -->
      <!-- 上一页,下一页模式无法描述上一页的上一页 -->
      <li v-for="(item, index) in showPageNumber.arr" :key="index" class="page-item" 
        @click="() => changePageNumber(item)" :class="{'active': item === number}">{{item}}</li>
      <li>当前第: {{number}}页, </li>
      <li>共: {{pageTotal}}页</li>
      <!-- <li v-if="pageNumber > 1" @click="clickPagePrevBtn">上一页</li>
      <li v-if="pageNumber < pageTotal" @click="clickPagePrevBtn">下一页</li> -->
    </ul>
  </div>
</template> 

<script>
const OFFSET = 2
import EventBus from 'util/EventBus'
export default {
  props: {
    number: {
      type: Number,
      default: null
    },
    total: {
      type: Number,
      default: null
    },
    size: {
      type: Number,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
    showPageNumber () {
      let current = this.number, arr = [current], isMin = false, isMax = false
      let prev = (offset) => {
        for (let i = 1; i <= offset; i++) {
          if (current - i <= 0) break
          arr.unshift(current - i)
        }
        if (current - OFFSET <= 0) isMin = true
        return arr
      }
      let next = (offset) => {
        for (let i = 1; i <= offset; i++) {
          if (current + i > this.total) break
          arr.push(current + i)
        }
        if (current + OFFSET >= this.total) isMax = true
        return arr
      }
      prev(OFFSET)
      next(OFFSET)
      return {arr, isMin, isMax}
    },
    pageTotal () {
       return (this.total % this.size) === 0 ? 
        this.total / this.size : Math.floor(this.total / this.size) + 1
    }
  },
  methods: {
    changePageNumber (pageNumber) {
      if (pageNumber === this.number) return 
      EventBus.$emit('change-page-number', pageNumber)
    }
  },
  created () {

  }
}
</script>

<style lang="less">
  .page-container {
    cursor: pointer;
    .page {
      .page-item {
        display: inline-block;
        width: 16px;
        height: 16px;
        &.active {
          color: red;
        }
      }
    }
  }
</style>
