<template>
  <div style="padding: 50px; text-align: center;">
    <h1>🎉 登录成功！欢迎来到主页</h1>
    <p style="font-size: 18px; margin: 20px 0;">
      当前用户：{{ authStore.user?.user_name }}
    </p>
    <p style="color: #666; margin-bottom: 30px;">
      Token：{{ authStore.user?.token }}
    </p>
    <el-button type="danger" @click="handleLogout">退出登录</el-button>
  </div>
  <div>
    <el-form :model="updatausernamefrom" label-width="80px">
      <el-form-item label="修改">
        <el-input 
          v-model="updatausernamefrom.username" 
          placeholder="请输入修改的用户名" 
        />
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          style="width: 100%" 
          @click="handupdateusername" 
          :loading="loading"
        >
          {{ loading ? '修改中...' : '修改' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 错误提示 -->
    <el-alert 
      v-if="error" 
      :title="error" 
      type="error" 
      show-icon 
      style="margin-top: 20px;"
      :closable="false"
    />
  </div>
  <div>
    <el-form :model="selectuserdatefrom" label-width="80px">
      <el-form-item label="查询">
        <el-input 
          v-model="selectuserdatefrom.userid" 
          placeholder="请输入查询的用户名" 
        />
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          style="width: 100%" 
          @click="handselectuserdate" 
          :loading="loading"
        >
          {{ loading ? '查询中...' : '查询' }}
        </el-button>
        <div v-if="userInfo">
          <p>用户名：{{ userInfo.userName }}</p>
          <p>邮箱：{{ userInfo.email }}</p>
        </div>
      </el-form-item>
    </el-form>

    <!-- 错误提示 -->
    <el-alert 
      v-if="error" 
      :title="error" 
      type="error" 
      show-icon 
      style="margin-top: 20px;"
      :closable="false"
    />
  </div>
  <button @click="tiaozhuan">device</button>
  <button @click="tiaozhuan1">wirematerial</button>
  <button @click="tiaozhuan2">scenario</button>
  <p>{{ authStore.userDate?.userName }}</p>
  <p>用户名：{{ authStore.userDate?.userName }}</p>
  <p>邮箱：{{ authStore.userDate?.email }}</p>
  <p>用户ID：{{ authStore.userDate?.id }}</p>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/stores'
import { ref } from 'vue'
import auth from '@/api/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)//控制按钮点击true就禁用
const error = ref('')//提示错误信息
const userInfo = ref(null)//用户存储数据

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
//修改用户名的表单
const updatausernamefrom = ref({
  username:''
})
//查询用户的数据
const selectuserdatefrom = ref({
  userid:''
})
const handupdateusername = async ()=>{
  loading.value = true
  error.value = ''
  try{
    const response = await auth.updateUsername(
    updatausernamefrom.value.username
    )
    if(response.code === 200){
      ElMessage.success('修改成功')
    }else{
      ElMessage.error(response.message || '修改失败')
    }
  }catch(err){
    ElMessage.error(err.message || '网络请求失败')
  }
  finally{
    loading.value = false
  }
}
//根据id查询用户数据
const handselectuserdate = async ()=> {
  loading.value = true
  error.value = ''
  try{
    const response = await auth.selectuserdate(
      selectuserdatefrom.value.userid
    )
    if(response.code === 200){
      ElMessage.success('查询成功')
      userInfo.value = response.data
      console.log(response)
    }else{
      ElMessage.success(response.message||'查询失败')
    }
  }catch(err){
    ElMessage.error(err.message || '网络请求失败')
  }finally{
    loading.value = false
  }
}
//跳转router.push('/device')
const tiaozhuan = async ()=> {
  router.push('/device')
}
const tiaozhuan1 = async ()=> {
  router.push('/wirematerial')
}
const tiaozhuan2 = async ()=> {
  router.push('/scenario')
}


  
</script>