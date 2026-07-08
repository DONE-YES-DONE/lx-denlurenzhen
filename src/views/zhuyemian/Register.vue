<template>
  <div class="register-container">
    <!-- 动态背景粒子 -->
    <div class="particles-container">
      <div class="particle" v-for="i in 15" :key="i" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (10 + Math.random() * 10) + 's'
      }"></div>
    </div>

    <!-- 左侧装饰区域 - 全新布局 -->
    <div class="decoration-panel">
      <div class="decoration-bg"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="decoration-content">
        <div class="brand-section">
          <div class="brand-icon">
            <div class="icon-ring"></div>
            <div class="icon-inner">
              <i class="fas fa-user-plus"></i>
            </div>
          </div>
          <h1 class="brand-title">创建账户</h1>
          <p class="brand-subtitle">加入微细线材云智检平台</p>
        </div>
        
        <!-- 注册优势 -->
        <div class="benefits-list">
          <div class="benefit-item" v-for="(benefit, index) in benefits" :key="index">
            <div class="benefit-icon-wrapper">
              <i :class="benefit.icon"></i>
              <div class="benefit-glow"></div>
            </div>
            <div class="benefit-info">
              <h4>{{ benefit.title }}</h4>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧注册表单 - 全新布局 -->
    <div class="form-panel">
      <div class="form-container">
        <!-- 顶部装饰条 -->
        <div class="form-decoration"></div>
        
        <div class="form-header">
          <div class="header-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <h2>注册新账户</h2>
          <p>填写以下信息，开启您的检测之旅</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- 用户名 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              用户名
            </label>
            <input
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                required
            >
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-envelope"></i>
              邮箱地址
            </label>
            <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱地址"
                required
            >
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock"></i>
              密码
            </label>
            <div class="password-input-wrapper">
              <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="请输入密码（至少6位）"
                  required
              >
              <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="password-toggle"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- 确认密码 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock"></i>
              确认密码
            </label>
            <input
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请再次输入密码"
                required
            >
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-shield"></i>
              验证码
            </label>
            <div class="code-input-wrapper">
              <input
                  v-model="form.code"
                  type="text"
                  class="form-input"
                  placeholder="请输入验证码"
                  required
              >
              <button
                  type="button"
                  @click="sendCode"
                  :disabled="codeButtonDisabled"
                  class="code-button"
              >
                {{ codeButtonText }}
              </button>
            </div>
          </div>

          <!-- 同意协议 -->
          <div class="form-options">
            <label class="checkbox-label">
              <input
                  type="checkbox"
                  v-model="form.agree"
                  class="form-checkbox"
                  required
              >
              <span class="checkbox-custom"></span>
              <span>我已阅读并同意</span>
              <a href="#" class="link-text">《用户服务协议》</a>
              <span>和</span>
              <a href="#" class="link-text">《隐私政策》</a>
            </label>
          </div>

          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading" class="loading-indicator">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span>{{ loading ? '注册中...' : '立即注册' }}</span>
          </button>
        </form>

        <!-- 底部链接 -->
        <div class="form-footer">
          <span>已有账户？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-alert">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/auth.js';

const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  agree: false
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const codeButtonText = ref('获取验证码');
const codeButtonDisabled = ref(false);
let codeTimer = null;

const benefits = ref([
  {
    icon: 'fas fa-cloud-upload-alt',
    title: '云端存储',
    description: '检测数据安全存储'
  },
  {
    icon: 'fas fa-chart-line',
    title: '数据分析',
    description: '可视化报表分析'
  },
  {
    icon: 'fas fa-shield-alt',
    title: '风险预估',
    description: 'AI智能预测'
  }
]);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const sendCode = async () => {
  if (!form.value.email) {
    error.value = '请先输入邮箱地址';
    return;
  }
  
  codeButtonDisabled.value = true;
  let countdown = 60;
  
  try {
    await api.sendRegisterCode(form.value.email);
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || '发送验证码失败';
    codeButtonDisabled.value = false;
    return;
  }
  
  codeButtonText.value = `${countdown}秒后重试`;
  
  codeTimer = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(codeTimer);
      codeButtonText.value = '获取验证码';
      codeButtonDisabled.value = false;
    } else {
      codeButtonText.value = `${countdown}秒后重试`;
    }
  }, 1000);
};

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    await api.register({
      userName: form.value.username,
      email: form.value.email,
      password: form.value.password,
      code: form.value.code
    });
    
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* 注册容器 */
.register-container {
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
}

/* 背景粒子 */
.particles-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
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

.decoration-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 30%, #d946ef 60%, #ec4899 100%);
}

.decoration-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 40%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 30%);
  animation: bgPulse 10s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.05) rotate(1deg); opacity: 0.8; }
}

/* 浮动几何形状 */
.floating-shapes {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
}

.shape-1 {
  width: 180px;
  height: 180px;
  top: 15%;
  right: 5%;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: shapeFloat1 10s ease-in-out infinite;
}

.shape-2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 10%;
  border-radius: 50%;
  animation: shapeFloat2 8s ease-in-out infinite;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 20%;
  transform: rotate(45deg);
  animation: shapeFloat3 9s ease-in-out infinite;
}

