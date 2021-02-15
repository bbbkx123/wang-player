<template>
  <div class="list-wrapper">
      <!-- 动态使用calc计算宽度, 格式为calc(100% - 100px) -->
    <div v-if="data.length > 0" class="list-header">
      <div class="list-header-item" style="width: 50px;"></div>
      <div class="list-header-item" style="width: 50px;">操作</div>
      <div v-for="(item, i) in listHeader" :key="i" class="list-header-item" :style="{'width': item.style.width}">{{item.name}}</div>
    </div>
    <div v-for="(item, index) in listData" :key="index" @dblclick="() => play(item, index)" :class="{'click': index === currentIndex}" class="list-row">
      <div class="list-row-item" style="width: 50px;">{{index + 1}}</div>
      <div class="list-row-item" style="width: 50px;">
        <span style="display:inline-block;" class="aixin">
          <i style="font-size: 13px;" class="iconfont" :style="{'color': item.favourite ? '#e03f40': '#fff'}"
          :class="{'icon-aixin': item.favourite, 'icon-aixin1': !item.favourite}"></i>
        </span>
        <!-- <span style="display:inline-block;">
          <i class="iconfont icon-xiazai1" style="font-size: 13px;color: rgba(255,255,255,0.3);"></i>
        </span> -->
      </div>
      <div v-for="(headerItem, hIndex) in listHeader" :key="hIndex" class="list-row-item" :style="{'width': headerItem.style.width}">{{item[headerItem.type]}}</div>
    </div>
  </div>
</template>

<script>
import * as common from 'util/common'
import EventBus from 'util/EventBus'
export default {
  props: {
    listType: {
      type: String,
      default: null
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      listHeader: [
        {
          type: 'title',
          name: '音乐标题',
          style: {
            width: '33%'
          }
        }, {
          type: 'singer',
          name: '歌手',
          style: {
            width: '23%'
          }
        }, {
          type: 'album',
          name: '专辑',
          style: {
            width: '23%'
          }
        }, {
          type: 'duration',
          name: '时长',
          style: {
            width: 'calc(21% - 100px)'
          }
        }
      ]
    }
  },
  watch: { },
  computed: {
    listData () {  
      if (Array.isArray(this.data) && this.data.length > 0) {
        let _data = JSON.parse(JSON.stringify(this.data))
        _data.forEach((item) => {
          // 处理时间格式
          item.duration = common.formatForPlayTime(item.duration / 1000)
        })
        return _data
      } else {
        return null
      }
    },
    currentIndex () {
      return this.$store.getters.currentIndex
    }
  },
  methods: {
    play (song, index) {
      if (this.listType === 'search') {
        EventBus.$emit('song-play', song)
      } else if (this.listType === 'details') {
        EventBus.$emit('song-play-all', {songlist: this.$store.getters.showlist, index})
      }
    }
  }
}
</script>

<style lang="less">
.list-wrapper {
  .list-header {
    display: flex;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  .list-header .list-header-item {
    display: inline-block;
    box-sizing: border-box;
    padding-left: 10px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: none;
    height: 30px;
  }
  // .list-header .list-header-item:first-child {
  //     border-left: 1px solid rgba(255, 255, 255, 0.5);
  // }
  .list-row {
    height: 30px;
    font-size: 0;
    cursor: pointer;
  }
  .list-row:hover, .list-row.click {
    background-color: rgba(35, 37, 41, .4);
  }
  .list-row .list-row-item {
    display: inline-block;
    padding: 0px 0 0px 10px;
    line-height: 30px;
    box-sizing: border-box;
    font-size: 13px;
    height: 100%;
    color: #ffffff;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>
