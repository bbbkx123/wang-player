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
import { useRouter } from "vue-router";
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

    const onClickLeft = reactive(() => {
      transitionName.value = "slide-right"
      router.push("/");
    });
    const onClickRight = reactive(() => {
      transitionName.value = "slide-left"
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
@time: 500ms;

.layouts {
  position: relative;
  height: 100%;
  background-color: @style-background-color;
  color: @style-color;
  .router-view {
    position: absolute;
    width: 100%;
    height: calc(100% - 45px);
    padding: 0 10px;
    // background-color: black;
    overflow: hidden;
  }
}


.slide-left-enter-from {
  z-index: 10;
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-enter-active {
  transition: all @time;
}

.slide-left-enter-to {
  z-index: 10;
  opacity: 1;
  transform: translateX(0%);
}

.slide-left-leave-from {
  z-index: 0;
  opacity: 1;
}

.slide-left-leave-active {
  transition: all @time;
}

.slide-left-leave-to {
  z-index: 0;
  opacity: 0;
}



.slide-right-leave-from {
  z-index: 10;
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-active {
  transition: all @time;
}

.slide-right-leave-to {
  z-index: 10;
  opacity: 0;
  transform: translateX(100%);
}

.slide-right-enter-from {
  z-index: 0;
  opacity: 0;
}

.slide-right-enter-active {
  transition: all @time;
}

.slide-right-enter-to {
  z-index: 0;
  opacity: 1;
}
</style>
