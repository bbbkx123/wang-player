<template>
  <div class="layouts">
    <van-nav-bar
      title="标题"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <transition :name="transitionName">
      <router-view class="router-view" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { useStore } from "vuex";
import NavBar from "vant/es/nav-bar";
import "vant/es/nav-bar/style";

export default defineComponent({
  components: {
    [NavBar.name]: NavBar,
  },
  setup() {
    const transitionName = ref("slide-left");
    const router = useRouter();
    const store = useStore()

    onBeforeRouteUpdate((to, from, next) => {
      debugger;
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      transitionName.value = toDepth < fromDepth ? "slide-right" : "slide-left";
      next();
    });

    const onClickLeft = reactive(() => {
      router.push({ name: "PlayListDetails" });
    });
    const onClickRight = reactive(() => {
      router.push({ name: "PlayPage" });
    });

    return {
      transitionName,
      onClickLeft,
      onClickRight,
    };
  },
});
</script>


<style lang="less">
@style-background-color: black;
@style-color: #fff;

.layouts {
  // position: relative;
  // height: 100%;
  // background-color: @style-background-color;
  // color: @style-color;
  // .router-view {
  //   height: calc(100% - 45px);
  //   padding: 0 10px;
  //   // background-color: black;
  //   overflow: hidden;
  // }
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>
