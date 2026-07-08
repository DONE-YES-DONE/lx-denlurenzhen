<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/stores'

const authStore = useAuthStore()

// 页面一加载就检查
onMounted(() => {
  // 如果已经登录，但还没有用户信息，就去获取
  if (authStore.isAuthenticated && !authStore.userDate) {
    authStore.getuserdateandid().catch(err => {
      console.error('获取用户信息失败', err)
    })
  }
})
</script>
<style>
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.2s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }
</style>
