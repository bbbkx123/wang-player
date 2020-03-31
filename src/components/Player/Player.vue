<template>
    <div style="position:relative;">
        <div class="player">
            <div class="button-group-wrapper">
                <div class="prev button-wrapper" @click="prevBtnClick">
                    <i class="iconfont icon-shangyishou" style="font-size: 32px; color: #fff;"></i>
                </div>
                <div class="play button-wrapper" @click="playBtnClick">
                    <i v-if="playing" class="iconfont icon-zanting3" style="font-size: 36px; color: #fff;"></i>
                    <i v-else class="iconfont icon-bofang" style="font-size: 36px; color: #fff;"></i>
                </div>
                <div class="next button-wrapper" @click="nextBtnClick">
                    <i class="iconfont icon-xiayishou" style="font-size: 32px; color: #fff;"></i>
                </div>
            </div>
            <div class="timeline-wrapper">
                <div class="time-wrapper" style="margin-right: 5px;">
                    <span class="time-text">{{formatForTime(currentTime)}}</span>
                </div>
                <!-- timeline -->
                <div class="timeline-progress-wrapper">
                    <progress-bar @progress-changing="progressChanging" @progress-change="progressChange" :precent="precent"></progress-bar>
                </div>
                <div class="time-wrapper" style="margin-left: 5px;">
                    <span class="time-text" >{{audio && audio.src ? formatForTime(duration): '00:00'}}</span>
                </div>
            </div>
            <div class="volume-wrapper">
                <div style="margin-right:20px;">
                    <i class="iconfont icon-yinliang" style="font-size: 15px; color: #fff;"></i>
                </div>
                <!-- volumeline -->
                <div class="volumeline-progress-wrapper">
                    <progress-bar @progress-change="progressChangeForVolume" :precent="precentForVolume"></progress-bar>
                </div>
            </div>
            <div class="other-wrapper">
                <div @click="toggle" class="open-btn">
                    <i class="iconfont icon-liebiao"></i>
                </div>
                <div @click="clickLoopBtn" class="loop-btn">
                    <i class="iconfont icon-" :class="`icon-${loopType}`"></i>
                </div>
            </div>
            <audio ref="audio" @ended="onEnded" @timeupdate="_onTimeUpdate" @canplay="onCanPlay" :loop="loop"></audio>
        </div>
        <div v-if="playListShow" class="mini-playlist-container">
            <div class="mask"  @click="close"></div>
            <div class="mini-playlist">
                <div class="mini-playlist-header">
                    <div @click="close" class="close-btn-container" style="color:#fff;">
                        <i class="iconfont icon-guanbi"></i>
                    </div>
                    <div class="total">总{{playlist.length}}首</div>
                </div>
                <div class="mini-playlist-main">
                    <div v-for="(item, i) in playlist" :key="i" class="mini-playlist-item" :class="{'odd': (i + 1) % 2 !== 0}">
                        <div class="current">
                            <i v-if="currentIndex === i" class="iconfont icon-bofang1"></i>
                        </div>
                        <div class="mini-playlist-item-text title" style="display: inline-block;">{{item.title}}</div>
                        <div class="mini-playlist-item-text singer">{{item.singer}}</div>
                    </div>
                </div>
                <!-- <div class="ie-hide-mini">
                    <div v-for="(item, i) in playlist" :key="i" :class="{'odd': (i + 1) % 2 !== 0}" style="width:100%;height:30px;"></div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import * as common from '../../base/util/common'
import * as api from 'api'
import EventBus from '../../base/util/EventBus'

