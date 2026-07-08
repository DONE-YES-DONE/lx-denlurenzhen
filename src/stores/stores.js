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
    console.log('🔍 [getuserdateandid] res.code:', res.code, 'res.data keys:', res.data ? Object.keys(res.data) : 'null')
    if (res.code === 200 && res.data) {
      userDate.value = res.data
      console.log('🔍 [getuserdateandid] userDate 已赋值:', JSON.stringify(userDate.value))
      // 如果API没返回roleId，尝试从JWT解析
      if (userDate.value.roleId == null && userDate.value.role == null) {
        try {
          const payload = JSON.parse(atob(token.value.split('.')[1]))
          userDate.value.roleId = payload.roleId || payload.role_id || payload.role
        } catch {}
      }
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