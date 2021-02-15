<template>
    <div class="">
        <PageList></PageList>
    </div>
</template>

<script>
import mixins from 'components/mixins'
import EventBus from 'util/EventBus'

export default {
    mixins: [mixins],
    props: {
        songIndex: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            songsListIds: null
        }
    },
    methods: {
        // 路由跳转时会触发, 应该缓存, 带优化
        getPlayListDetailByMixins (listid) {
            return  this.getPlayListDetail(listid).then((res) => {
                let songlist = JSON.parse(JSON.stringify(res.tracks))
                delete res.tracks
                this.$store.commit('SET_LISTINFO', res)
                this.$store.commit('SET_SHOWLIST', songlist)
            })
        }
    },
    created () {
        EventBus.$emit('show-loading-view')
        let listid = 2300306419
        this.getPlayListDetailByMixins(listid).then(() => {
            EventBus.$emit('hide-loading-view')
        })
    }
}
</script>

<style lang="less">
    .main { }
</style>
