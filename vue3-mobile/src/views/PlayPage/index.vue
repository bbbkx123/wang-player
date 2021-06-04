<template>
  <div v-if="show" class="play-page">PlayPage</div>
</template>

<script lang="ts">
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const show = ref(true)
    const router = useRouter()

    onBeforeRouteLeave((to, from, next) => {
      show.value = false
      next()
    })

    return {
      show,
    }
  },
})
</script>

<style lang="less">
.play-page {
  background-color: red;
}
</style>