export default {
    name: 'player',
    data () {
        return {
            audio: null,
            dom: {},
            isPlay: null,
            currentTime: 0,
            duration: null,
            volume: 0,
            isProgressChanging: false,
            pic_src: null,
            count: 0,
            songChangeIndex: null,
            playListShow: false,
            playlist: [], // 播放列表(实际播放顺序的列表)
            // songlist: [], // 播放列表(原始)
            loop: false,
            loopType: 'shunxubofang',
            isLoopPlayList: false
        }
    },
    props: {},
    // mixins: [mixins],
    computed: {
        precent () {
            return this.currentTime / this.duration
        },
        precentForVolume () {
            return this.volume
        },
        currentIndex () {
            return this.$store.getters.currentIndex
        },
        playing () {
            return this.$store.getters.playing
        },
        songlist () {
            return this.$store.getters.songlist
        }
    },
    watch: {
        // 不直接使用 this.$store.getters.currentIndex , PlayPage页面出现currentIndex变化比lyric快
        // 以前是使用currentIndex监听执行下列方法
        songChangeIndex (newValue, oldValue) {
            if (newValue !== oldValue) {
                let song = this.playlist[newValue]
                this.pic_src = `${song.picture}?param=50y50`
                this.$axios.all([this.getLyric(song.songid), this.getSongUrl(song.songid)])
                .then(this.$axios.spread((resLyric, resSongUrl) => {
                    if (resLyric.data.code === 200) {
                        this.$store.commit('SET_LYRIC', resLyric.data)
                    } 
                    if (resSongUrl.data.code === 200) {
                        if (!resSongUrl.data.data[0].url) {
                            alert('暂无版权')
                            return
                        }
                        this.audio.src = resSongUrl.data.data[0].url
                    }
                }))
            }
        },
        loopType (newValue, oldValue) {
            if (!newValue || newValue === oldValue) return 
            //  随机播放
            newValue === 'suijibofang' ? this.playlist = this.random() : this.playlist = this.songlist
            // 单曲循环
            newValue === 'danquxunhuan' ? this.loop = true : this.loop = false
            // 列表循环
            newValue === 'icon--' ? this.isLoopPlayList = true : this.isLoopPlayList = false
        }
    },
    methods: {       
        random () {
            let songlist = JSON.parse(JSON.stringify(this.songlist)), len = songlist.length
            while (len) {
                let random = parseInt(Math.random() * len)
                // 洗牌算法
                // 方法1
                Array.prototype.splice.call(songlist, len - 1, 1, ...Array.prototype.splice.call(songlist, random, 1, songlist[len - 1]))
                // 方法2  [a, b] = [b ,a]
                len--
            }
            return songlist
        },
        clickLoopBtn () {
            if (!this.songlist || this.songlist.length === 0) return 
            let loopType = this.$store.getters.loopType
            switch (loopType) {
                case 'shunxubofang':
                    this.$store.commit('SET_LOOPTYPE', 'icon--')
                    this.loopType = 'icon--'
                    break
                case 'icon--':
                    this.$store.commit('SET_LOOPTYPE', 'danquxunhuan')
                    this.loopType = 'danquxunhuan'
                    break
                case 'danquxunhuan':
                    this.$store.commit('SET_LOOPTYPE', 'suijibofang')
                    this.loopType = 'suijibofang'
                    break
                case 'suijibofang':
                    this.$store.commit('SET_LOOPTYPE', 'shunxubofang')
                    this.loopType = 'shunxubofang'
                    break
                default:
                    this.$store.commit('SET_LOOPTYPE', 'shunxubofang')
                    this.loopType = 'shunxubofang'
            }
        },
        toggle () {
           this.playListShow = !this.playListShow
        },
        close () {
            this.playListShow = false
        },
        progressChangeForVolume (precent) {
            this.audio.volume = precent
        },
        prevBtnClick () {
            if (!this.audio || !this.audio.src) return 
            let oldIndex = this.$store.getters.currentIndex
            if (oldIndex > 0) {
                this.songChangeIndex = oldIndex - 1
            } else {
                console.log('no')
            }
        },
        nextBtnClick () {
            if (!this.audio || !this.audio.src) return 
            let oldIndex = this.$store.getters.currentIndex
            if (oldIndex < this.playlist.length - 1) {
                this.songChangeIndex = oldIndex + 1
            } else {
                console.log('no')
            }
        },
        playBtnClick () {
            if (!this.audio || !this.audio.src) return 
            this.play(!this.$store.getters.playing)
        },
        getSongUrl (songId) {
            return api.getSongUrl(songId)
        },
        getLyric (songId) {
            return api.getLyric(songId)
        },
        progressChange (precent) {
            this.isProgressChanging = false
            this.audio.currentTime = precent * this.audio.duration
            this.currentTime = this.audio.currentTime
        },
        progressChanging (precent) {
            this.isProgressChanging = true
            this.currentTime = precent * this.audio.duration
        },
        onTimeUpdate (e) {
            const currentTime = e.target.currentTime
            this.$store.commit('SET_CURRENTTIME', currentTime)
            EventBus.$emit('timeupdate')
            if (!this.isProgressChanging) this.currentTime = currentTime
        },
        _onTimeUpdate (e) {
            common.throttle(this.onTimeUpdate, 100, 0)(e)
        },
        formatForTime (time) {
            return common.formatForTime(time)
        },
        onCanPlay () {
            // index改变后, 统一由canplay进行set
            this.duration = this.audio.duration
            this.currentTime = this.audio.currentTime
            this.volume = this.audio.volume
            this.$store.commit('SET_CURRENTINDEX', this.songChangeIndex)
            this.$store.commit('SET_CURRENTSONG', this.playlist[this.songChangeIndex])
            this.play(true)
        },
        onEnded () {
            this.play(false)
            this.currentTime = 0
            if (this.currentIndex < this.playlist.length - 1) {
                this.songChangeIndex = this.currentIndex + 1
            } else if (this.currentIndex === this.playlist.length - 1) {
                if (this.isLoopPlayList) {
                    this.songChangeIndex = 0
                }
            }
        },
        play (needPlay) {
            needPlay ? this.audio.play() : this.audio.pause()
            this.$store.commit('SET_PLAYING', needPlay)
        },
        init (src) {
            if (this.audio) return new Error('audio实例已存在')
            this.audio = this.$refs.audio
            if (src) this.audio = src
            this.audio.autoplay = false
            this.audio.volume = 0.15
            this.isPlay = 'icon-bofang'
        },
        handleSongListPush (song) {
            let songlist = JSON.parse(JSON.stringify(this.songlist))
            Array.isArray(song) ? songlist.push(...song) : songlist.push(song)
            this.$store.commit('SET_SONGLIST', songlist)
        },
        setSongChangeIndex (index) {
            this.songChangeIndex = index
        },
        handleNeedPush (songid) {
            for (let i = 0; i < this.songlist.length; i++) {
                if (songid === this.songlist[i].songid) {
                    return i
                } 
            }
            return null
        },
        handleToggleSong (index) {
            this.setSongChangeIndex(index)
        }
    },
    mounted () {
        this.init()
    },
    created () {
        // 单曲播放
        EventBus.$on('song-play', (song) => {
            let needPush = this.handleNeedPush(song.songid)
            if (needPush !== null && typeof needPush === 'number') {
                this.handleToggleSong(needPush)
            } else {
                this.handleSongListPush(song)
                this.handleToggleSong(this.playlist.length - 1)
            }
        })
        // 列表播放
        EventBus.$on('song-play-all', ({songlist, index}) => {
            this.$store.commit('SET_SONGLIST', [])
            this.handleSongListPush(songlist)
            this.playlist = JSON.parse(JSON.stringify(this.songlist))
            this.handleToggleSong(index)
        })
        EventBus.$on('play-list-blur', () => this.close())
    }
}
</script>

