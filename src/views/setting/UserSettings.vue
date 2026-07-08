<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>用户设置</h2>
      <p>管理账户信息、密码及用户权限</p>
    </div>

    <div class="settings-body">
      <!-- 头像 + 名称 -->
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

      <!-- 双列布局 -->
      <div class="settings-grid">
        <!-- 左：基本信息 + 修改用户名 -->
        <div class="settings-card">
          <h3 class="card-title"><i class="fas fa-id-card"></i> 基本信息</h3>
          <el-descriptions :column="1" border style="margin-top: 40px;">
            <el-descriptions-item label="用户ID">{{ authStore.userDate?.id || '—' }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ authStore.userDate?.userName || '—' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ authStore.userDate?.email || '—' }}</el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag :type="isRoot ? 'danger' : 'info'" size="small">{{ isRoot ? '管理员' : '普通用户' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-divider />
          <h3 class="card-title"><i class="fas fa-user-edit"></i> 修改用户名</h3>
          <el-form ref="nameFormRef" :model="nameForm" :rules="nameRules" label-width="80px">
            <el-form-item label="新用户名" prop="userName">
              <el-input v-model="nameForm.userName" placeholder="请输入新用户名" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="nameLoading" @click="handleChangeName">保存</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 右：修改密码 -->
        <div class="settings-card">
          <h3 class="card-title"><i class="fas fa-lock"></i> 修改密码</h3>
          <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/stores'
import { requestUser } from '@/api/requst'

// ==================== 基础 ====================
const authStore = useAuthStore()
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
.settings-container { padding: 24px; background: #f5f7fa; min-height: calc(100vh - 64px); }
.settings-header { margin-bottom: 24px; }
.settings-header h2 { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.settings-header p { font-size: 14px; color: #6b7280; margin: 0; }

.settings-body { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

/* 头像 */
.profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.profile-avatar { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.profile-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar-letter { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 24px; font-weight: 700; }
.profile-names { display: flex; flex-direction: column; gap: 4px; }
.profile-username { font-size: 18px; font-weight: 700; color: #1f2937; }

/* 双列 */
.settings-grid { display: grid; grid-template-columns: 630px 480px; gap: 32px; justify-content: center; }
.settings-card { background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; }
.card-title { font-size: 15px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px; }
.card-title i { color: #6366f1; font-size: 14px; width: 20px; text-align: center; }

@media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