@keyframes shapeFloat1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes shapeFloat2 {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(10px) scale(1.1); }
}

@keyframes shapeFloat3 {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50% { transform: rotate(50deg) translateY(-10px); }
}

.decoration-content {
  position: relative;
  z-index: 2;
  padding: 60px;
  width: 100%;
  max-width: 450px;
}

/* 品牌区域 */
.brand-section {
  text-align: center;
  margin-bottom: 55px;
}

.brand-icon {
  width: 110px;
  height: 110px;
  margin: 0 auto 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
  animation: ringRotate 8s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.icon-inner {
  position: relative;
  z-index: 1;
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #fff 0%, #f0f0ff 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.icon-inner i {
  font-size: 32px;
  color: #8b5cf6;
}

.brand-title {
  font-size: 30px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

/* 注册优势 */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.benefit-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #c4b5fd 0%, #e9d5ff 100%);
  transform: scaleY(0);
  transition: transform 0.4s ease;
}

.benefit-item:hover::before {
  transform: scaleY(1);
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(8px);
}

.benefit-icon-wrapper {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.benefit-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, rgba(196, 181, 253, 0.4) 0%, rgba(233, 213, 255, 0.2) 100%);
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefit-item:hover .benefit-glow {
  opacity: 1;
}

.benefit-icon-wrapper i {
  font-size: 24px;
  color: white;
  position: relative;
  z-index: 1;
}

.benefit-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.benefit-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #faf5ff 0%, #f3f4f6 50%, #f8fafc 100%);
  position: relative;
}

.form-panel::before {
  content: '';
  position: absolute;
  top: 10%;
  right: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.form-container {
  width: 100%;
  max-width: 480px;
  padding: 55px 45px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow: 0 25px 80px rgba(139, 92, 246, 0.15);
  position: relative;
  z-index: 2;
}

/* 表单装饰条 */
.form-decoration {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6, #a855f7, #d946ef, #a855f7, #8b5cf6);
  border-radius: 0 0 10px 10px;
}

/* 表单头部 */
.form-header {
  text-align: center;
  margin-bottom: 45px;
}

.header-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon i {
  font-size: 24px;
  color: #8b5cf6;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-header p {
  font-size: 14px;
  color: #64748b;
}

/* 表单 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
}

.form-label i {
  color: #8b5cf6;
  font-size: 15px;
}

.form-input {
  width: 100%;
  padding: 17px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  color: #1e293b;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: white;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

/* 密码输入框 */
.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 55px;
}

.password-toggle {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background: rgba(139, 92, 246, 0.08);
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.15);
}

/* 验证码输入框 */
.code-input-wrapper {
  position: relative;
}

.code-input-wrapper .form-input {
  padding-right: 130px;
}

.code-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 11px 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.code-button:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.code-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* 表单选项 */
.form-options {
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #64748b;
  flex-wrap: wrap;
}

.form-checkbox {
  display: none;
}

.checkbox-custom {
  width: 17px;
  height: 17px;
  border: 2px solid #cbd5e1;
  border-radius: 5px;
  position: relative;
  transition: all 0.3s ease;
  margin-top: 2px;
}

.form-checkbox:checked + .checkbox-custom {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: #6366f1;
}

.form-checkbox:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.link-text {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.link-text:hover {
  text-decoration: underline;
}

/* 提交按钮 */
.submit-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 25px rgba(139, 92, 246, 0.35);
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  transition: opacity 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.45);
}

.submit-button:hover:not(:disabled)::before {
  opacity: 0;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
}

.loading-indicator i {
  font-size: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 底部链接 */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e2e8f0;
}

.form-footer span {
  font-size: 14px;
  color: #64748b;
}

.login-link {
  font-size: 14px;
  color: #8b5cf6;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* 错误提示 */
.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  margin-top: 18px;
  color: #dc2626;
  font-size: 14px;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-alert i {
  font-size: 16px;
}

/* 响应式 */
@media (max-width: 900px) {
  .register-container {
    flex-direction: column;
  }
  
  .decoration-panel {
    min-height: 320px;
    order: 1;
  }
  
  .form-panel {
    order: 2;
    padding: 30px 0;
  }
  
  .decoration-content {
    padding: 35px 30px;
  }
  
  .form-container {
    margin: 0 30px;
    padding: 45px 30px;
  }
  
  .benefits-list {
    display: none;
  }
  
  .brand-icon {
    width: 90px;
    height: 90px;
  }
  
  .icon-inner {
    width: 55px;
    height: 55px;
  }
  
  .icon-inner i {
    font-size: 28px;
  }
  
  .brand-title {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .decoration-content {
    padding: 25px 15px;
  }
  
  .form-container {
    margin: 0 15px;
    padding: 40px 20px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .brand-subtitle {
    font-size: 13px;
  }
  
  .brand-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .icon-inner {
    width: 45px;
    height: 45px;
  }
  
  .icon-inner i {
    font-size: 24px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
  
  .form-input {
    padding: 14px 16px;
  }
  
  .submit-button {
    padding: 16px;
    font-size: 15px;
  }
  
  .code-button {
    padding: 9px 14px;
    font-size: 12px;
  }
}
</style>
