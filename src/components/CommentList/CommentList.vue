<template>
  <div class="comment-list">
    <div>
      <div class="label">热门评论</div>
      <div v-for="(hot, index) in comment.hotComments" :key="index" class="comment-item-container">
        <div class="avatar-container">
          <div class="avatar" :style="{backgroundImage: `url(${hot.user.avatarUrl}?param=35y35)`}"></div>
        </div>
        <div class="comment-item-main-container">
          <div class="comment">
            <span class="nickname">{{`${hot.user.nickname} : `}}</span>
            {{hot.content}}
          </div>
          <div class="other">
            <div class="time">{{format(hot.time)}}</div>
            <div class="like">
              <i class="iconfont icon-dianzan"></i>({{hot.likedCount}})
            </div>
          </div>
        </div>
      </div>
      <div class="label">最新评论</div>
      <div v-for="(comment, index) in comment.comments" :key="index" class="comment-item-container">
        <div class="avatar-container">
          <div class="avatar" :style="{backgroundImage: `url(${comment.user.avatarUrl}?param=35y35)`}"></div>
        </div>
        <div class="comment-item-main-container">
          <div class="comment">
            <span class="nickname">{{`${comment.user.nickname} : `}}</span>
            {{comment.content}}
          </div>
          <div class="other">
            <div class="time">{{format(comment.time)}}</div>
            <div class="like">
              <i class="iconfont icon-dianzan"></i>({{comment.likedCount}})
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page"> 
      <Page :total="page.total" :number="page.pageNumber" :size="page.pageSize"></Page>
    </div>
  </div>
  
</template>

<script>
import * as api from 'api'
import * as common from 'base/util/common'
import EventBus from 'base/util/EventBus'

const LIMIT = 20
export default {
  data () {
    return {
      page: {
        pageSize: LIMIT,
        pageNumber: 1,
        total: null
      },
      comment: {
        hotComments: [],
        comments: []
      }
    }
  },
  computed: {
    songid () {
      return this.$store.getters.songlist[this.$store.getters.currentIndex].songid
    }
  },
  watch: {
    songid: {
      handler: function (newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.getMusicComment(newValue)
        }
      },
      immediate: true
    },
    'page.pageNumber' (val) {
      this.getMusicComment(this.songid)
    }
  },
  methods: {
    getMusicComment (id, before) {
      let limit = LIMIT, offset = (this.page.pageNumber - 1) * limit
      api.getMusicComment(id, limit, offset, before).then((res) => {
        if (res.data.code !== 200) return 
        this.page.total = res.data.total
        this.comment = {hotComments: res.data.hotComments, comments: res.data.comments}
      })
    },
    format (timestamp) {
      return common.formatDate(timestamp)
    }
  },
  created () {
    EventBus.$on('change-page-number', (pageNumber) => {
      this.page.pageNumber = pageNumber
    })
  }
}
</script>

<style lang="less">
  @commentItemWidth: 500px;
  @commentItemMinHeight: 75px;
  
  @commentItemPaddingTop: 25px;

  @avatarSize: 35px;
  .comment-list {
    .comment-item-container {
      display: flex;
      width: @commentItemWidth;
      min-height: @commentItemMinHeight;
      box-sizing: border-box;
      border-top: 1px solid rgba(255, 255, 255, .1);
      color: rgba(255, 255, 255, .7);
      .avatar-container {
        padding-top: @commentItemPaddingTop;
        .avatar {
          width: @avatarSize;
          height: @avatarSize;
          border-radius: 50%;
        }
      }
      .comment-item-main-container {
        margin-left: 20px;
        padding-top: @commentItemPaddingTop;
        width: calc(100% - @avatarSize);
        .comment {
          line-height: 20px;
          text-align: left;
          font-size: 13px;
          .nickname {
            display: inline-block;
            font-size: 12px;
            color: rgba(65,105,225, 1);
          }
        }
        .other {
          padding: 5px 0;
          display: flex;
          font-size: 14px;
          .time {
            width: 50%;
            text-align: left;
          }
          .like {

          }
        }
      }
    }
    .label {
      width: 100%;
      padding: 10px 0;
      text-align: left;
    }
  }
</style>
