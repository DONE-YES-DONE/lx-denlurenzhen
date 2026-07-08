<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-inner">
        <!-- 左侧品牌 -->
        <div class="brand">
          <div class="brand-logo">
            <img
              src="@/assets/images/logo.png"
              alt="logo"
              style="width: 70%; height: 70%; object-fit: contain;"
            >
          </div>
          <span class="brand-name">金属线材综合抽检平台</span>
        </div>

        <!-- 中间导航菜单 -->
        <nav class="nav-menu" @mouseleave="resetIndicator">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: activeMenu === item.path }"
            @mouseenter="handleHover(item.path)"
            @click="handleClick(item.path)"
          >
            {{ item.name }}
          </router-link>
          <!-- 滑动指示器 -->
          <div class="nav-indicator" ref="indicatorRef"></div>
        </nav>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <!-- 消息通知 -->
          <div class="notify-btn" :class="{ active: msgEnabled }" @click="openMsgDrawer" title="预警消息">
            <i class="fas fa-bell"></i>
            <span v-if="msgBadge > 0" class="notify-badge">{{ msgBadge > 99 ? '99+' : msgBadge }}</span>
          </div>

          <!-- 用户信息下拉（悬停式，带延迟关闭） -->
          <div class="user-dropdown" @mouseenter="showDropdownMenu" @mouseleave="hideDropdownMenu">
            <div class="user-info">
              <div class="user-avatar">
                <img v-if="userAvatar" :src="userAvatar" class="avatar-img" />
                <span v-else class="avatar-letter">{{ avatarLetter }}</span>
              </div>
              <div class="user-detail">
                <span class="user-name">{{ userName }}<span v-if="isAdmin" class="admin-badge">管理员</span></span>
                <span class="user-status">
                  <span class="status-dot"></span>
                  在线
                </span>
              </div>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: showDropdown }"></i>
            </div>

            <!-- 下拉菜单 -->
            <div class="dropdown-menu" v-show="showDropdown">
              <div class="dropdown-item" @click="showDropdown = false; router.push('/home/settings')">
                <i class="fas fa-user-cog"></i>
                用户设置
              </div>
              <div class="dropdown-item" @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i>
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 预警消息半拉框 -->
    <el-drawer
      v-model="msgDrawerVisible"
      direction="rtl"
      size="440px"
      :before-close="handleDrawerClose"
    >
      <template #title>
        <div class="msg-drawer-title">
          <i :class="msgEnabled ? 'fas fa-shield-halting' : 'fas fa-bell-slash'" :style="{ color: msgEnabled ? '#6366f1' : '#9ca3af' }"></i>
          预警消息中心
          <span v-if="msgEnabled" class="msg-pulse"></span>
        </div>
      </template>
      <div class="msg-drawer-body">
        <!-- 开关 -->
        <div class="msg-toggle-bar">
          <span class="msg-toggle-label">{{ msgEnabled ? '监控中' : '已关闭' }}</span>
          <el-switch v-model="msgEnabled" @change="onMsgToggle" :loading="msgLoading" active-text="开启" inactive-text="关闭" />
        </div>

        <!-- 刷新按钮 -->
        <div class="msg-refresh-bar" v-if="msgEnabled && !msgLoading">
          <el-button size="small" :loading="msgRefreshing" @click="fetchLatest" :icon="'Refresh'">
            {{ msgRefreshing ? '分析中...' : '获取最新分析' }}
          </el-button>
        </div>

        <!-- 分类标签 -->
        <div class="msg-cat-tabs" v-if="msgEnabled && msgList.length">
          <span class="msg-cat-tab" :class="{ active: msgCategory === 'all' }" @click="msgCategory = 'all'; msgActiveIndex = -1">
            全部 {{ msgList.length }}
          </span>
          <span class="msg-cat-tab" :class="{ active: msgCategory === 'device' }" @click="msgCategory = 'device'; msgActiveIndex = -1">
            设备 {{ catCounts.device }}
          </span>
          <span class="msg-cat-tab" :class="{ active: msgCategory === 'person' }" @click="msgCategory = 'person'; msgActiveIndex = -1">
            负责人 {{ catCounts.person }}
          </span>
          <span class="msg-cat-tab" :class="{ active: msgCategory === 'machine' }" @click="msgCategory = 'machine'; msgActiveIndex = -1">
            生产机器 {{ catCounts.machine }}
          </span>
        </div>

        <div v-loading="msgLoading" style="min-height: 200px;">
          <template v-if="filteredMsgList.length">
            <!-- 预警列表 -->
            <div
              v-for="(item, i) in filteredMsgList" :key="i"
              class="msg-item"
              :class="['msg-' + item.level, { 'msg-expanded': msgActiveIndex === i }]"
              @click="msgActiveIndex = (msgActiveIndex === i ? -1 : i)"
            >
              <div class="msg-item-head">
                <div class="msg-icon"><i :class="item.icon"></i></div>
                <div class="msg-content">
                  <div class="msg-name">{{ item.name }}</div>
                  <div class="msg-meta">
                    <span class="msg-type">{{ item.typeLabel }}</span>
                    <span class="msg-rate">不合格率 {{ item.failRate }}%</span>
                  </div>
                  <div class="msg-progress">
                    <div class="msg-progress-bar">
                      <div class="msg-progress-fill" :style="{ width: item.failRate + '%', background: rateColor(item.failRate) }"></div>
                    </div>
                  </div>
                </div>
                <span class="msg-level-tag" :class="'tag-' + item.level">{{ item.levelLabel }}</span>
                <i class="fas fa-chevron-down msg-expand-arrow" :class="{ rotated: msgActiveIndex === i }"></i>
              </div>
              <!-- 展开详情 -->
              <div class="msg-detail" v-if="msgActiveIndex === i">
                <div class="msg-detail-stats">
                  <div class="msg-detail-stat">
                    <span class="msg-detail-stat-label">不合格率</span>
                    <div class="msg-detail-progress">
                      <div class="msg-detail-progress-bar">
                        <div class="msg-detail-progress-fill" :style="{ width: item.failRate + '%', background: rateColor(item.failRate) }"></div>
                      </div>
                      <span class="msg-detail-progress-text">{{ item.failRate }}%</span>
                    </div>
                  </div>
                  <div class="msg-detail-stat-grid">
                    <div class="msg-detail-stat-item"><span>检测总数</span><strong>{{ item.totalCount }}</strong></div>
                    <div class="msg-detail-stat-item"><span>不合格数</span><strong class="fail">{{ item.failCount }}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="msgLoading" class="msg-empty">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载...</p>
          </div>
          <div v-else-if="!msgEnabled" class="msg-empty">
            <i class="fas fa-bell-slash"></i>
            <p>点击开关启动预警监控</p>
          </div>
          <div v-else-if="msgList.length" class="msg-empty">
            <i class="fas fa-filter" style="color: #9ca3af;"></i>
            <p>该分类暂无数据</p>
          </div>
          <div v-else class="msg-empty msg-empty-done">
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
            <p>暂无预警数据</p>
          </div>

          <!-- AI 分析（不受列表为空影响） -->
          <div class="msg-ai" v-if="aiAnalysisText">
            <div class="msg-ai-label" @click="showMsgAi = !showMsgAi">
              <i class="fas fa-robot"></i> AI 分析结果
              <span v-if="!showMsgAi" class="msg-ai-hint">点击展开</span>
              <i class="fas msg-ai-chevron" :class="showMsgAi ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="msg-ai-text" v-show="showMsgAi">{{ aiAnalysisText }}</div>
            <div class="msg-analysis-time" v-if="analysisTime">
              <i class="fas fa-clock"></i> {{ analysisTime }}
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 用户信息弹窗 -->
    <el-dialog v-model="showNameDialog" title="用户信息" width="460px">
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="用户名">{{ authStore.userDate?.userName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ authStore.userDate?.email || '—' }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="isAdmin ? 'danger' : 'info'" size="small">{{ isAdmin ? '管理员' : '普通用户' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-form label-width="80px">
        <el-form-item label="新用户名">
          <el-input v-model="newUserName" placeholder="请输入新用户名" />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form label-width="100px" :model="pwdForm" :rules="pwdRules" ref="pwdFormRef">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="pwdForm.oldPwd" type="password" show-password placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input v-model="pwdForm.confirmPwd" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNameDialog = false">关闭</el-button>
        <el-button type="warning" :loading="pwdLoading" @click="handleChangePwd">修改密码</el-button>
        <el-button type="primary" :loading="nameLoading" @click="handleUpdateName">修改用户名</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/stores'
import { ElMessage } from 'element-plus'
import authApi from '@/api/auth'
import wireMaterialApi from '@/api/wire-material'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.userDate?.userName || '')
const indicatorRef = ref(null)

// 头像字母：取用户名的首字符，无数据时默认 'U'
const avatarLetter = computed(() => {
  const name = authStore.userDate?.userName || ''
  return name ? name.charAt(0).toUpperCase() : 'U'
})
// 用户头像：优先用后端返回的 avatarUrl，否则用 ui-avatars 生成首字母头像
const userAvatar = computed(() => {
  const url = authStore.userDate?.avatarUrl
  if (url) return url
  const name = authStore.userDate?.userName || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=64&bold=true`
})
// 是否管理员
const isAdmin = computed(() => {
  const u = authStore.userDate
  if (!u) return false
  return u.roleId == 1 || u.role_id == 1 || u.role == 1
})

// ==================== 导航相关 ====================
const menuItems = ref([
  { name: '仪表盘', path: '/home/Dashboard' },
  { name: '检测管理', path: '/home/wirematerial' },
  { name: '表面缺陷检测', path: '/home/defect' },
  { name: '设备管理', path: '/home/device' },
  { name: '应用场景管理', path: '/home/scenario' },
  { name: '智能助手', path: '/home/ai'}
])

const activeMenu = ref('/home/Dashboard')
const hoverTimer = ref(null) // 下划线变短的延迟定时器
const FIXED_HOVER_WIDTH = 40  // 悬停后下划线的固定宽度，可修改

// 获取当前激活菜单的宽度（用于滑动时保持宽度不变）
const getActiveWidth = () => {
  const activeItem = document.querySelector(`.nav-item[href="${activeMenu.value}"]`)
  return activeItem ? activeItem.offsetWidth : 0
}

// 设置指示器的位置和宽度（width 可选，不传则使用目标项自身宽度）
const setIndicator = (path, width) => {
  const item = document.querySelector(`.nav-item[href="${path}"]`)
  const indicator = indicatorRef.value
  if (!item || !indicator) return

  const w = width !== undefined ? width : item.offsetWidth
  indicator.style.left = `${item.offsetLeft + (item.offsetWidth - w) / 2}px`
  indicator.style.width = `${w}px`
}

// 鼠标移入菜单项
const handleHover = (path) => {
  // 清除已有的变短定时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }

  // 立即将指示器移动到目标菜单位置，宽度保持为激活菜单的宽度
  setIndicator(path, getActiveWidth())

  // 如果悬停的就是当前激活菜单，不需要变短
  if (path === activeMenu.value) return

  // 延迟 300ms 后，指示器宽度缩短为固定值 FIXED_HOVER_WIDTH
  hoverTimer.value = setTimeout(() => {
    setIndicator(path, FIXED_HOVER_WIDTH)
    hoverTimer.value = null
  }, 300)
}

// 鼠标离开整个导航菜单区域
const resetIndicator = () => {
  // 清除可能正在等待的变短定时器
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  // 恢复到当前激活菜单的位置和宽度（自身宽度）
  setIndicator(activeMenu.value,FIXED_HOVER_WIDTH)
}

// 点击菜单项
const handleClick = (path) => {
  activeMenu.value = path
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }

  setIndicator(path)
}

// ==================== 用户下拉菜单（悬停式，延迟关闭） ====================
const showDropdown = ref(false)
const closeTimer = ref(null) // 关闭的延迟定时器

// 鼠标移入用户区域：立即显示，并清除可能等待的关闭定时器
const showDropdownMenu = () => {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  showDropdown.value = true
}

// 鼠标离开用户区域：延迟 500ms 后再隐藏
const hideDropdownMenu = () => {
  closeTimer.value = setTimeout(() => {
    showDropdown.value = false
    closeTimer.value = null
  }, 500) // 可修改延迟时间（毫秒）
}

// ==================== 用户信息弹窗 ====================
const showNameDialog = ref(false)
const newUserName = ref('')
const nameLoading = ref(false)

// 密码修改
const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
const pwdLoading = ref(false)
const pwdFormRef = ref(null)

const validateConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.newPwd) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

const validateNewPwd = (rule, value, callback) => {
  if (!value) return callback()
  if (value.length < 6 || value.length > 16) {
    return callback(new Error('密码长度必须为 6~16 位'))
  }
  if (!/[a-zA-Z]/.test(value)) {
    return callback(new Error('密码必须包含至少一个字母'))
  }
  if (!/[._?]/.test(value)) {
    return callback(new Error('密码必须包含 . _ ? 中的至少一个特殊字符'))
  }
  callback()
}

const pwdRules = {
  oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
}

const handleChangePwd = async () => {
  const valid = await pwdFormRef.value.validate().catch(() => false)
  if (!valid) return
  pwdLoading.value = true
  try {
    const res = await authApi.changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      pwdForm.oldPwd = ''
      pwdForm.newPwd = ''
      pwdForm.confirmPwd = ''
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch {
    ElMessage.error('修改失败')
  }
  pwdLoading.value = false
}

const handleUpdateName = async () => {
  if (!newUserName.value.trim()) { ElMessage.warning('请输入新用户名'); return }
  nameLoading.value = true
  try {
    const res = await authApi.updateUsername(newUserName.value.trim())
    if (res.code === 200) {
      ElMessage.success('用户名修改成功')
      showNameDialog.value = false
      await authStore.getuserdateandid()
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch {
    ElMessage.error('修改失败')
  }
  nameLoading.value = false
}

// ==================== 退出登录 ====================
const handleLogout = () => {
  // 清除本地存储的 token
  authStore.logout()
  router.push('/login')
}

// ==================== 消息通知 ====================
const msgDrawerVisible = ref(false)
const msgLoading = ref(false)
const msgEnabled = ref(false)
const msgList = ref([])
const msgBadge = ref(0)
const msgActiveIndex = ref(-1)
const showMsgAi = ref(false)
const analysisTime = ref('')
const aiAnalysisText = ref('')
const msgRefreshing = ref(false)
const msgCategory = ref('all')
let msgPollTimer = null

const catCounts = computed(() => ({
  all: msgList.value.length,
  device: msgList.value.filter(m => m.type === 'device').length,
  person: msgList.value.filter(m => m.type === 'person').length,
  machine: msgList.value.filter(m => m.type === 'machine').length
}))

const filteredMsgList = computed(() => {
  if (msgCategory.value === 'all') return msgList.value
  return msgList.value.filter(m => m.type === msgCategory.value)
})

const rateColor = (rate) => {
  if (rate >= 80) return '#ef4444'
  if (rate >= 50) return '#f59e0b'
  return '#10b981'
}

const fetchMessages = async (status = 0) => {
  try {
    const res = await wireMaterialApi.getEarlyWarning(status, 24)
    const data = res.data ?? res
    const rawItems = [
      ...(data.topDevices || []).map(i => ({ ...i, type: 'device', typeLabel: '设备' })),
      ...(data.topResponsiblePersons || []).map(i => ({ ...i, type: 'person', typeLabel: '负责人' })),
      ...(data.topProductionMachines || []).map(i => ({ ...i, type: 'machine', typeLabel: '生产机器' }))
    ]
    msgList.value = rawItems.map(item => {
      const failRate = Number(item.failRate ?? 0)
      return {
        name: item.name || '—',
        type: item.type || 'device',
        typeLabel: item.typeLabel,
        failRate,
        totalCount: item.totalCount ?? 0,
        failCount: item.failCount ?? 0,
        level: failRate >= 80 ? 'critical' : failRate >= 50 ? 'warn' : 'info',
        levelLabel: failRate >= 80 ? '严重' : failRate >= 50 ? '警告' : '提示',
        icon: failRate >= 80 ? 'fas fa-times-circle' : failRate >= 50 ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'
      }
    })
    msgBadge.value = msgList.value.filter(m => m.level === 'critical').length
    analysisTime.value = data.analysisTime || new Date().toLocaleString('zh-CN')
    aiAnalysisText.value = data.aiAnalysis || ''
  } catch (e) {
    console.error('预警消息拉取失败', e)
  }
}

const fetchLatest = async () => {
  msgRefreshing.value = true
  try {
    await fetchMessages(1)
  } finally {
    msgRefreshing.value = false
  }
}

const onMsgToggle = (val) => {
  if (val) {
    msgLoading.value = true
    fetchMessages().finally(() => { msgLoading.value = false })
    msgPollTimer = setInterval(fetchMessages, 5 * 60 * 1000)
  } else {
    if (msgPollTimer) { clearInterval(msgPollTimer); msgPollTimer = null }
    msgList.value = []
    analysisTime.value = ''
    aiAnalysisText.value = ''
    msgActiveIndex.value = -1
    showMsgAi.value = false
  }
}

const openMsgDrawer = () => { msgDrawerVisible.value = true }

const handleDrawerClose = () => { msgDrawerVisible.value = false }

// ==================== 页面初始化 ====================
onMounted(async () => {
  activeMenu.value = route.path
  try {
    await authStore.getuserdateandid()
    console.log('用户数据加载成功:', JSON.stringify(authStore.userDate))
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
  nextTick(() => {
    setIndicator(activeMenu.value)
  })
})
onBeforeUnmount(() => {
  if (msgPollTimer) { clearInterval(msgPollTimer); msgPollTimer = null }
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* ---------- 顶部导航栏 ---------- */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-inner {
  max-width: 1600px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 品牌区域 */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

/* 导航菜单 */
.nav-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.nav-item {
  position: relative;
  padding: 0 16px;
  height: 64px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #1f2937;
}

.nav-item.active {
  color: #1f2937;
  font-weight: 600;
}

/* 滑动指示器 */
.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: #1f2937;
  border-radius: 2px 2px 0 0;
  transition: left 0.3s ease, width 0.3s ease;
  pointer-events: none;
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 消息通知按钮 */
.notify-btn {
  position: relative;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer; color: #9ca3af;
  transition: all 0.2s; font-size: 18px;
}
.notify-btn:hover { background: #f3f4f6; color: #6366f1; }
.notify-btn.active { color: #6366f1; animation: bell-pulse 2s ease-in-out infinite; }
@keyframes bell-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
.notify-badge {
  position: absolute; top: -2px; right: -2px;
  min-width: 18px; height: 18px; line-height: 18px;
  background: #ef4444; color: white; font-size: 10px; font-weight: 700;
  border-radius: 9px; text-align: center; padding: 0 5px;
}

/* 用户下拉容器 */
.user-dropdown {
  position: relative;
}

/* 用户信息条 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.user-info:hover {
  background: #f3f4f6;
}

/* 下拉箭头 */
.dropdown-arrow {
  font-size: 10px;
  color: #9ca3af;
  margin-left: 4px;
  transition: transform 0.3s;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* 用户头像 */
.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.avatar-letter {
  font-weight: 700;
  font-size: 16px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* 用户详情 */
.user-detail {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-badge {
  font-size: 10px;
  font-weight: 500;
  color: #eab308;
  background: #fef3c7;
  padding: 1px 6px;
  border-radius: 4px;
}

.user-status {
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 140px;
  z-index: 1001;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.dropdown-item i {
  font-size: 14px;
  width: 16px;
}

/* 主内容区域 */
.main-content {
  padding-top: 64px;
  min-height: 100vh;
}

/* ===== 消息抽屉 ===== */
.msg-drawer-title { display: flex; align-items: center; gap: 8px; font-size: 16px; }
.msg-pulse { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: msg-pulse-dot 1.5s ease-in-out infinite; margin-left: 4px; }
@keyframes msg-pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.msg-drawer-body { padding: 0 4px; }

/* 开关栏 */
.msg-toggle-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #f8fafc; border-radius: 10px; margin-bottom: 16px; }
.msg-toggle-label { font-size: 14px; font-weight: 600; color: #374151; }

/* 刷新按钮 */
.msg-refresh-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.msg-refresh-hint { font-size: 11px; color: #9ca3af; }

/* 分类标签 */
.msg-cat-tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
.msg-cat-tab {
  font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 14px;
  cursor: pointer; background: #f3f4f6; color: #6b7280; user-select: none;
  transition: all 0.2s;
}
.msg-cat-tab:hover { background: #e5e7eb; color: #374151; }
.msg-cat-tab.active { background: #6366f1; color: #fff; }

/* 预警列表项 */
.msg-item { border-radius: 10px; margin-bottom: 8px; background: #f9fafb; cursor: pointer; transition: all 0.2s; overflow: hidden; }
.msg-item:hover { background: #f3f4f6; }
.msg-item.msg-critical { border-left: 3px solid #ef4444; background: #fef2f2; }
.msg-item.msg-warn     { border-left: 3px solid #f59e0b; background: #fffbeb; }
.msg-item.msg-info     { border-left: 3px solid #10b981; background: #ecfdf5; }
.msg-item.msg-critical:hover { background: #fee2e2; }
.msg-item.msg-warn:hover     { background: #fef3c7; }
.msg-item.msg-info:hover     { background: #d1fae5; }

.msg-item-head { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; }

.msg-icon { font-size: 18px; padding-top: 1px; flex-shrink: 0; }
.msg-critical .msg-icon { color: #ef4444; }
.msg-warn .msg-icon     { color: #f59e0b; }
.msg-info .msg-icon     { color: #10b981; }

.msg-content { flex: 1; min-width: 0; }
.msg-name { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 4px; }
.msg-meta { display: flex; gap: 10px; font-size: 12px; color: #6b7280; margin-bottom: 5px; }
.msg-rate { font-weight: 600; }
.msg-progress-bar { height: 5px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.msg-progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.msg-level-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; flex-shrink: 0; }
.tag-critical { background: #fef2f2; color: #dc2626; }
.tag-warn     { background: #fffbeb; color: #d97706; }
.tag-info     { background: #ecfdf5; color: #059669; }

.msg-expand-arrow { font-size: 10px; color: #9ca3af; margin-top: 4px; transition: transform 0.3s; flex-shrink: 0; }
.msg-expand-arrow.rotated { transform: rotate(180deg); }

/* 展开详情 */
.msg-detail { padding: 0 14px 14px; }
.msg-detail-stats { display: flex; flex-direction: column; gap: 10px; }
.msg-detail-progress { display: flex; align-items: center; gap: 8px; }
.msg-detail-progress-bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.msg-detail-progress-fill { height: 100%; border-radius: 4px; }
.msg-detail-progress-text { font-size: 13px; font-weight: 700; min-width: 40px; text-align: right; }
.msg-detail-stat-label { font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
.msg-detail-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.msg-detail-stat-item { background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 2px; }
.msg-detail-stat-item span { font-size: 11px; color: #9ca3af; }
.msg-detail-stat-item strong { font-size: 18px; color: #1f2937; }
.msg-detail-stat-item strong.fail { color: #ef4444; }

/* AI 分析 */
.msg-ai { background: #f8fafc; border-radius: 10px; padding: 14px; margin-top: 12px; }
.msg-ai-label { font-size: 13px; font-weight: 600; color: #6366f1; display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; margin-bottom: 8px; }
.msg-ai-label:hover { color: #4f46e5; }
.msg-ai-hint { font-size: 11px; font-weight: 400; color: #9ca3af; background: #e5e7eb; padding: 1px 8px; border-radius: 8px; }
.msg-ai-chevron { margin-left: auto; font-size: 10px; opacity: 0.6; }
.msg-ai-text { font-size: 12px; color: #4b5563; line-height: 1.6; white-space: pre-wrap; max-height: 180px; overflow-y: auto; font-family: 'SF Mono', 'Consolas', monospace; }
.msg-analysis-time { font-size: 11px; color: #9ca3af; margin-top: 8px; display: flex; align-items: center; gap: 4px; }

.msg-empty { text-align: center; padding: 60px 0; color: #9ca3af; }
.msg-empty i { font-size: 36px; display: block; margin-bottom: 12px; }

</style>