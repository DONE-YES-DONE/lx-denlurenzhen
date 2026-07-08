<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>用户设置</h2>
      <p>管理账户信息、密码及用户权限</p>
    </div>

    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- ========== 用户信息 ========== -->
      <el-tab-pane label="用户信息" name="info">
        <div class="form-card">
          <!-- 头像 + 名称 醒目区域 -->
          <div class="profile-header">
            <div class="profile-avatar">
              <img v-if="authStore.userDate?.avatarUrl && !avatarLoadError" :src="authStore.userDate.avatarUrl" class="profile-avatar-img" @error="avatarLoadError = true" />
              <span v-else class="profile-avatar-letter">{{ (authStore.userDate?.userName || 'U').charAt(0).toUpperCase() }}</span>
            </div>
            <div class="profile-names">
              <span class="profile-username">{{ authStore.userDate?.userName || '—' }}</span>
              <el-tag :type="isRoot ? 'danger' : ''" size="small">{{ isRoot ? '管理员' : '普通用户' }}</el-tag>
            </div>
          </div>
          <el-divider />
          <el-descriptions :column="2" border size="small" style="max-width: 600px">
            <el-descriptions-item label="用户ID">{{ authStore.userDate?.id || '—' }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ authStore.userDate?.userName || '—' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ authStore.userDate?.email || '—' }}</el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag :type="isRoot ? 'danger' : 'info'" size="small">{{ isRoot ? '管理员' : '普通用户' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>

      <!-- ========== 修改密码 ========== -->
      <el-tab-pane label="修改密码" name="password">
        <div class="form-card">
          <el-form
            ref="pwdFormRef"
            :model="pwdForm" :rules="pwdRules"
            label-width="100px" style="max-width: 450px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="pwdLoading" @click="handleChangePassword">确认修改</el-button>
              <el-button @click="resetPwdForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- ========== 修改用户名 ========== -->
      <el-tab-pane label="修改用户名" name="username">
        <div class="form-card">
          <el-form
            ref="nameFormRef"
            :model="nameForm" :rules="nameRules"
            label-width="100px" style="max-width: 450px"
          >
            <el-form-item label="当前用户名">
              <span class="info-text">{{ authStore.userDate?.userName || '—' }}</span>
            </el-form-item>
            <el-form-item label="新用户名" prop="userName">
              <el-input v-model="nameForm.userName" placeholder="请输入新用户名" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="nameLoading" @click="handleChangeName">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/stores'
import { requestUser } from '@/api/requst'

// ==================== 基础 ====================
const authStore = useAuthStore()
const activeTab = ref('info')
const avatarLoadError = ref(false)
const isRoot = computed(() => {
  const u = authStore.userDate
  if (!u) return false
  return u.roleId == 1 || u.role_id == 1 || u.role == 1 || u.userRole == 1
})

onMounted(async () => {
  if (!authStore.userDate) {
    await authStore.getuserdateandid()
  }
})

// ==================== 修改密码 ====================
const pwdFormRef = ref(null)
const pwdLoading = ref(false)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const validateConfirm = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) callback(new Error('两次输入的新密码不一致'))
  else callback()
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }, { min: 6, message: '不少于6位', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '不少于6位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { validator: validateConfirm, trigger: 'blur' }]
}

const handleChangePassword = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (!valid) return
    pwdLoading.value = true
    try {
      // PUT /api/user/password?oldPassWord=xxx&newPassWord=xxx
      const res = await requestUser.put('/password', null, {
        params: {
          oldPassWord: pwdForm.oldPassword,
          newPassWord: pwdForm.newPassword
        }
      })
      if (res.data?.code === 200) {
        ElMessage.success('密码修改成功')
        pwdFormRef.value.resetFields()
      } else {
        ElMessage.error(res.data?.message || '密码修改失败')
      }
    } catch (e) {
      ElMessage.error('密码修改失败，请稍后重试')
    }
    pwdLoading.value = false
  })
}

const resetPwdForm = () => pwdFormRef.value?.resetFields()

// ==================== 修改用户名 ====================
const nameFormRef = ref(null)
const nameLoading = ref(false)
const nameForm = reactive({ userName: '' })

const nameRules = {
  userName: [
    { required: true, message: '请输入新用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ]
}

const handleChangeName = async () => {
  if (!nameFormRef.value) return
  await nameFormRef.value.validate(async (valid) => {
    if (!valid) return
    nameLoading.value = true
    try {
      const res = await requestUser.put('/username', null, { params: { username: nameForm.userName } })
      if (res.data?.code === 200) {
        ElMessage.success('用户名修改成功')
        nameFormRef.value.resetFields()
        await authStore.getuserdateandid()
      } else {
        ElMessage.error(res.data?.message || '修改失败')
      }
    } catch (e) {
      ElMessage.error('用户名修改失败，请稍后重试')
    }
    nameLoading.value = false
  })
}

</script>

<style scoped>
.settings-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}
.settings-header { margin-bottom: 24px; }
.settings-header h2 { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.settings-header p { font-size: 14px; color: #6b7280; margin: 0; }

.settings-tabs {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.form-card { padding: 20px 0; }

.info-text { font-size: 14px; color: #6b7280; }

/* 个人信息头部 */
.profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
.profile-avatar { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.profile-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar-letter {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 28px; font-weight: 700;
}
.profile-names { display: flex; flex-direction: column; gap: 6px; }
.profile-username { font-size: 20px; font-weight: 700; color: #1f2937; }

</style>