<style lang="less">
@import '../../base/css/common.less';
@playerHeight: 750px;
@playlistItemHeight: 30px;
@miniPlayListWidth: 500px;
@miniPlayListHeight: 500px;
@miniPlayListHeaderHeight: 60px;

    .player {
        display: flex;
        align-items: center;
        background-color: @player-background-color;
        .button-group-wrapper, .volume-wrapper, .timeline-wrapper, .other-wrapper {
            height: 100%;
        }
        .button-group-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            .button-wrapper {
                cursor: pointer;
            }
            .play {
                margin: 0 20px;
            }
        }
        .volume-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 100%;
            .volumeline-progress-wrapper {
                width: 200px;
            }
        }
        .timeline-wrapper {
            display: flex;
            width: calc(~"100% - 480px");
            .time-wrapper {
                display: flex;
                align-items: center;
                .time-text {
                    display: inline-block;
                    text-align: center;
                    width: 50px;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
            .timeline-progress-wrapper {
                width: calc(~"100% - 100px - 30px");
            }
        }
        .other-wrapper {
            display: flex;
            .open-btn, .loop-btn {
                display: inline-block;
                width: 30px;
                color: #fff;
            }
        }
    }
    .mini-playlist-container {
        position: absolute;
        z-index: 10000;
        right: 0;
        bottom: 50px;
        overflow: hidden;
        width: 100%;
        height: calc(@playerHeight - 50px);
        .mask {
            width: 100%;
            height: 100%;
        }
        .mini-playlist {
            position: absolute;
            bottom: 0;
            right: 0;
            width: @miniPlayListWidth;
            height: @miniPlayListHeight;
            background-color: rgba(45, 47, 51, 1);
            box-shadow: -1px -1px rgba(255, 255, 255, .15);
            .mini-playlist-header {
                position: fixed;
                width: @miniPlayListWidth;
                height: @miniPlayListHeaderHeight;
                .close-btn-container {
                    display: flex;
                    height: 30px;
                    padding-right: 10px;
                    align-items: center;
                    justify-content: flex-end;
                    background-color: rgba(45, 47, 51, 0.5);
                }
                .total {
                    padding-left: 20px;
                    width: 100%;
                    height: @playlistItemHeight;
                    line-height: @playlistItemHeight;
                    box-sizing: border-box;
                    text-align: left;
                    font-size: 14px;
                    color: rgba(255, 255, 255, .5);
                }
            }
            .mini-playlist-main {
                position: absolute;
                top: @miniPlayListHeaderHeight;
                width: 100%;
                height: calc(@miniPlayListHeight - @miniPlayListHeaderHeight);
                overflow-y: auto;
                overflow-x: hidden;
                .mini-playlist-item {
                    display: flex;
                    width: @miniPlayListWidth;
                    height: @playlistItemHeight;
                    box-sizing: border-box;
                    color: rgba(255, 255, 255, .75);
                    .current {
                        width: 20px;
                        height: 100%;
                        line-height: @playlistItemHeight;
                        font-size: 12px;
                        color: #b82525;
                    }
                    .mini-playlist-item-text {
                        line-height: @playlistItemHeight;
                        text-align: left;
                        &.title {
                            width: 60%;
                            font-size: 14px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        &.singer {
                            padding-left: 20px;
                            width: 40%;
                            font-size: 12px;
                        }
                    }
                }
            }
            .ie-hide-mini {
                position: absolute;
                top: @miniPlayListHeaderHeight;
                right: 0;
                height: 100%;
                width: 30px;
                background-color: rgba(45, 47, 51, 1);

            }
        }
    }
    .odd {
        background-color: rgba(255, 255, 255, 0.08);
    }
</style>
