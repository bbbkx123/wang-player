<template>
  <div
    class="slider-wrapper"
    :ref="sliderWrapperElemRef"
    :style="{
      height:
        (typeof height === 'number' ? `${height}px` : height) || undefined,
    }"
  >
    <div class="slider" :ref="sliderRef">
      <div class="slider-group" :ref="sliderGroupRef">
        <slot name="children"></slot>
      </div>
      <div v-if="mode === 'list-detail'" class="pullup-tips">
        <div v-if="beforePullUp" class="before-trigger">
          <span class="pullup-txt">Pull up and load more</span>
        </div>
        <div v-else class="after-trigger">
          <span class="pullup-txt">Loading...</span>
        </div>
      </div>
    </div>
    <div v-if="mode === 'banner' && dots.length > 0" class="dots">
      <div
        v-for="(dot, index) in dots"
        :key="index"
        :class="['dots-item', currentPageIndex === index ? 'active' : '']"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, shallowReactive, watch } from "vue";
import Toast from "vant/es/toast";
import "vant/es/toast/style";
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import PullUp from "@better-scroll/pull-up";
import Slide from "@better-scroll/slide";

export default defineComponent({
  setup(props: any, { slots }) {
    const scroll: any = slots.default;
    let _children = scroll();
    _children = _children[0].children;
    const children = reactive(_children)
    const instance = ref<any>({ excuting: false });
    const sliderRef = ref<any>({});
    const sliderGroupRef = ref<any>({});
    const sliderWrapperElemRef = ref<any>({});
    const currentPageIndex = ref<number>(0);
    const dots = ref<any[]>([]);
    const beforePullUp = ref<boolean>(true);

    const initial = () => {
      if (children.length === 0) return;
      if (props.mode === "banner") BScroll.use(Slide);
      if (props.mode === "list-detail") {
        const use: any = BScroll.use;
        use(PullDown);
        use(PullUp);
      }
      instance.value = {
        ...instance.value,
        bscroll: new BScroll(sliderRef.value, props.config.bscroll),
      };
      const bscroll = instance.value.bscroll;
      const hooks = bscroll.scroller.actionsHandler.hooks;
      hooks.on("click", (event: any) => props.click && props.click());
      if (props.mode === "banner") {
        bscroll.on("slideWillChange", (page: any) => {
          currentPageIndex.value = page.pageX;
        });
      }

      // 问题: 没有进行事件解绑
      if (
        props.mode === "list-detail" &&
        props.pullDown &&
        props.fetchDataForPullUp
      ) {
        bscroll.on("pullingDown", () => props.pullDown(bscroll));

        bscroll.on("pullingUp", async () => {
          beforePullUp.value = false;
          let res = await props.fetchDataForPullUp();
          if (!res.success) {
            Toast.fail({ message: res.msg });
            bscroll.finishPullUp();
          } else {
            bscroll.finishPullUp();
            bscroll.refresh();
          }
          beforePullUp.value = true;
        });
      }
    };

    const setSliderWidth = () => {
      let elRefSlider = sliderRef.value;
      let elRefSliderGroup = sliderGroupRef.value;
      let children = elRefSliderGroup.children;
      let sliderWidth = elRefSlider.clientWidth;

      const marginLeft = 10;
      if (props.mode === "banner") {
        dots.value = Array.from({ length: 10 }).map((item) => true);
      }
      for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i];
        child.props.class += "slider-item";
        if (props.mode === "normal-scroll-x") {
          // 添加margin-left: 5px, 用于隔开
          child.props.class += "margin";
          child.props.style.width =
            typeof props.width === "number" ? `${props.width}px` : props.width;
        }
      }
      if (props.mode === "banner") {
        elRefSliderGroup.style.width = `${sliderWidth * children.length}px`;
      } else if (props.mode === "normal-scroll-x") {
        const childClientWidth = children[0].children[0].clientWidth;
        elRefSliderGroup.style.width = `${
          (childClientWidth + marginLeft) * children.length
        }px`;
      }
    };

    const setSliderHeight = () => {
      sliderRef.value.style.height =
        sliderWrapperElemRef.value.clientHeight + "px";
    };

    watch(children, (newVallue, oldValue) => {
      debugger
      initial()
    })

    return {
      sliderRef,
      sliderGroupRef,
      sliderWrapperElemRef,
      currentPageIndex,
    };
  },
});
</script>

<style lang="less">
@import "./index.less";
</style>
