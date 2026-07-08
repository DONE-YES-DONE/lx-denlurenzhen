<template>
  <div class="login-container">
    <!-- 左侧装饰区域 -->
    <div class="decoration-panel">
      <div class="bg-gradient"></div>
      <div class="bg-noise"></div>
      <div class="gradient-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
      <div class="particles-container">
        <div v-for="i in 35" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
      <div class="floating-shapes">
        <div class="shape shape-circle shape-1"></div>
        <div class="shape shape-circle shape-2"></div>
        <div class="shape shape-circle shape-3"></div>
        <div class="shape shape-triangle shape-4"></div>
        <div class="shape shape-diamond shape-5"></div>
        <div class="shape shape-circle shape-6"></div>
        <div class="shape shape-rectangle shape-7"></div>
      </div>
      <div class="light-rays">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
        <div class="ray ray-4"></div>
      </div>
      <div class="decoration-content">
        <div class="brand-section">
          <div class="brand-icon-wrapper">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12" />
                <path d="M6 12h12" />
              </svg>
            </div>
            <div class="icon-ring ring-outer"></div>
            <div class="icon-ring ring-inner"></div>
          </div>
          <h1 class="brand-title">Metal Wire</h1>
          <p class="brand-subtitle">精准 · 可靠 · 智能</p>
        </div>
        <div class="feature-points">
          <div class="feature-item" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">
              <component :is="feature.icon"></component>
            </div>
            <span>{{ feature.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h2>{{ isRootLogin ? 'ROOT用户登录' : '登录账户' }}</h2>
          <p>{{ isRootLogin ? '请输入ROOT用户凭据' : '欢迎回来，请输入您的凭据' }}</p>
        </div>

        <!-- 登录方式切换 -->
        <div class="auth-tabs" v-if="!isRootLogin">
          <div class="tab-slider" :style="{ transform: `translateX(${activeTab === 'account' ? '0%' : '100%'})` }"></div>
          <button
              type="button"
              @click="activeTab = 'account'"
              :class="['tab-button', { active: activeTab === 'account' }]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            密码登录
          </button>
          <button
              type="button"
              @click="activeTab = 'code'"
              :class="['tab-button', { active: activeTab === 'code' }]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            验证码登录
          </button>
        </div>
        <div v-else class="auth-tabs">
          <div class="tab-slider" style="display: none;"></div>
          <button type="button" class="tab-button active">
            ROOT用户登录
          </button>
        </div>

        <!-- 账号密码登录 -->
        <form v-if="!isRootLogin && activeTab === 'account'" @submit.prevent="handleLogin" class="login-form">
          <div class="form-field">
            <label class="field-label">
            邮箱
            </label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                  v-model="accountForm.account"
                  type="text"
                  class="form-input"
                  placeholder="请输入邮箱"
                  required
              >
            </div>
          </div>
          <div class="form-field">
            <label class="field-label">密码</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                  v-model="accountForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入密码"
                  required
              >
              <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>
          <div class="remember-me">
            <input
                type="checkbox"
                id="rememberAccount"
                v-model="accountForm.remember"
                class="remember-checkbox"
            >
            <label for="rememberAccount">记住我</label>
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            <svg v-if="loading" class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span>{{ loading ? '登录中...' : '立即登录' }}</span>
          </button>
        </form>

        <!-- 验证码登录 -->
        <form v-else-if="!isRootLogin && activeTab === 'code'" @submit.prevent="handleCodeLogin" class="login-form">
          <div class="form-field">
            <label class="field-label">邮箱地址</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                  v-model="codeForm.email"
                  type="email"
                  class="form-input"
                  placeholder="请输入邮箱地址"
                  required
              >
            </div>
          </div>
          <div class="form-field">
            <label class="field-label">验证码</label>
            <div class="input-group verification-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <input
                  v-model="codeForm.code"
                  type="text"
                  class="form-input"
                  placeholder="请输入验证码"
                  required
              >
              <button
                  type="button"
                  @click="sendLoginCode"
                  :disabled="codeButtonDisabled"
                  class="code-button"
              >
                {{ codeButtonText }}
              </button>
            </div>
          </div>
          <div class="remember-me">
            <input
                type="checkbox"
                id="rememberCode"
                v-model="codeForm.remember"
                class="remember-checkbox"
            >
            <label for="rememberCode">记住我</label>
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            <svg v-if="loading" class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span>{{ loading ? '登录中...' : '立即登录' }}</span>
          </button>
        </form>

        <!-- ROOT用户登录表单 -->
        <form v-if="isRootLogin" @submit.prevent="handleRootLogin" class="login-form">
          <div class="form-field">
            <label class="field-label">
              用户名
            </label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                  v-model="rootForm.username"
                  type="text"
                  class="form-input"
                  placeholder="请输入ROOT用户名"
                  required
              >
            </div>
          </div>
          <div class="form-field">
            <label class="field-label">密码</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                  v-model="rootForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入ROOT密码"
                  required
              >
              <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>
          <div class="remember-me">
            <input
                type="checkbox"
                id="rememberRoot"
                v-model="rootForm.remember"
                class="remember-checkbox"
            >
            <label for="rememberRoot">记住我</label>
          </div>
          <button type="submit" class="submit-button" :disabled="loading">
            <svg v-if="loading" class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span>{{ loading ? '登录中...' : '立即登录' }}</span>
          </button>
        </form>

        <!-- 底部链接 -->
        <div class="form-footer" v-if="!isRootLogin">
          <router-link to="/register" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            注册新账户
          </router-link>
          <router-link to="/forgot-password" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            找回密码
          </router-link>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-alert">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- ROOT用户切换按钮 -->
      <button @click="toggleRootLogin" class="root-toggle-button">
        {{ isRootLogin ? '返回标准登录' : 'ROOT用户登录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import authApi from '../../api/auth'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/stores';

const REMEMBER_KEY = 'remembered_account'

// ===== UI 状态变量 =====
const activeTab = ref('account')
const isRootLogin = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const codeButtonDisabled = ref(false)
const codeButtonText = ref('获取验证码')
let countdown = 60
// 路由与store 管理
const router = useRouter()//跳转页面
const authStore = useAuthStore()//// store 实例

// ===== 表单数据 =====
//账号密码
const accountForm = ref({
  account: '',
  password: '',
  remember: false
})
//邮箱验证码登录
const codeForm = ref({
  email: '',
  code: '',
  remember: false
})
//root登录
const rootForm = ref({
  username: '',
  password: '',
  remember: false
})

// ===== 记住我：保存/恢复账号密码 =====
const saveRemembered = () => {
  const data = {}
  if (accountForm.value.remember) {
    data.account = { account: accountForm.value.account, password: accountForm.value.password, remember: true }
  }
  if (codeForm.value.remember) {
    data.code = { email: codeForm.value.email, remember: true }
  }
  if (rootForm.value.remember) {
    data.root = { username: rootForm.value.username, password: rootForm.value.password, remember: true }
  }
  if (Object.keys(data).length) {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(REMEMBER_KEY)
  }
}

const loadRemembered = () => {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (data.account) {
      accountForm.value = { ...accountForm.value, ...data.account }
    }
    if (data.code) {
      codeForm.value = { ...codeForm.value, ...data.code }
    }
    if (data.root) {
      rootForm.value = { ...rootForm.value, ...data.root }
    }
  } catch { /* ignore */ }
}

onMounted(() => loadRemembered())

// ===== 计算属性 =====
const features = computed(() => [
  {
    icon: 'SecurityIcon',
    text: '企业级安全保障'
  },
  {
    icon: 'SpeedIcon',
    text: '快速响应'
  },
  {
    icon: 'CloudIcon',
    text: '7x24小时服务'
  }
])

const getParticleStyle = (index) => {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const size = Math.random() * 4 + 2
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 10
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const toggleRootLogin = () => {
  isRootLogin.value = !isRootLogin.value
  error.value = ''
  if (!isRootLogin.value) {
    rootForm.value = {
      username: '',
      password: '',
      remember: false
    }
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const startCountdown = () => {
  codeButtonDisabled.value = true
  const timer = setInterval(() => {
    countdown--
    codeButtonText.value = `${countdown}秒后重试`
    if (countdown <= 0) {
      clearInterval(timer)
      codeButtonText.value = '获取验证码'
      codeButtonDisabled.value = false
      countdown = 60
    }
  }, 1000)
}

// ===== 登录相关方法（留空，你自己写） =====
// 账号密码登录
const handleLogin = async ()=> {
    loading.value = true
    error.value = ''
    try{
        //调用api发送请求
        const response = await authApi.loginWithUsername(
            accountForm.value.account,
            accountForm.value.password,
            accountForm.value.remember
        )
        console.log(response.data)
        //判断登陆是否成功
        if(response.code === 200){
            const token = response.data
            authStore.setToken(token)
            saveRemembered()
            ElMessage.success('登陆成功！')
            router.push('/home')
        }else{
            console.log('登录失败：', response.message)
            error.value = response.message || '登录失败'
        }
    }catch(err){
        console.error('登录出错：', err)
        error.value = err.response?.data?.message || '网络请求失败'
    }finally{
        loading.value = false
    }
}
// 发送验证码
const sendLoginCode = async () => {
  if (!codeForm.value.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }
  try {
    await authApi.sendLoginCode(codeForm.value.email)
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (err) {
    error.value = err.response?.data?.message || '发送验证码失败'
  }
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!codeForm.value.email || !codeForm.value.code) {
    ElMessage.warning('请输入邮箱和验证码')
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await authApi.emailLogin(codeForm.value.email, codeForm.value.code)
    if (response.code === 200) {
      authStore.setToken(response.data)
      saveRemembered()
      ElMessage.success('登录成功！')
      router.push('/home')
    } else {
      error.value = response.message || '登录失败'
    }
  } catch (err) {
    error.value = err.response?.data?.message || '网络请求失败'
  }
  loading.value = false
}

// ROOT用户登录
const handleRootLogin = () => {
  // TODO: 在这里写 ROOT 登录的逻辑
  console.log('ROOT用户登录', rootForm.value)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 左侧装饰面板 */
.decoration-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #c084fc 75%, #d946ef 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.gradient-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.gradient-rings .ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ringRotate 20s linear infinite;
}

.gradient-rings .ring-1 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  margin-top: -300px;
  animation-duration: 30s;
}

.gradient-rings .ring-2 {
  width: 800px;
  height: 800px;
  top: 50%;
  left: 50%;
  margin-left: -400px;
  margin-top: -400px;
  animation-duration: 45s;
  animation-direction: reverse;
}

.gradient-rings .ring-3 {
  width: 1000px;
  height: 1000px;
  top: 50%;
  left: 50%;
  margin-left: -500px;
  margin-top: -500px;
  animation-duration: 60s;
}

@keyframes ringRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  animation: particleFloat 12s infinite ease-in-out;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(-150px) translateX(30px) scale(1.2);
    opacity: 0.6;
  }
  90% {
    opacity: 0.2;
  }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-shapes .shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(2px);
  animation: float 10s infinite ease-in-out;
}

.floating-shapes .shape-circle {
  border-radius: 50%;
}

.floating-shapes .shape-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.floating-shapes .shape-diamond {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.floating-shapes .shape-rectangle {
  border-radius: 8px;
  transform: rotate(15deg);
}

.floating-shapes .shape-1 {
  width: 300px;
  height: 300px;
  top: -5%;
  left: -10%;
  animation-delay: 0s;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
}

.floating-shapes .shape-2 {
  width: 220px;
  height: 220px;
  top: 60%;
  right: -5%;
  animation-delay: 1.5s;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
}

.floating-shapes .shape-3 {
  width: 150px;
  height: 150px;
  bottom: 5%;
  left: 40%;
  animation-delay: 3s;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
}

.floating-shapes .shape-4 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 20%;
  animation-delay: 4.5s;
  background: rgba(255, 255, 255, 0.15);
}

.floating-shapes .shape-5 {
  width: 60px;
  height: 60px;
  top: 75%;
  left: 15%;
  animation-delay: 6s;
  background: rgba(255, 255, 255, 0.12);
}

.floating-shapes .shape-6 {
  width: 100px;
  height: 100px;
  top: 15%;
  right: 30%;
  animation-delay: 7.5s;
  background: radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, transparent 70%);
}

.floating-shapes .shape-7 {
  width: 120px;
  height: 60px;
  bottom: 20%;
  right: 10%;
  animation-delay: 9s;
  background: rgba(255, 255, 255, 0.08);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-50px) translateX(-10px) rotate(180deg);
    opacity: 0.7;
  }
  75% {
    transform: translateY(-20px) translateX(-20px) rotate(270deg);
    opacity: 0.4;
  }
}

