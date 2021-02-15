<template>
	<div class="cloud-header">
		<div class="logo-wrapper">
			<div @click="toHomePage" style="cursor: pointer;">
				<i class="iconfont icon-yinle1 logo"></i>
				<span class="title"></span>
			</div>
		</div>
		<div class="edit">
			<div @click="clickPrevBtn" class="prev-btn" style="border-right:1px solid rgba(255, 255, 255, .3);">
				<i class="iconfont icon-shangyige"></i>
			</div>
			<div @click="clickNextBtn" class="next-btn">
				<i class="iconfont icon-xiayige"></i>
			</div>
		</div>
		<div @click="search" class="search-icon-container">
			<div class="search-icon-box">
				<i class="iconfont icon-sousuo"></i>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			keywords: null
		}
	},
	methods: {
		toHomePage () {
			// if (this.$route.path.indexOf('/Main/Home') < 0) {
				this.$store.commit('SET_OPENPLAYPAGE', false)
				
				// this.$router.push({name: 'Home'})
			// }
		},
		search () {
			if (this.$route.path.indexOf('/Main/Search') < 0) {
				this.$router.push({name: 'Search'})
			}
		},
		clickPrevBtn () {
			if (this.$route.path.indexOf('/Main/Home') >= 0) return 
			this.$router.go(-1)
			console.log(this.$router)
		},
		clickNextBtn () {
			this.$router.go(1)
			console.log(this.$router)
		}
	}
}
</script>

<style lang="less">
	@import '../../base/css/common.less';
    .cloud-header {
			display: flex;
			align-items: center;
			width: 100%;
			height: 50px;
			box-sizing: border-box;
			// background-color: #222225;
			background-color: @main-background-color;
			border-bottom: 3px solid #670404;
			border-image: linear-gradient(to right,#670404, #b72525, #670404) 1 1;
			.logo-wrapper {
				width: 200px;
				height: 100%;
				display: flex;
				align-items: center;
				color: #ffffff;
				.logo {
					margin-left: 15px;
					display: inline-block; 
					font-size: 23px;
				}
				.title {
					margin-left: 5px;
					font-size: 23px;
				}
			}
			.edit {
				display: flex;
				cursor: pointer;
				.prev-btn, .next-btn  {
					display: inline-block;
					color: rgba(255, 255, 255, .3);
					background-color: #000;
					width: 20px;
				}
			}
			.search-icon-container {
				margin-left: 30px;
				width: 200px;
				height: 30px;
				border: 1px solid rgba(255, 255, 255, .3);
				border-radius: 20px;
				color: #ffffff;
				.search-icon-box {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					.icon-sousuo {
						display: inline-block;
						color: rgba(255, 255, 255, .5);
					}
				}
			}
    }
</style>
