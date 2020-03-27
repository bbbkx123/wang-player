<template>
  <div>
    <div class="search-box-container">
      <div class="search-box">
        <input type="text" v-model="keywords" @keydown="search">
        <div class="icon">
          <i class="iconfont icon-sousuo"></i>
        </div>
      </div>
		</div>
    <List listType="search" :data="searchResult"></List>
    <div class="page"> 
      <Page :pageTotal="pageTotal" :pageNumber="page.pageNumber"></Page>
    </div>
  </div> 
</template>

<script>
const LIMIT = 20
// import * as common from 'base/util/common'
import * as api from 'api'
import mixins from 'components/mixins'
import EventBus from 'base/util/EventBus'
export default {
  mixins: [mixins],
  data () {
    return {
      keywords: null,
      searchResult: [],
      page: {
        pageSize: LIMIT,
        pageNumber: 1,
        total: null
      }
    }
  },
  watch: {
  },
  computed: {
    pageTotal () { 
      return (this.page.total % this.page.pageSize) === 0 ? 
        this.page.total / this.page.pageSize : Math.floor(this.page.total / this.page.pageSize) + 1
    },
  },
  methods: {
    getSearchResult (keywords) {
      return api.getSearchResult(keywords, this.page.pageSize, (this.page.pageNumber - 1) * this.page.pageSize).then((res) => {
        try {
          let _res = res.data
          if (_res.code !== 200) return 
          let ids = _res.result.songs.map((item) => item.id)
          return Promise.resolve({ids, total: _res.result.songCount})
        } catch (err) {
          return Promise.reject(err)
        }       
      })
    },
    getTotal (total) {
      this.page.total = total
    },
    search (event) {
      if (event.keyCode !== 13) return 
      if (this.keywords === null || this.keywords === '') return
      if (!this.keywords.match(/\S/g)) return 
      this.handleSearch(this.keywords)
    },
    handleSearch (keywords) {
      this.$store.commit('SET_KEYWORDS', keywords)
      this.getSearchResult(keywords).then((res) => {
        this.getTotal(res.total)
        return this.getSongsDetail(res.ids.join(','))
      }).then((songlist) => {
        this.searchResult = songlist
      })
    },
    click () {
      if (this.keywords === null || this.keywords === '') return
      if (!this.keywords.match(/\S/g)) return 
      this.handleSearch(this.keywords)
    },
    changePageNumber (pageNumber) {
      this.page.pageNumber = pageNumber
      this.handleSearch(this.keywords)
    }
  },
  created () {
    if (this.$store.getters.keywords) {
      this.keywords = this.$store.getters.keywords
      this.handleSearch(this.keywords)
    }
    EventBus.$on('change-page-number', (pageNumber) => {
      this.changePageNumber(pageNumber)
    })
  }
}
</script>

<style lang="less">
@inputHeight: 30px;
@inputWidth: 500px;
@inputBackgroundColor: rgba(22, 24, 28, 1);
@inputPaddingLeftAndRight: 5px;

.search-box-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  .search-box {
    border: 1px solid rgba(255, 255, 255, .2);
    position: relative;
    padding-left: @inputPaddingLeftAndRight;
    padding-right: @inputPaddingLeftAndRight;
    overflow: hidden;
    width: @inputWidth;
    height: @inputHeight;
    border-radius: 10px;
    background-color: @inputBackgroundColor;
    input {
      width: calc(100% - 2 * @inputPaddingLeftAndRight);
      height: 100%;
      background-color: @inputBackgroundColor;
      color: rgba(255, 255, 255, .5);
      &:focus {
        outline: none;
      }
    }
    .icon {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 30px;
      width: 20px;
      height: 30px;
      color: rgba(255, 255, 255, .5);
    }
  }
}
</style>
