<template>
  <div class="song-page-container">
    <div class="song-page-backgorund"></div>
    <div class="player-main">
      <div class="left-container">
        <div class="poster-container">
          <div class="poster" ref="poster">
            <img v-if="song" :src="song.picture + '?param=325y325'" alt="">
            <div v-else>加载中...</div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div class="right-main-container">
          <div v-if="song" class="song-info-container">
            <div class="title">{{song.title}}</div>
            <div class="other">
              <span class="album">
                <span style="color: rgba(255,255,255,0.7);">专辑: </span>{{song.album}}</span>
              <span class="singer">
                <span style="color: rgba(255,255,255,0.7);">歌手: </span>{{song.singer}}</span>
            </div>
          </div>
          <div ref="lyricView" class="lyricList-container">
            <ul ref="lyricList" class="lyric-list" v-if="textArr.length > 0">
              <li class="lyric-text" :class="{'lyric-text-ative': currentLineNum === tIndex}" v-for="(text, tIndex) in textArr" :key="tIndex">
                <div v-if="hasTranslationLyric">
                  <span>{{text[0]}}</span><br>
                  <span>{{text[1]}}</span>
                </div>
                <div v-else>
                  <span>{{text}}</span>
                </div>
              </li>
            </ul>
            <ul v-else>暂无歌词</ul>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-container">
      <CommentList></CommentList>
    </div>
  </div>  
</template>
<script>
import EventBus from '../../base/util/EventBus'
// import * as common from '../../../base/util/common'

const LYRIC_VIEW = 400
const INITIAL_TOP = 100
export default {
  data () {
    return {
      deg: 0,
      originalLyircObj: {},
      translationLyricObj: {},
      viewLyricObj: {},

      timeArr: [],
      textArr: [],
      currentLineNum: 0,
      move: null,
      hasOriginalLyric: true,
      hasTranslationLyric: true

    }
  },
  watch: {
    currentTime (val) {
      if (val) {
        this.currentLineNum = this.getCurrentLineNum(parseFloat(val))
      }
    },
    currentLineNum (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.scroll(newValue)
      }
    },
    currentIndex (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.reset()
        this.setMoveLength()
        this.lyricLoad()
      }
    } 
  },
  computed: {
    song () {
      return this.$store.getters.currentSong
    },
    playing () {
      return this.$store.getters.playing
    },
    originalLyricString () {
      if (this.$store.getters.lyric && this.$store.getters.lyric.lrc && this.$store.getters.lyric.lrc.lyric) {
        return this.$store.getters.lyric.lrc.lyric 
      } else {
        return null
      }
    },
    translationLyricString () {
      if (this.$store.getters.lyric && this.$store.getters.lyric.tlyric && this.$store.getters.lyric.tlyric.lyric) {
        return this.$store.getters.lyric.tlyric.lyric 
      } else {
        return null
      }
    },
    currentTime () {
      return this.$store.getters.currentTime
    },
    currentIndex () {
      return this.$store.getters.currentIndex
    }
  },
  methods: {
    rotate (deg) {
      if (this.$refs.poster && this.$refs.poster.style) {
        this.$refs.poster.style.transform = `rotate(${deg}deg)`
      }
    },
    scroll (lineNum) {
      if (this.$refs.lyricList && this.$refs.lyricList.style) {
        let temp = -this.move * (lineNum + 1)
        this.$refs.lyricList.style.top = `${temp + INITIAL_TOP}px`
      }
    },
    reset () {
      this.$nextTick(() => {
        if (this.$refs.lyricList && this.$refs.lyricList.style) {
          this.$refs.lyricList.style.top = `${INITIAL_TOP}px`
        } 
      })
    },
    // 将数据处理成标准的时间格式
    getLyricTimeArr () {
      let temp = Object.keys(this.viewLyricObj)
      return temp.map((time) => this.getSeconds(time))
    },
    getLyricTextArr () {
      let temp = []
      for (let key in this.viewLyricObj) {
        temp.push(this.viewLyricObj[key])
      }
      return temp
    },
    getLyricObj (LyricString) {
      if (!LyricString) return null
      let obj = {}
      let timeArr = LyricString.match(/\[\d{2}:\d{2}\.\d{2,}\]/gm)
      // 首先将非时间的'[...]'去除, 在将换行符\n去除, 切分为数组
      let textArr = LyricString.replace(/^((?!\[\d{2}:\d{2}\.\d{2,}\]).)*/gm, '').replace(/\n/gm, ';').split(';')
      for (let i = 0; i < textArr.length; i++) {
        if (textArr[i] === '') textArr.splice(i--, 1)
      }
      textArr.length -= 1
      // 将时间 '[00:00.xxxx]' 去除
      textArr = textArr.map((item) => item.replace(/\[\d{2}:\d{2}\.\d{2,}\]/, ''))
      textArr.forEach((text, i) => {
        obj[timeArr[i]] = text
      })
      // !保证所有处理后的lyricObj数据长度一致
      return obj
    },
    lyricHandlerForView (origin, other) {
      let obj = {}
      for (let key in other) {
        obj[key] = [origin[key], other[key]]
      }
      return obj
    },
    getSeconds (format) {
      let temp = format.slice(1, format.length - 1)
      if (temp.search(/\d{2}:\d{2}\.\d{2,}/) < 0) return format
      let arr = temp.replace(':', ',').replace('.', ',').split(',')
      return parseInt(arr[0] * 60) + parseInt(arr[1]) + parseFloat(arr[2] / 1000)
    },
    getCurrentLineNum (time) {
      for (let i = 0; i < this.timeArr.length; i++) {
        if (
          (this.timeArr[i] < time && time < this.timeArr[i + 1]) ||
          (this.timeArr[i] === time)
        ) {
          return i
        } else if (time > this.timeArr[this.timeArr.length - 1]) {
          return this.timeArr.length - 1
        }
      }
    },
    setMoveLength () {
      this.$nextTick(() => {
        if (this.$refs.lyricList && this.$refs.lyricView) {
          let listHeight = this.$refs.lyricList.clientHeight
          let lyricViewHeight = this.$refs.lyricView.clientHeight
          // 加INITIAL_TOP: 初始下沉200, 添加后补平; 加LYRIC_VIEW / 2 : 回到视图中部
          this.move = (listHeight - lyricViewHeight + INITIAL_TOP + LYRIC_VIEW / 2) / this.timeArr.length
        }
      })
    },
    lyricLoad () {
      let hasOriginalLyric = true
      let hasTranslationLyric = true
      // 当没有'原始歌词'时
      if (!this.originalLyricString) {
        hasOriginalLyric = false
        this.hasOriginalLyric = hasOriginalLyric
        return 
      }
      // 处理'原始歌词'
      this.originalLyircObj = this.getLyricObj(this.originalLyricString)
      // 当没有'其他歌词'(翻译, 罗马音等...)
      if (!this.translationLyricString) {
        hasTranslationLyric = false
        this.hasTranslationLyric = hasTranslationLyric
      }
      // 处理'其他歌词'
      this.translationLyricObj = this.getLyricObj(this.translationLyricString)
      // 处理'显示歌词'
      if (!this.hasTranslationLyric) {
        this.viewLyricObj = this.originalLyircObj
      } else {
        this.viewLyricObj = this.lyricHandlerForView(this.originalLyircObj, this.translationLyricObj)
      }
      // console.log(this.viewLyricObj)
      this.timeArr = this.getLyricTimeArr()
      this.textArr = this.getLyricTextArr()
    }
  },
  mounted () {
    this.setMoveLength()
  },
  created () {
    this.lyricLoad()
    EventBus.$on('timeupdate', () => {
      this.deg += 3
      this.rotate(this.deg)
    })
  }
}
</script>

