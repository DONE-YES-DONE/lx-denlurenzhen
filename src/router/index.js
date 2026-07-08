import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/stores.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: (to) => {
                const authStore = useAuthStore()
                if (authStore.isAuthenticated) {
                    return '/home'
                }else{
                    return '/Landing'
                }
            }//跳转首页
    },
    {
      //起始页
      path: '/Landing',
      name: 'Landing',
      component: () => import('../views/Landing.vue')
    },
    {
      //登录页
      path: '/login',
      name: 'Login',
      component: () => import('../views/zhuyemian/login.vue')
    },
    {
      //注册页
      path: '/register',
      name: 'register',
      component: () => import('../views/zhuyemian/Register.vue')
    },
    {
      //重置密码页
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/zhuyemian/ResetPassword.vue')
    },
    {
      // 二维码溯源页（无需登录）
      path: '/qr/:batchNo?/:rollNo?',
      name: 'qr',
      component: () => import('../views/ziyemian/Qrcode.vue')
    },
    {
      //主页
      path: '/home',
      redirect: '/home/Dashboard',
      name: 'Home',
      component: () => import('../views/ziyemian/Home.vue'),
      meta: { requiresAuth: true },//标记
      children: [
        {
          path: 'Dashboard',
          name: 'Dashboard',
          component: () => import('../views/ziyemian/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'device',
          name: 'device',
          component: () => import('../views/ziyemian/device.vue'),
          meta: { requiresAuth: true }//标记
        },
        {
          path: 'wirematerial',
          name: 'wirematerial',
          component: () => import('../views/ziyemian/wirematerial.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'defect',
          name: 'defect',
          component: () => import('../views/ziyemian/defect.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'scenario',
          name: 'scenario',
          component: () => import('../views/ziyemian/scenario.vue'),
          meta: { requiresAuth: true }//标记
        },
        {
          path: 'ai',
          name: 'ai',
          component: () => import('../views/ziyemian/AiAssistant.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'settings',
          name: 'UserSettings',
          component: () => import('../views/setting/UserSettings.vue')
        }
      ]
    }
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const expireTime = localStorage.getItem('tokenExpireTime')

  //  检查 token 是否过期
  if (token && expireTime) {
    const isExpired = Date.now() > parseInt(expireTime)
    
    if (isExpired) {
      // 过期了，清除所有数据
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpireTime')
      
      // 跳转到登录页
      next('/login')
      return
    }
  }
  // 去需要登录的页面但没 token
  if (to.meta.requiresAuth && !token) {
    next('/login')
  }
  // 去登录页但已经登录了
  else if (to.path === '/login' && token) {
    next('/home')
  }
  else {
    next()
  }
})

export default router