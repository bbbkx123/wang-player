<template>
	<div class="layout">
		<div class="cloud">
			<Header></Header>
			<router-view style="width: 100%;"></router-view>
			<player ref="player" class="layout-player"></player>
            <LoadingView class="loading-view"></LoadingView>
		</div>
        
	</div>
</template>

<script>
import EventBus from 'base/util/EventBus'

export default {
    name: 'layout',
    data () {
		return {}
    },
    methods: {
        click () {
            EventBus.$emit('play-list-blur')
        }
    },
    created () {
        if (this.$route.path.indexOf('/Main/Home') < 0) {
            this.$router.push({name: 'Home'})  
        }
    }
}
</script>

<style lang="less">
@playerWidth: 1200px;
@playerHeight: 750px;
.layout {
    display: flex;
    padding-top: 20px;
    justify-content: center;
    align-items: center;
    .cloud {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        width: @playerWidth;
        min-width: @playerWidth;
        height: @playerHeight;
        .layout-player {
            width: 100%;
            height: 50px;
        }
        > .loading-view {
            position: absolute;
            z-index: 10;
            width: @playerWidth;
            height: @playerHeight;
        }
    }
}
</style>