<style lang="less">
@import '../../base/css/common.less';
  .song-page-container {
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    height: 650px;
    // background-color: rgba(25, 27, 31);
    background-color: @main-background-color;
    color: #ffffff;
    /* 图片透明 */
    /* filter: opacity(50%); */
    .song-page-backgorund {
      position: absolute;
      filter: blur(2px);
    }
    .player-main {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      .left-container, .right-container {
        display: flex;
        justify-content: center;
        width: 50%;
        height: 100%;
      }
      .left-container {
        .poster-container {
          margin-top: 75px;
          width: 325px;
          height: 325px;
          .poster {
            transition: all linear 0.25s;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 50%;
          }
        }
      }
      .right-container {
        position: relative;
        width: 50%;
        height: 100%;
        .right-main-container {
          position: absolute;
          left: 0;
          display: flex;
          flex-direction: column;
          width: 80%;
          height: 100%;
        }
        .song-info-container {
          margin-top: 50px;
          .title {
            margin-bottom: 15px;
            font-size: 22px;
          }
          .other {
            margin-bottom: 25px;
            width: 400px;
            font-size: 14px;
            color: #b82525;
            .album, .singer {
              display: inline-block;
              width: 150px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        .lyricList-container {
          overflow: hidden;
          height: 400px;
          .lyric-list {
            transition: top linear .3s;
            position: relative;
            top: 200px;
            color: rgba(255, 255, 255, 0.4);
            .lyric-text {
              display: block;
              margin-bottom: 15px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              height: 32px;
              font-size: 15px;
              &.lyric-text-ative {
                color: rgba(255, 255, 255, 1);
              }
            }
          }
        }
      }
    }
    .comment-container {
      padding: 0 150px;
    }
  }
</style>
