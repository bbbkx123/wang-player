<template>
  <div v-if="show">
    Recommend
    <Scroll v-if="bannerArr.length > 0" mode="banner" config={{ bscroll: define.sliderConf }} width="100%">
      <img v-for="(banner, index) in bannerArr" :key="`banner-${index}`" :style="{ width: '100%', height: 140 }" :src="`${banner.imageUrl}?param=375y140`" alt="" />
    </Scroll>
  </div>
</template>

<script lang="ts">
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { defineComponent, onMounted, ref, onBeforeMount } from "vue";
import * as api from "@/service";
import Scroll from "@/components/Scroll/index.vue";

export default defineComponent({
  components: { Scroll },
  setup() {
    const show = ref(true);
    const router = useRouter();
    const bannerArr = ref<any[]>([])

    onBeforeRouteLeave((to, from, next) => {
      show.value = false;
      next();
    });

    onBeforeMount(() => {
      Promise.all([
        api.getBanner(0),
        api.getPersonalized(6),
        api.getNewSong(6),
      ]).then(([res1, res2, res3]) => {
        // const data = res3.data.result.map((item: any) => formatForNewSongList(item))
        // setBannerArr(res1.data.banners)
        // setPersonalize(res2.data.result)
        // setNewSongList(data)
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => resolve(true), 1000)
        // })
        bannerArr.value = res1.data.banners

      });
    });

    return {
      show,
      bannerArr,
    };
  },
});
</script>

<style lang="less">
</style>