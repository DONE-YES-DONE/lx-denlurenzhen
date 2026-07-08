<template>
  <div class="reset-container">
    <!-- 左侧装饰区域 -->
    <div class="decoration-panel">
      <div class="decoration-content">
        <div class="floating-shapes">
          <div class="shape-1"></div>
          <div class="shape-2"></div>
          <div class="shape-3"></div>
          <div class="shape-4"></div>
        </div>
        <div class="brand-section">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M12 1v6"/>
              <path d="M12 17v6"/>
              <path d="M1 12h6"/>
              <path d="M17 12h6"/>
            </svg>
          </div>
          <h1 class="brand-title">重置密码</h1>
          <p class="brand-subtitle">安全便捷的密码找回</p>
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

    <!-- 右侧重置表单 -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h2>找回密码</h2>
          <p>输入您的邮箱和新密码，我们将发送验证码</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="reset-form">
          <div class="form-field">
            <label class="field-label">邮箱地址</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="请输入注册邮箱"
                required
              >
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">新密码</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入新密码"
                required
                @blur="validatePassword"
                @input="pwdError = ''"
              >
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <span v-if="pwdError" class="field-error">{{ pwdError }}</span>
            <span v-else-if="confirmPwdError" class="field-error">{{ confirmPwdError }}</span>
            <span v-else class="pwd-hint">6~16位，需包含字母和 . _ ? 中的特殊字符</span>
          </div>

          <div class="form-field">
            <label class="field-label">确认新密码</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请再次输入新密码"
                required
                @blur="validateConfirm"
                @input="confirmPwdError = ''"
              >
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">验证码</label>
            <div class="input-group verification-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              <input
                v-model="form.code"
                type="text"
                class="form-input"
                placeholder="请输入验证码"
                required
              >
              <button 
                type="button"
                @click="sendResetCode"
                :disabled="codeButtonDisabled"
                class="code-button"
              >
                {{ codeButtonText }}
              </button>
            </div>
          </div>

          <button type="submit" class="submit-button" :disabled="loading">
            <svg v-if="loading" class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <span>{{ loading ? '处理中...' : '重置密码' }}</span>
          </button>
        </form>

        <!-- 底部链接 -->
        <div class="form-footer">
          <router-link to="/login" class="footer-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"/>
              <polyline points="12 5 5 12 12 19"/>
            </svg>
            返回登录
          </router-link>
        </div>

        <!-- 成功提示 -->
        <div v-if="success" class="success-alert">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ success }}</span>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-alert">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/auth.js';

const router = useRouter();
const form = ref({
  email: '',
  newPassword: '',
  confirmPassword: '',
  code: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const pwdError = ref('');
const confirmPwdError = ref('');

const validatePassword = () => {
  const pwd = form.value.newPassword
  if (!pwd) { pwdError.value = ''; return true }
  if (pwd.length < 6 || pwd.length > 16) {
    pwdError.value = '密码长度必须为 6~16 位'
    return false
  }
  if (!/[a-zA-Z]/.test(pwd)) {
    pwdError.value = '密码必须包含至少一个字母'
    return false
  }
  if (!/[._?]/.test(pwd)) {
    pwdError.value = '密码必须包含 . _ ? 中的至少一个特殊字符'
    return false
  }
  pwdError.value = ''
  return true
}

const validateConfirm = () => {
  if (!form.value.confirmPassword) { confirmPwdError.value = ''; return true }
  if (form.value.newPassword !== form.value.confirmPassword) {
    confirmPwdError.value = '两次输入的密码不一致'
    return false
  }
  confirmPwdError.value = ''
  return true
}

// 验证码相关状态
const codeButtonDisabled = ref(false);
const codeButtonText = ref('获取验证码');
let countdown = 60;

// 特性列表
const features = computed(() => [
  { 
    icon: 'SecurityIcon',
    text: '邮箱验证安全可靠'
  },
  { 
    icon: 'SpeedIcon', 
    text: '快速重置立即生效'
  },
  { 
    icon: 'ShieldIcon', 
    text: '密码加密保护隐私'
  }
]);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const startCountdown = () => {
  codeButtonDisabled.value = true;
  const timer = setInterval(() => {
    countdown--;
    codeButtonText.value = `${countdown}秒后重试`;
    if (countdown <= 0) {
      clearInterval(timer);
      codeButtonText.value = '获取验证码';
      codeButtonDisabled.value = false;
      countdown = 60;
    }
  }, 1000);
};

const sendResetCode = async () => {
  try {
    if (!form.value.email) {
      error.value = '请先输入邮箱';
      return;
    }

    const response = await api.sendPwdCode(form.value.email);
    if (response.code === 200) {
      startCountdown();
      success.value = '验证码已发送，请查收邮箱';
    } else {
      error.value = response.msg || '发送验证码失败';
    }
  } catch (err) {
    error.value = err.response?.data?.msg || '发送验证码失败';
  }
};

const handleResetPassword = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';

    if (!validatePassword()) {
      loading.value = false
      return
    }
    if (!validateConfirm()) {
      loading.value = false
      return
    }

    const response = await api.resetPassword(
        form.value.newPassword,
        form.value.email,
        form.value.code
    );

    if (response.code === 200) {
      success.value = '密码重置成功，请使用新密码登录';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      error.value = response.msg || '重置密码失败';
    }
  } catch (err) {
    error.value = err.response?.data?.msg || '重置密码失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* 隐藏浏览器自带的密码可见性按钮 */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button {
  display: none !important;
}

input[type="password"]::-webkit-input-decoration-container {
  display: none !important;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.reset-container {
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 左侧装饰面板 */
.decoration-panel {
  flex: 1;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-shapes > div {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 8s infinite ease-in-out;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

.shape-4 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 10%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.8;
  }
}

.brand-section {
  margin-bottom: 60px;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 1.1rem;
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
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  width: 24px;
  height: 24px;
  color: white;
  opacity: 0.9;
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.form-container {
  width: 100%;
  max-width: 720px;           
  padding: 60px 150px;         
  background: #ffffff;        
  border-radius: 20px;        
  box-shadow: 0 10px 40px rgba(79, 70, 229, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.form-header p {
  color: #718096;
  font-size: 1rem;
  font-weight: 400;
}

/* 表单样式 */
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #4f46e5;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 16px 48px 16px 48px;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  background: white;
  transition: all 0.3s ease;
}

/* 密码输入框特殊样式 */
.form-input[type="password"],
.form-input.password-input {
  padding-right: 48px;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.field-error {
  font-size: 0.8rem;
  color: #e53e3e;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
}

.pwd-hint {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 6px;
  padding: 8px 12px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4338ca;
}

.password-toggle svg {
  width: 100%;
  height: 100%;
}

.verification-group .form-input {
  padding-right: 120px;
}

.code-button {
  position: absolute;
  right: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.code-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
  transform: translateY(-1px);
}

.code-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.submit-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(79, 70, 229, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

/* 底部链接 */
.form-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;         /* 浅灰色边框 */
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #f8fafc;               /* 浅灰背景 */
}

.footer-link:hover {
  color: #4f46e5;
  border-color: #4f46e5;             /* hover 时边框变紫 */
  background: white;
}

.footer-link svg {
  width: 16px;
  height: 16px;
}

/* 成功提示 */
.success-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 12px;
  color: #276749;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
  margin-top: 16px;
}

.success-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 错误提示 */
.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 12px;
  color: #c53030;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
  margin-top: 16px;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
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
  
  .form-header h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
  }
  
  .verification-group .form-input {
    padding-right: 100px;
  }
  
  .code-button {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>