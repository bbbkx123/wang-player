<template>
  <div>
    <div>
      <div v-for="(hot, index) in comment.hotComments" :key="index">{{hot.content}}</div>
    </div>
    <div class="page"> 
      <Page :total="page.total" :number="page.pageNumber" :size="page.pageSize"></Page>
    </div>
  </div>
  
</template>

<script>
import * as api from 'api'

const LIMIT = 20
export default {
  data () {
    return {
      page: {
        pageSize: LIMIT,
        pageNumber: 1,
        total: null
      },
      comment: {
        hotComments: [],
        comments: []
      }
    }
  },
  computed: {
    songid () {
      return this.$store.getters.songlist[this.$store.getters.currentIndex].songid
    }
  },
  watch: {
    songid: {
      handler: function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.getMusicComment(newValue)
        }
      },
      immediate: true
    }
  },
  methods: {
    getMusicComment (id, before) {
      let limit = LIMIT, offset = (this.page.pageNumber - 1) * limit
      api.getMusicComment(id, limit, offset, before).then((res) => {
        if (res.data.code !== 200) return 
        this.page.total = res.data.total
        this.comment = {hotComments: res.data.hotComments, comments: res.data.comments}
      })
    }
  },
  created () {
  }
}
</script>

<style lang="less">

</style>
