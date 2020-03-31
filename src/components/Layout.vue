<template>
	<div class="layout">
        <div class="background" :style="{height}">
            <img :src="`${publicPath}background-image/p4.webp`" style="width:100%;height:100%;">
        </div>
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
		return {
            publicPath: process.env.BASE_URL,
            height: 0
        }
    },
    methods: {
        click () {
            EventBus.$emit('play-list-blur')
        }
    },
    created () {
        this.height = window.innerHeight + 'px'
        if (this.$route.path.indexOf('/Main/Home') < 0) {
            this.$router.push({name: 'Home'})  
        }
    }
}
</script>

<style lang="less">
@playerWidth: 1200px;
@playerHeight: 100%;
.layout {
    position: relative;
    display: flex;
    padding-top: 20px;
    justify-content: center;
    align-items: center;
    width: 100%;
    .cloud {
        position: relative;
        z-index: 100;
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
    .background {
        position: absolute;
        z-index: 0;
        width: 100%;
    }
}
</style>
