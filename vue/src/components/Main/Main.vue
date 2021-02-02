<template>
    <div class="main">
        <Menu class="layout-cloud_menu" ></Menu>
        <div class="layout-cloud_main">
            <router-view></router-view>
        </div>
        <!-- <div class="ie-hide"></div> -->
    </div>
</template>

<script>
export default {
    props: {
        songIndex: {
            type: Number,
            default: null
        }
    },
    data () {
        return {

        }
    },
    methods: {
    }
}
</script>

<style lang="less">
    @import '../../base/css/common.less';
    .main {
        position: relative;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        background-color: @main-background-color;
        .layout-cloud_menu {
            display: inline-block;
            width: 200px;
            height: 650px;
        }
        .layout-cloud_main {
            display: inline-block;
            box-sizing: border-box;
            width: calc(~"100% - 200px");
            height: 650px;
            overflow-y: scroll;
            overflow-x: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05); 
            // background-color: @main-background-color;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .ie-hide {
            position: absolute;
            right: 0;
            height: 100%;
            width: 30px;
            background-color: rgba(25, 27, 31, 1);
        }
    }
</style>