.light-rays {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.light-rays .ray {
  position: absolute;
  top: -50%;
  left: 50%;
  width: 2px;
  height: 150%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: rayRotate 30s linear infinite;
}

.light-rays .ray-1 {
  margin-left: -100px;
  animation-delay: 0s;
}

.light-rays .ray-2 {
  margin-left: -50px;
  animation-delay: 7.5s;
}

.light-rays .ray-3 {
  margin-left: 0;
  animation-delay: 15s;
}

.light-rays .ray-4 {
  margin-left: 50px;
  animation-delay: 22.5s;
}

@keyframes rayRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.decoration-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 450px;
  padding: 40px;
}

.brand-section {
  margin-bottom: 60px;
}

.brand-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.brand-icon {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.brand-icon svg {
  width: 50px;
  height: 50px;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.icon-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(45deg, #c084fc, #f472b6, #a78bfa, #c084fc) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.icon-ring.ring-outer {
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  animation: ringRotateOuter 10s linear infinite;
}

.icon-ring.ring-inner {
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  animation: ringRotateInner 8s linear infinite reverse;
}

@keyframes ringRotateOuter {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ringRotateInner {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.brand-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 1.15rem;
  opacity: 0.9;
  font-weight: 400;
}

.feature-points {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 26px;
  height: 26px;
  color: white;
  opacity: 0.9;
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.form-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.form-panel::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.form-container {
  width: 100%;
  max-width: 460px;
  background: white;
  padding: 52px;
  border-radius: 28px;
  box-shadow: 0 25px 80px -20px rgba(99, 102, 241, 0.2);
  position: relative;
  z-index: 1;
}

.form-header {
  text-align: center;
  margin-bottom: 44px;
}

.form-header h2 {
  font-size: 2.3rem;
  font-weight: 800;
  color: #1e1b4b;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-header p {
  color: #64748b;
  font-size: 1.05rem;
  font-weight: 400;
}

/* 选项卡切换 */
.auth-tabs {
  position: relative;
  display: flex;
  background: linear-gradient(135deg, #f0f0ff 0%, #f5f3ff 100%);
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 36px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.tab-slider {
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.18);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 24px;
  background: transparent;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab-button svg {
  width: 19px;
  height: 19px;
  transition: transform 0.3s ease;
}

.tab-button:hover:not(.active) {
  color: #94a3b8;
}

.tab-button.active {
  color: #6366f1;
}

.tab-button.active svg {
  transform: scale(1.1);
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 36px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-label::before {
  content: '';
  width: 4px;
  height: 4px;
  background: #6366f1;
  border-radius: 50%;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 20px;
  width: 24px;
  height: 24px;
  color: #94a3b8;
  z-index: 1;
  transition: color 0.3s ease;
}

.input-group:focus-within .input-icon {
  color: #6366f1;
}

.form-input {
  width: 100%;
  padding: 20px 52px 20px 56px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.05rem;
  font-weight: 500;
  color: #1e293b;
  background: #fafafa;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.12);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.password-toggle {
  position: absolute;
  right: 18px;
  width: 28px;
  height: 28px;
  background: rgba(99, 102, 241, 0.08);
  border: none;
  border-radius: 10px;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.15);
  transform: scale(1.05);
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.verification-group .form-input {
  padding-right: 140px;
}

.code-button {
  position: absolute;
  right: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.code-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.45);
}

.code-button:active:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
}

.code-button:disabled {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-button {
  width: 100%;
  padding: 20px 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-button:hover:not(:disabled)::before {
  left: 100%;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.55);
}

.submit-button:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -8px;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #6366f1;
}

.remember-me label {
  font-size: 0.9rem;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

/* 底部链接 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #4f46e5;
}

.footer-link svg {
  width: 16px;
  height: 16px;
}

/* 错误提示 */
.error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 20px;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ROOT切换按钮 */
.root-toggle-button {
  position: absolute;
  bottom: 30px;
  right: 40px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 1;
}

.root-toggle-button:hover {
  color: #6366f1;
}

/* 响应式 */
@media (max-width: 1024px) {
  .decoration-panel {
    display: none;
  }
  
  .form-panel {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .form-panel {
    padding: 20px;
  }
  
  .form-container {
    padding: 32px 24px;
  }
  
  .form-header h2 {
    font-size: 1.8rem;
  }
}
</style>