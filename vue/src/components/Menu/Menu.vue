<template>
    <div style="position: relative;">
        <div class="cloud-menu">
            <!-- <ul v-for="(listOfType, uIndex) in menuList" :key="uIndex"
                class="menu-list">
                <div class="title" v-if="listOfType" >
                    <span class="left-text-wrapper">{{listOfType.title}}</span>
                    <div class="right-icon-wrapper">
                        <span v-if="listOfType.button.add" class="icon-item">
                            <i class="iconfont icon-tianjia" @click="addList"></i>
                        </span>
                        <span v-if="listOfType.button.list_toggle" class="icon-item">
                            <i class="iconfont icon-zhankai" @click="listToggle"></i>
                        </span>
                    </div>
                </div>
                <li v-for="(liItem, liIndex) in listOfType.children" :key="liItem.name" :class="{active: liItem.active}"
                    class="list-item"
                    @click="clickMenuItem(liItem, liIndex, uIndex)">
                    <i class="iconfont" :class="[liItem.icon]"></i>
                    <span class="text">{{liItem.name}}</span>
                </li>
            </ul> -->
            <ul class="menu-list">
                <div class="title">
                    <span class="left-text-wrapper">推荐</span>
                    <div class="right-icon-wrapper">
                        <span class="icon-item">
                            <i class="iconfont icon-tianjia"></i>
                        </span>
                        <span class="icon-item">
                            <i class="iconfont icon-zhankai"></i>
                        </span>
                    </div>
                </div>
                <li class="list-item" @click="fun1">
                    <!-- <i class="iconfont" :class="[liItem.icon]"></i> -->
                    <!-- <span class="text">我喜欢的</span> -->
                </li>
            </ul>
        </div>
        <div class="mini-detail-container" @click="goToSongDetails">
            <div class="poster" >
                <img v-if="song" :src="song.picture + '?param=50y50'" alt="">
            </div>
            <div class="info">
                <div style="height:100%; display:flex; justify-content: center; flex-direction: column; margin-left: 10px;">
                    <div v-if="song" class="info-title" style="margin-bottom: 10px;">{{song.title}}</div>
                    <div v-if="song" class="info-singer">{{song.singer}}</div>
                </div>
            </div>
            <div class="other"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'cloud-menu',
    props: {
        urlMenuList: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            menuList: {},
            currentItem: {
                uIndex: null,
                lliIndex: null
            },
            previousItem: {
                uIndex: null,
                lliIndex: null
            }
        }
    },
    computed: {
        song () {
            // if (this.$store.getters.playlist && this.$store.getters.playlist.length > 0) {
            //     return this.$store.getters.playlist[this.$store.getters.currentIndex]    
            // } else {
            //     return null
            // }
            return this.$store.getters.currentSong
        }
    },
    methods: {
        goToSongDetails () {
            if (!this.$store.getters.currentTime) return 
            this.$router.push({name: 'PlayPage'})
        },
        clickMenuItem (itemData, lliIndex, uIndex) {
            if (!itemData) return
            // 首次点击, prev和cur都没有记录
            if (this.previousItem.uIndex === null && 
            this.previousItem.lliIndex === null && 
            this.currentItem.uIndex === null && this.currentItem.lliIndex === null) {
                this.previousItem.uIndex = uIndex
                this.previousItem.lliIndex = lliIndex
            } else if (typeof this.previousItem.uIndex === 'number' && 
            typeof this.previousItem.lliIndex === 'number') {
                // 非首次点击
                this.previousItem.lliIndex = this.currentItem.lliIndex
                this.previousItem.uIndex = this.currentItem.uIndex
                this.menuList[this.previousItem.uIndex].children[this.previousItem.lliIndex].active = false
            }
            this.currentItem.uIndex = uIndex
            this.currentItem.lliIndex = lliIndex
            this.menuList[this.currentItem.uIndex].children[this.currentItem.lliIndex].active = true
        },
        addList () {},
        listToggle () {},
        fun1 () {
            this.$router.push({name: 'FavouriteList'})
        }
    },
    created () {}
}
</script>

<style lang="less">
    @import './Menu.less';   
</style>
