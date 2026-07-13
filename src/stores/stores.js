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
    // GET /api/user 不带参数，后端通过 token 识别用户
    try {
      const res = await auth.selectuserdate()
      if (res.code === 200 && res.data) {
        userDate.value = res.data
        return userDate.value
      }
    } catch (e) {
      console.error('获取用户信息失败:', e)
    }

    // 回退：调用 /me
    try {
      const res = await auth.selectuserId()
      if (res.code === 200 && res.data) {
        if (typeof res.data === 'string') {
          userDate.value = { userName: res.data, avatarUrl: '', roleId: res.data === 'Admin' ? 1 : 2 }
        } else {
          userDate.value = res.data
        }
      }
    } catch (e) {
      console.error('获取用户信息完全失败:', e)
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