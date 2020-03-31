<template>
	<div v-if="listInfo" class="page-list">
		<div class="list-top">
			<div class="list-top-photo">
                <!-- {{listInfo}} -->
				<img v-if="listInfo.coverImgUrl" :src="`${listInfo.coverImgUrl}?param=200y200`" alt="">
			</div>
			<div class="list-top-information">
				<div class="title">
					<span class="tag">歌单</span>
					<span class="text" v-if="listInfo.listName">{{listInfo.listName}}</span>
				</div>
				<div class="user">
					<div class="image">
						<img src="/static/image/user30x30.jpg" alt="">
					</div>
					<div v-if="listInfo.creator && listInfo.creator.nickname" class="name">{{listInfo.creator.nickname}}</div>
					<div class="date">{{birthday}}</div>
				</div>
				<div class="button-group">
                    <div class="play_all" @click="handlePlayAll">播放全部</div>
                </div>
			</div>
				<!-- <div class="other"></div> -->
		</div>
		<div class="list-bottom">
			<!-- <div class="nav">
				<div class="tab">
					<div v-for="(tab, tabIndex) in tabs" :key="tabIndex" @click="onClickOfTab"  class="tab-item" :class="{'active': tab.active}">{{tab.name}}</div>
				</div>
			</div> -->
            <List listType="details" :data="showlist"></List>
		</div>
	</div>
</template>

<script>
// import {tabs, listHeader} from './data'
// import * as common from 'base/util/common'
import EventBus from 'base/util/EventBus'

export default {
    name: 'PageList',
    props: {},
    data () {
        return {
            // tabs,
            url: null
        }
    },
	watch: {},
	computed: {
        showlist () {
            return Array.isArray(this.$store.getters.showlist) ? this.$store.getters.showlist : []
        },
        listInfo () {
            return this.$store.getters.listInfo
        },
        birthday () {
            let date = new Date(this.listInfo.createTime)
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        }
	},
	methods: {
		onClickOfTab (event, index) {
			this.tabs.forEach((tab) => {
				tab.active = false
			})
			this.tabs[index].active = true
		},
        handlePlayAll () {
            EventBus.$emit('song-play-all', {songlist: this.$store.getters.showlist, index: 0})
        }
	},
	created () {}
}
</script>

<style lang="less">
    .page-list {
        padding-top: 30px;
        height: 100%;
        // background-color: #16181c;
        .list-top {
            display: flex;
            // justify-content: center
            align-items: center;
            width: 100%;
            height: 40%;
        }
        .list-top-photo {
            margin: 0 30px;
            width: 200px;
            height: 200px;
        }
        .list-top-information {
            width: 500px;
            height: 200px;
            .title {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .title .tag{
                display: inline-block;
                margin-right: 5px;
                width: 38px;
                height: 21px;
                border: 1px solid #e03f40;
                text-align: center;
                line-height: 21px;
                font-size: 13px;
                color: #e03f40;
            }
            .title .text {
                font-size: 22px;
                color: #ffffff;
            }
            .user {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .image {
                    margin-right: 10px;
                    width: 30px;
                    height: 30px;
                    overflow: hidden;
                    border-radius: 100%;
                }
                .name {
                    margin-right: 20px;
                    color: rgba(255, 255, 255, 0.5);
                }
                .date {
                    color: rgba(255, 255, 255, 0.3);
                }
            }
            .button-group {
                .play_all {
                    width: 80px;
                    height: 20px;
                }
            }
        }

        .list-bottom {
            width: 100%;
            height: 60%;
            .nav {
                display: flex;
                align-content: center;
                justify-content: space-between;
                .tab {
                    padding-left:50px; 
                }
                .tab .tab-item {
                    display: inline-block;
                    box-sizing: border-box;
                    margin-right: 50px;
                    width: auto;
                    height: 40px;
                    line-height: 40px;
                    color: #ffffff;
                    cursor: pointer;
                }
                .tab .tab-item.active {
                    color: #e03f40;
                    border-bottom: 4px solid #e03f40;
                }
                .search {
                    width: 200px;
                    height: 50px;
                }
            }
        }
    }
</style>
