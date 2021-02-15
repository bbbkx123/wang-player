<template>
  <div>
    <PageList ></PageList>
  </div>
</template>

<script>
import mixins from 'components/mixins'
import EventBus from 'util/EventBus'

export default {
  mixins: [mixins],
  data () {
    return {

    }
  },
  methods: {
    getPlayListDetailByMixins (listid) {
      return this.getPlayListDetail(listid).then((res) => {
        let songlist = JSON.parse(JSON.stringify(res.tracks))
        delete res.tracks
        this.$store.commit('SET_LISTINFO', res)
        this.$store.commit('SET_SHOWLIST', songlist)
      })
    }
  },
  created () {
    EventBus.$emit('show-loading-view')
    let listid = this.$route.params.listid || null
    this.getPlayListDetailByMixins(listid).then(() => {
      EventBus.$emit('hide-loading-view')
    })
    
  }
}
</script>

<style lang="less">

</style>
