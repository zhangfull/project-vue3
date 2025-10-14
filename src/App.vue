<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useLoginStore } from '@/stores/loginStore';

const loginStore = useLoginStore()
let timer: number | undefined

onMounted(() => {

  // 每隔 8分钟 执行一次
  timer = window.setInterval(() => {
    console.log("刷新登录认证", new Date().toLocaleTimeString())
    loginStore.refreshLogin()
  }, 1000 * 60 * 8)

})

onUnmounted(() => {
  // 组件销毁时清理定时器，避免内存泄漏
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
.global-el-message {
  z-index: 99999 !important;
}
</style>