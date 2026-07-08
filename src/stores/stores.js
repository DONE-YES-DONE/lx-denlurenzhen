import auth from '@/api/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  //token
  const token = ref(localStorage.getItem('token')||'')
  //是否已经登陆
  const isAuthenticated = ref(!!token.value)
  //用户信息
  const userDate = ref(null)
  //用户id
  const userId = ref(null)

  //设置token
  function setToken(newToken){
    token.value = newToken
    isAuthenticated.value = true
    localStorage.setItem('token',newToken)

    const expireTime = Date.now() + 2 * 60 * 60 * 1000  // 2小时 = 7200000毫秒
    localStorage.setItem('tokenExpireTime', expireTime)
  }

  //查询用户信息
  async function getuserdateandid(){
    // 从 JWT token 中解析用户 ID
    let userId = null
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      userId = payload.id || payload.userId || payload.user_id || payload.sub
      console.log('🔍 [getuserdateandid] JWT userId:', userId)
    } catch (e) {
      console.warn('🔍 [getuserdateandid] JWT 解析失败:', e.message)
    }

    if (userId) {
      // GET /api/user?id=userId，拦截器自动带 token header
      try {
        const res = await auth.selectuserdate(userId)
        console.log('🔍 [getuserdateandid] selectuserdate 返回:', JSON.stringify(res))
        if (res.code === 200 && res.data) {
          userDate.value = res.data
          console.log('🔍 [getuserdateandid] userDate 已赋值:', JSON.stringify(userDate.value))
          return userDate.value
        }
      } catch (e) {
        console.error('🔍 [getuserdateandid] selectuserdate 失败:', e)
      }
    }

    // 回退：调用 /me
    try {
      const res = await auth.selectuserId()
      console.log('🔍 [getuserdateandid] selectuserId 回退:', JSON.stringify(res))
      if (res.code === 200 && res.data) {
        if (typeof res.data === 'string') {
          userDate.value = { userName: res.data, avatarUrl: '', roleId: res.data === 'Admin' ? 1 : 2 }
        } else {
          userDate.value = res.data
        }
        console.log('🔍 [getuserdateandid] userDate(回退) 已赋值:', JSON.stringify(userDate.value))
      }
    } catch (e) {
      console.error('🔍 [getuserdateandid] 获取用户信息完全失败:', e)
    }
    return userDate.value
  }

  //退出登陆
  function logout(){
    token.value = ''
    userDate.value = null
    userId.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {token,userId,userDate,isAuthenticated,setToken,logout,getuserdateandid}
})