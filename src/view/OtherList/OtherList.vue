<template>
  <div class="other-list-container">
    <div class="center-container">
      <div class="tag-container">
        <span class="title">热门标签: </span>
        <span v-for="(tag, i) in tags" :key="i" :class="{'active': !!tag.active, 'no-border-right': i === tags.length - 1}" @click="() => changeTag(i)" class="tag-item">{{tag.name}}</span>
      </div>
      <div v-for="(item, i) in showList" :key="i" :class="{'no-margin-right': (i +1 ) % 5 === 0}" class="recommend-item-container">
        <simple-details-view :data="item"></simple-details-view>
      </div>
      <div class="page"> 
        <Page :pageTotal="pageTotal" :pageNumber="page.pageNumber"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from 'api'
import * as common from 'base/util/common'
import EventBus from 'base/util/EventBus'

const LIMIT = 50
export default {
  data () {
    return {
      otherList: [],
      page: {
        pageSize: LIMIT,
        pageNumber: 1,
        total: null
      },
      tags: [
        {name: '华语', active: false},
        {name: '流行', active: false},
        {name: '摇滚', active: false},
        {name: '民谣', active: false},
        {name: '电子', active: false},
        {name: '另类/独立', active: false},
        {name: '轻音乐', active: false},
        {name: '影视原声', active: false},
        {name: 'ACG', active: false},
        {name: '怀旧', active: false},
      ],
      curentTagIndex: null 
    }
  },
  computed: {
    showList () {
      return this.otherList[this.page.pageNumber - 1]
    },
    pageTotal () { 
      return (this.page.total % this.page.pageSize) === 0 ? 
        this.page.total / this.page.pageSize : Math.floor(this.page.total / this.page.pageSize) + 1
    },
    currentTag () {
      return this.curentTagIndex || this.curentTagIndex === 0 ? this.tags[this.curentTagIndex].name : '全部'
    }
  },
  methods: {
    /**
     *  // 接口限制, 按分页请求有问题(例如当前在第一页, 直接点击点击第三页, 没有第二页的updateTime所以不能成功获取)
     *  // 采用前端分页
     *  已解决: 通过连续多次调用, 构成[ [...], [...], [...], ...] 的数据结构
     */
    getOtherListByPageSize (updateTime, tag) {
      return api.getTopPlayList(updateTime, LIMIT, tag).then((res) => {
        if (res.data.code !== 200) return
        let _list = res.data.playlists.map((item) => {
          item.picUrl = item.coverImgUrl
          delete item.coverImgUrl
          return item
        })
        return Promise.resolve({list: _list, total: res.data.total})
      })
    },

    getOtherListAll () {
      let count = 1
      let handler  = async () => {
        let _updateTime = this.otherList.length > 0 ? this.otherList[this.otherList.length - 1][LIMIT - 1].updateTime : null
        // console.log(this.otherList)
        let res = await this.getOtherListByPageSize(_updateTime, this.currentTag)
        this.otherList.push(res.list)
        if (++count < this.pageTotal) {
          handler()
        }
      }
      // 第一次(第一页)数据获取; 计算出需要请求多少页的数据
      this.getOtherListByPageSize(null, this.currentTag).then((res) => {
        this.page.total = res.total || 0
        this.otherList.push(res.list)
        handler()
      })      
    },
    changePageNumber (pageNumber) {
      this.page.pageNumber = pageNumber
      console.log(this.otherList)
    },
    changeTag (index) {
      if (this.tags[index].active) return 
      this.tags.forEach((tag) => {
        tag.active = false
      })
      this.curentTagIndex = index
      this.tags[index].active = true
      this.getTopPlayList(null, this.tags[index].name)
    }
  },
  created () {
    this.getOtherListAll()
    EventBus.$on('change-page-number', (pageNumber) => {
      this.changePageNumber(pageNumber)
    })
  }
}
</script>

<style lang="less">
  .other-list-container {
    display: flex;
    justify-content: center;
    padding-top: 30px;
    .center-container {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
      width: 938px;
      box-sizing: border-box;
      .tag-container {
        padding-bottom: 30px;
        text-align: left;
        width: 100%;
        color: rgba(255, 255, 255, .5);
        >span {
          display: inline-block;
        }
        .title {

        }
        .tag-item {
          padding: 0 20px;
          border-right: 1px solid #fff; 
          cursor: pointer;
          &.no-border-right {
            border-right: none;
          }
          &.active {
            color: red;
          }
        }
      }
      .recommend-item-container {
        display: inline-block;
        margin-bottom: 30px;
        margin-right: 22px;
        &.no-margin-right {
          margin-right: 0;
        }
      }
      .page {
        width: 100%;
      }
    }   
  }
    
</style>
