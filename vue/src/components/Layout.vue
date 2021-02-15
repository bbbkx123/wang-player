<template>
	<div class="layout">
		<div class="cloud">
			<Header></Header>
			<router-view style="width: 100%;"></router-view>
			<player ref="player" class="layout-player"></player>
            <LoadingView class="loading-view"></LoadingView>
            <transition name="normal">
                <div v-if="openPlayPage" class="play-page">
                    <PlayPage  ></PlayPage>
                </div>
                
            </transition>
		</div>
	</div>
</template>

<script>
import EventBus from 'util/EventBus'

export default {
    name: 'layout',
    data () {
		return {
            height: 0
        }
    },
    methods: {
        click () {
            EventBus.$emit('play-list-blur')
        }
    },
    computed: {
        openPlayPage () {
            console.log(this.$store.getters.openPlayPage);
            return this.$store.getters.openPlayPage
        },
    },
    created () {
        // this.height = window.innerHeight + 'px'
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
        .play-page {
            position: absolute;
            bottom: 50px;
            width: 1200px;
            height: 650px;
            background-color: white;
            &.normal-enter-active, &.normal-leave-active {
                // 防止打开/关闭时y轴滚动条引起的左右抖动
                overflow: hidden; 
                // 保证打开/关闭的方向
                bottom: 50px;
                left: 0;
                transition: all .4s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            &.normal-enter, &.normal-leave-to {
                width: 0;
                height: 0;
            }
        }
    }
}
</style>
