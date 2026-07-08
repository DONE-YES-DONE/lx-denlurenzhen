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
    const res = await auth.selectuserId()
    console.log('🔍 [getuserdateandid] selectuserId 原始返回:', JSON.stringify(res))
    if (res.code === 200) {
      // 后端 /me 只返回字符串（用户名/角色名），包装为最小用户对象
      if (typeof res.data === 'string') {
        userDate.value = {
          userName: res.data,
          avatarUrl: '',
          roleId: res.data === 'Admin' ? 1 : 2
        }
      } else if (res.data) {
        userDate.value = res.data
      }
      console.log('🔍 [getuserdateandid] userDate 已赋值:', JSON.stringify(userDate.value))
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