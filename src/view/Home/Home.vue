<template>
  <div class>
		<div class="main-container">
			<div class="banner-container">
				<!-- @mouseenter="handleBannerStopScroll" @mouseleave="handleBannerAutoScroll" -->
				<div v-if="bannerArr.length >= 3" @mouseenter="handleBannerStopScroll" @mouseleave="handleBannerAutoScroll" class="banner">
					<div v-for="(banner, bIndex) in bannerArr" :key="bIndex" class="banner-item" @click="() => clickBanner(banner)"
						:class="{ prev: bannerActions[bIndex].prev, current: bannerActions[bIndex].current , next: bannerActions[bIndex].next}">
						<img v-if="banner" :src="`${banner.imageUrl}?param=540y${bannerActions[bIndex].current ? 200 : 190}`" alt="">
					</div>
					<div class="banner-btn prev" @click="handleBannerScrollForPrevBtn">
						<span style="font-size:24px;" class="iconfont icon-shangyige"></span>
					</div>
					<div class="banner-btn next" @click="handleBannerScrollForNextBtn">
						<span style="font-size:24px;" class="iconfont icon-xiayige"></span>
					</div>
				</div>
				<div class="tab-container">
					<!-- @mouseleave="handleBannerAutoScroll" -->
					<span v-for="(banner, bIndex) in bannerArr" :key="bIndex" class="tab-item" :class="{'active': bIndex === currentIndexOfBanner}"
					@mouseenter="() => touchTabItem(bIndex)" @mouseleave="handleBannerAutoScroll"></span>
				</div>
			</div>
			<div class="recommend-container">
				<div class="title">
					<span @click="fun1">推荐歌单</span>
					<span @click="more">更多</span>
				</div>
				<div class="item-container">
					<div v-for="(item, i) in data" :key="i" :class="{'no-margin-right': (i + 1) % 5 === 0}" class="recommend-item-container">
						<simple-details-view :data="item"></simple-details-view>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import * as api from 'api'
import EventBus from 'base/util/EventBus'
import * as common from 'base/util/common'

export default {
  name: "Home",
  data() {
    return {
			data: [],
			bannerArr: [],
			bannerActions: [],
			currentIndexOfBanner: 0,
			timer: null
		}
	},
	watch: {
		bannerArr (val) {
			if (val.length > 2) {
				// ! 长度小于3 需要处理
				this.currentIndexOfBanner = 0
				this.handleBannerActive(this.currentIndexOfBanner)
				this.handleBannerAutoScroll()
				// console.log('bannerArr')
			}
		}
	},
	computed: {
	},
	methods: {
		clickBanner (banner) {
			switch (banner.targetType) {
				case 1:
					this.handlePlaySong(banner.targetId)
					break
				// case 10:
				case 1000:
					this.handleOpenListDetails(banner.targetId)
					break
			}
		},
		handlePlaySong (id) {
			api.getSongsDetail(id).then((res) => {
				EventBus.$emit('song-play', common.songDetails(res.data.songs))
			})
		},
		handleOpenListDetails (id) {
			api.getPlayListDetail(id).then((res) => {
				this.$router.push({name: 'ListDetails', params: {listid: id}})
			})
		},
		getPersonalized () {
			let limit = 10
			api.getPersonalized(limit).then((res) => {
				if (res.data.code === 200) {
					this.data = res.data.result
				}
			})
		},
		getBanner () {
			let type = 0
			api.getBanner(type).then((res) => {
				if (res.data.code === 200) {
					this.bannerArr = res.data.banners
				}
			})
		},
		handleBannerScrollForPrevBtn () {
			this.currentIndexOfBanner = this.currentIndexOfBanner === 0 ? this.bannerArr.length - 1 : this.currentIndexOfBanner - 1
			this.handleBannerActive(this.currentIndexOfBanner)
		},
		handleBannerScrollForNextBtn () {
			this.currentIndexOfBanner = this.currentIndexOfBanner === this.bannerArr.length - 1 ? 0 : this.currentIndexOfBanner + 1
			this.handleBannerActive(this.currentIndexOfBanner)
		},
		handleBannerInit (bannerArr) {
			if (!bannerArr) return 
			return bannerArr.map(() => {
				return {prev: false, current: false, next: false}
			})
		},
		handleBannerActive (index) {
			this.bannerActions = this.handleBannerInit(this.bannerArr)
			if (!this.bannerActions) return console.log('bannerActions is null')
			if (index === 0) {
				this.bannerActions[this.bannerActions.length - 1].prev = true
				this.bannerActions[0].current = true
				this.bannerActions[1].next = true
			} else if (index === this.bannerActions.length - 1) {
				this.bannerActions[this.bannerActions.length - 2].prev = true
				this.bannerActions[this.bannerActions.length - 1].current = true
				this.bannerActions[0].next = true
			} else {
				this.bannerActions[index - 1].prev = true
				this.bannerActions[index].current = true
				this.bannerActions[index + 1].next = true
			}
		},
		touchTabItem (index) {
			this.handleBannerStopScroll()
			this.currentIndexOfBanner = index
			this.handleBannerActive(this.currentIndexOfBanner)
		},
		handleBannerAutoScroll () {
			if (!this.timer) {
				// console.log(this.timer)
				this.timer = setInterval(() => {
					this.handleBannerScrollForNextBtn()
					// console.log('auto')
				}, 5000)
			}
		},
		handleBannerStopScroll () {
			clearInterval(this.timer)
			this.timer = null
			console.log('stop')
		},
		fun1 () {
			this.$router.replace('/Main/FavouriteList')
		},
		more () {
			this.$router.push({name: 'OtherList'})
		}
	},
	created () {
		this.getPersonalized()
		this.getBanner()
	},
	mounted () {
		
	}
}
</script>

<style lang="less">
.main-container {
	padding-left: 30px;
	padding-right: 30px; 
	.banner-container {
		padding-top: 20px;
		margin-bottom: 10px;
		.banner {
			position: relative;
			width: 100%;
			height: 200px;
			.banner-btn {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				color: rgba(255, 255, 255, 0.5);
				&.prev {
					left: 0;
				}
				&.next {
					right: 0;
				}
			}
			.banner-item {
				position: absolute;
				display: none;
				transition: all linear .15s;
				box-sizing: border-box;
				&.prev {
					display: block;
					left: 0;
					padding-top: 10px;
					height: 190px;
					filter: blur(2px);
				}
				&.current {
					display: block;
					left: 50%;
					padding-top: 1px;
					transform: translateX(-50%);
					z-index: 10;
				}
				&.next {
					display: block;
					right: 0;
					padding-top: 10px;
					height: 190px;
					filter: blur(2px);
				}
			}
		}
		.tab-container {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px; 
			width: 100%;
			height: 10px;
			box-sizing: border-box;
			.tab-item {
				margin-right: 4px;
				box-sizing: border-box;
				width: 20px;
				height: 2px;
				background-color: rgba(255, 255, 255, 0.2);
				&.active {
					background-color: rgba(255, 255, 255, 0.7)
				}
			}
		}
	}
	.recommend-container {
		.title {
			display: flex;
			justify-content: space-between;
			padding-bottom: 10px;
			text-align: left;
			color: rgba(255, 255, 255, 0.9);
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
			font-size: 18px;
		}
		.item-container {
			margin-top: 10px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 938px;
			.recommend-item-container {
				display: inline-block;
				margin-right: 22px;
				margin-bottom: 30px;
				&.no-margin-right {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
