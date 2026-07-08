<template>
  <div class="landing-container overflow-x-hidden">
    <!-- 顶部导航 - 全新设计 -->
    <header class="site-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <div class="brand-icon">
            <img 
              src="@/assets/images/logo.png" 
              alt="logo"
              style="width: 70%; height: 70%; object-fit: contain;"
            >
          </div>
          <div class="brand-text">
            <span class="brand-title">金属线材综合抽检平台</span>
            <span class="brand-subtitle">Metal Wire Inspection</span>
          </div>
        </div>
        <div class="nav-menu">
          <a v-for="item in navItems" :key="item.href" :href="item.href" 
             class="nav-link" :class="{ active: activeNav === item.href }"
             @click="setActiveNav(item.href)">
            {{ item.label }}
          </a>
        </div>
        <div class="nav-actions">
          <router-link :to="whereTo" class="nav-button">
            <i class="fas fa-rocket"></i>
            立即使用
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Hero区域 - 全新垂直堆叠布局 -->
    <section class="hero-section">
      <!-- 动态背景 -->
      <div class="hero-bg">
        <div class="bg-layer layer-1"></div>
        <div class="bg-layer layer-2"></div>
        <div class="bg-layer layer-3"></div>
        <div class="grid-pattern"></div>
      </div>
      
      <div class="hero-container">
        <!-- 顶部标题区域 -->
        <div class="hero-top">
          <div class="hero-intro">
            <div class="intro-badge">
              <span class="badge-pulse"></span>
              <span>专业金属线材检测平台</span>
            </div>
            <h1 class="hero-heading">
              精准检测每一根
              <span class="gradient-text">微细线材</span>
              <br/>的品质
            </h1>
            <p class="hero-description">
              融合硬件端表面缺陷检测与软件端风险预估，提供全方位金属线材检测解决方案
            </p>
            <div class="hero-buttons">
              <router-link :to="whereTo" class="btn-primary">
                <i class="fas fa-play-circle"></i>
                免费试用
              </router-link>
              <a href="#features" class="btn-secondary">
                <i class="fas fa-arrow-down"></i>
                了解功能
              </a>
            </div>
          </div>
        </div>
        
        <!-- 中间视觉区域 - 悬浮卡片群 -->
        <div class="hero-visual">
          <div class="central-card">
            <div class="card-inner">
              <div class="card-image-wrapper">
                <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                     alt="微细线材检测" class="card-image" />
                <div class="image-overlay"></div>
              </div>
              <div class="card-info">
                <h3>智能检测系统</h3>
                <p>集成硬件检测与软件分析的综合解决方案</p>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>
          
          <!-- 环绕式悬浮功能卡片 -->
          <div class="float-card-group">
            <div class="float-card card-top-left">
              <div class="float-icon hardware">
                <i class="fas fa-microscope"></i>
              </div>
              <div class="float-content">
                <span class="float-title">表面缺陷检测</span>
                <span class="float-status online">运行中</span>
              </div>
            </div>
            
            <div class="float-card card-top-right">
              <div class="float-icon software">
                <i class="fas fa-brain"></i>
              </div>
              <div class="float-content">
                <span class="float-title">智能风险预估</span>
                <span class="float-status processing">分析中</span>
              </div>
            </div>
            
            <div class="float-card card-bottom-left">
              <div class="float-icon data">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="float-content">
                <span class="float-title">数据分析</span>
                <span class="float-status completed">运行中</span>
              </div>
            </div>

            <div class="float-card card-bottom-right">
              <div class="float-icon report">
                <i class="fas fa-file-pdf"></i>
              </div>
              <div class="float-content">
                <span class="float-title">报告生成</span>
                <span class="float-status online">可用</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部统计区域 -->
        <div class="hero-stats">
          <div class="stat-card" v-for="stat in heroStats" :key="stat.label">
            <div class="stat-icon" :class="stat.color">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
            <div class="stat-trend" :class="stat.trend">
              <i :class="stat.trendIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能区域 - 不对称网格布局 -->
    <section id="features" class="features-section">
      <div class="section-header">
        <span class="section-tag">核心功能</span>
        <h2 class="section-title">全方位检测能力</h2>
        <p class="section-desc">融合硬件检测与软件分析，为您提供一站式线材质量解决方案</p>
      </div>
      
      <div class="features-grid">
        <!-- 大卡片 - 硬件端检测 -->
        <div class="feature-card large-card hardware-card" style="grid-column:1/3;grid-row:1/3">
          <div class="card-header">
            <div class="card-icon-box">
              <i class="fas fa-microscope"></i>
            </div>
            <div class="card-title-row">
              <h3>硬件端检测</h3>
              <span class="card-badge">实时采集</span>
            </div>
          </div>
          <div class="card-content">
            <p class="card-desc">精密硬件设备，实时数据采集，确保检测结果准确可靠</p>
            <div class="mini-feature-grid">
              <div v-for="feature in hardwareFeatures" :key="feature.title" class="mini-feature">
                <div class="mini-icon" :class="feature.color">
                  <i :class="feature.icon"></i>
                </div>
                <span class="mini-text">{{ feature.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 小卡片组 -->
        <div class="feature-card small-card" style="grid-column:3/4;grid-row:1/2;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.08));border:1px solid rgba(245,158,11,0.15)">
          <div class="card-icon-box small-icon" style="background:linear-gradient(135deg,#f59e0b,#fbbf24)">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h4>风险预警</h4>
          <p>提前识别潜在质量风险</p>
        </div>

        <div class="feature-card small-card" style="grid-column:3/4;grid-row:2/3;background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(96,165,250,0.08));border:1px solid rgba(59,130,246,0.15)">
          <div class="card-icon-box small-icon" style="background:linear-gradient(135deg,#3b82f6,#60a5fa)">
            <i class="fas fa-history"></i>
          </div>
          <h4>数据追溯</h4>
          <p>全链路数据追踪回溯</p>
        </div>

        <div class="feature-card small-card" style="grid-column:1/2;grid-row:3/4;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(52,211,153,0.08));border:1px solid rgba(16,185,129,0.15)">
          <div class="card-icon-box small-icon" style="background:linear-gradient(135deg,#10b981,#34d399)">
            <i class="fas fa-cloud"></i>
          </div>
          <h4>云端存储</h4>
          <p>数据安全备份，随时随地访问</p>
        </div>

        <!-- 大卡片 - 软件端分析 -->
        <div class="feature-card large-card software-card" style="grid-column:2/4;grid-row:3/5">
          <div class="card-header">
            <div class="card-icon-box">
              <i class="fas fa-brain"></i>
            </div>
            <div class="card-title-row">
              <h3>软件端分析</h3>
              <span class="card-badge">AI驱动</span>
            </div>
          </div>
          <div class="card-content">
            <p class="card-desc">智能算法分析，深度数据挖掘，为决策提供有力支持</p>
            <div class="mini-feature-grid">
              <div v-for="feature in softwareFeatures" :key="feature.title" class="mini-feature">
                <div class="mini-icon" :class="feature.color">
                  <i :class="feature.icon"></i>
                </div>
                <span class="mini-text">{{ feature.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="feature-card small-card" style="grid-column:1/2;grid-row:4/5;background:linear-gradient(135deg,rgba(139,92,246,0.08),rgba(167,139,250,0.08));border:1px solid rgba(139,92,246,0.15)">
          <div class="card-icon-box small-icon" style="background:linear-gradient(135deg,#8b5cf6,#a78bfa)">
            <i class="fas fa-file-alt"></i>
          </div>
          <h4>智能问答</h4>
          <p>AI助手实时解答检测疑问</p>
        </div>
      </div>
    </section>

    <!-- 表面缺陷检测专题 - 简洁布局 -->
    <section class="defect-section">
      <div class="defect-container">
        <!-- 左侧内容 -->
        <div class="defect-content">
          <div class="content-header">
            <span class="content-tag">硬件端核心能力</span>
            <h2 class="content-title">表面缺陷检测</h2>
            <p class="content-subtitle">微米级精度识别</p>
          </div>
          <p class="content-desc">
            采用高分辨率工业相机与先进图像处理算法，能够精准检测线材表面的微小瑕疵、划痕、氧化等缺陷，确保产品质量。
          </p>
          
          <!-- 特性列表 -->
          <div class="feature-list">
            <div v-for="(item, index) in defectFeatures" :key="item.title" class="feature-item">
              <div class="feature-color" :style="{ background: getFeatureColor(index) }"></div>
              <div class="feature-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧统计卡片 -->
        <div class="defect-stats">
          <div class="stats-grid">
            <div class="stat-card stat-red">
              <div class="stat-icon">
                <i class="fas fa-microscope"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">2000万</span>
                <span class="stat-label">像素分辨率</span>
              </div>
            </div>
            <div class="stat-card stat-orange">
              <div class="stat-icon">
                <i class="fas fa-tachometer-alt"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">30+</span>
                <span class="stat-label">图片/批</span>
              </div>
            </div>
            <div class="stat-card stat-yellow">
              <div class="stat-icon">
                <i class="fas fa-search"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">0.1μm</span>
                <span class="stat-label">最小识别精度</span>
              </div>
            </div>
            <div class="stat-card stat-green">
              <div class="stat-icon">
                <i class="fas fa-shield"></i>
              </div>
              <div class="stat-content">
                <span class="stat-value">24/7</span>
                <span class="stat-label">全天候运行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 风险预估专题 -->
    <section class="risk-section">
      <div class="risk-wrapper">
        <div class="risk-container">
          <div class="risk-content">
          <div class="content-header">
            <span class="content-tag">软件端核心能力</span>
            <h2 class="content-title">风险预估系统</h2>
            <p class="content-subtitle">AI智能预测</p>
          </div>
          <p class="content-desc">
            agent结合规则引擎实现评估，通过分析历史检测数据，提前识别潜在的质量风险，帮助企业优化生产工艺，降低不良率。
          </p>

          <!-- 功能标签 -->
          <div class="feature-tags">
            <div v-for="feature in riskFeatures" :key="feature.title" class="feature-tag">
              <i :class="feature.icon"></i>
              <span>{{ feature.title }}</span>
            </div>
          </div>

          <!-- 预警信息 -->
          <div class="alert-panel">
            <div class="alert-header">
              <i class="fas fa-shield-alt"></i>
              <span>实时预警</span>
            </div>
            <div class="alert-list">
              <div v-for="alert in riskAlerts" :key="alert.message" class="alert-item" :class="alert.type">
                <span class="alert-indicator"></span>
                <span class="alert-message">{{ alert.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧 评估流程步骤图 -->
        <div class="flow-card">
          <div class="flow-header">
            <i class="fas fa-diagram-project"></i>
            <span>智能评估流程</span>
          </div>
          <div class="flow-steps">
            <div class="flow-step">
              <div class="flow-node">
                <div class="node-icon" style="background:linear-gradient(135deg,#3b82f6,#60a5fa)">
                  <i class="fas fa-database"></i>
                </div>
                <div class="node-line"></div>
              </div>
              <div class="node-info">
                <h4>数据采集</h4>
                <p>实时采集检测数据与设备参数</p>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-node">
                <div class="node-icon" style="background:linear-gradient(135deg,#f59e0b,#fbbf24)">
                  <i class="fas fa-filter"></i>
                </div>
                <div class="node-line"></div>
              </div>
              <div class="node-info">
                <h4>规则匹配</h4>
                <p>阈值规则 + 异常检测规则引擎</p>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-node">
                <div class="node-icon" style="background:linear-gradient(135deg,#8b5cf6,#a78bfa)">
                  <i class="fas fa-brain"></i>
                </div>
                <div class="node-line"></div>
              </div>
              <div class="node-info">
                <h4>Agent 分析</h4>
                <p>AI Agent 多维度综合研判</p>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-node">
                <div class="node-icon" style="background:linear-gradient(135deg,#ef4444,#f87171)">
                  <i class="fas fa-chart-pie"></i>
                </div>
                <div class="node-line"></div>
              </div>
              <div class="node-info">
                <h4>风险评估</h4>
                <p>输出风险等级与置信度评分</p>
              </div>
            </div>
            <div class="flow-step">
              <div class="flow-node">
                <div class="node-icon" style="background:linear-gradient(135deg,#10b981,#34d399)">
                  <i class="fas fa-bell"></i>
                </div>
              </div>
              <div class="node-info">
                <h4>预警推送</h4>
                <p>实时通知相关人员进行处理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>

    <!-- 应用场景 - 卡片瀑布布局 -->
    <section id="applications" class="applications-section">
      <div class="section-header">
        <span class="section-tag">应用领域</span>
        <h2 class="section-title">广泛应用场景</h2>
        <p class="section-desc">金属微细线材在各行业中的关键应用，我们的检测平台为您提供品质保障</p>
      </div>
      
      <div class="applications-grid">
        <div v-for="(app, index) in applications" :key="app.title"
             class="app-card" :class="{ 'featured': index === 0 }"
             :style="{ background: `linear-gradient(135deg, ${app.color}08, ${app.color}12)`, border: `1px solid ${app.color}20` }">
          <div class="card-icon-box" :style="{ background: `linear-gradient(135deg, ${app.color}, ${app.color}cc)` }">
            <i :class="app.icon"></i>
          </div>
          <div class="card-content">
            <h3>{{ app.title }}</h3>
            <p>{{ app.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 检测模板 - 卡片堆叠布局 -->
    <section id="templates" class="templates-section">
      <div class="section-header">
        <span class="section-tag">检测方案</span>
        <h2 class="section-title">专业检测模板</h2>
        <p class="section-desc">针对不同金属材料和用途，我们提供专业化的检测模板，一键生成完整报告</p>
      </div>
      
      <div class="templates-carousel">
        <div class="carousel-wrapper">
          <div v-for="template in templates" :key="template.name" class="template-card">
            <div class="card-image-container">
              <img :src="template.image" :alt="template.name" class="card-image" />
              <div class="image-overlay"></div>
              <span class="card-badge">{{ template.tag }}</span>
            </div>
            <div class="card-info">
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
              <div class="card-footer">
                <span class="card-specs">{{ template.specs }}</span>
                <router-link :to="whereTo" class="card-btn">
                  <i class="fas fa-external-link-alt"></i>
                  查看详情
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-nav prev">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-nav next">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>



    <!-- CTA区域 - 动态背景 -->
    <section class="cta-section">
      <div class="cta-bg">
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>
      </div>
      <div class="cta-content">
        <span class="cta-badge">立即开始您的检测之旅</span>
        <h2 class="cta-heading">准备好提升您的线材检测效率了吗？</h2>
        <p class="cta-desc">加入500+企业用户，体验专业的金属线材检测服务，提升产品质量，降低生产成本。</p>
        <div class="cta-buttons">
          <router-link :to="whereTo" class="cta-btn-primary">
            <i class="fas fa-rocket"></i>
            免费试用
          </router-link>
          <a href="#features" class="cta-btn-secondary">
            <i class="fas fa-info-circle"></i>
            了解更多
          </a>
        </div>
      </div>
    </section>

    <!-- 页脚 - 重新设计 -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              <i class="fas fa-crosshairs"></i>
            </div>
            <span class="logo-text">金属线材综合抽检平台</span>
          </div>
          <p class="brand-desc">专业的金属微细线材综合检测平台，为您的产品质量保驾护航。</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-weibo"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
        
        <div class="footer-links">
          <h4>产品服务</h4>
          <ul>
            <li><a href="#features">功能特点</a></li>
            <li><a href="#applications">应用场景</a></li>
            <li><a href="#templates">检测模板</a></li>
            <li><a href="#">API接口</a></li>
          </ul>
        </div>
        
        <div class="footer-links">
          <h4>解决方案</h4>
          <ul>
            <li><a href="#">电子元器件检测</a></li>
            <li><a href="#">汽车线束检测</a></li>
            <li><a href="#">工业机器人线材</a></li>
            <li><a href="#">军工航天线材</a></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h4>联系我们</h4>
          <div class="contact-items">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>1485703367@qq.com</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>152-7070-0000</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>江西省赣州市 赣南科技学院</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2026 金属线材综合抽检平台平台. 保留所有权利.</p>
        <div class="legal-links">
          <a href="#">隐私政策</a>
          <a href="#">服务条款</a>
          <a href="#">帮助中心</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AuthAPI from "@/api/auth.js";
import {useAuthStore} from "@/stores/stores.js";

const whereTo = ref("/login")
const authStore = useAuthStore();
const activeNav = ref('#');

onMounted(async () => {
  const r = ref()
  try{
    r.value = (await AuthAPI.DetermineToken(authStore.user?.token)).data
  }catch(error){}
  if (r.value === 0){ whereTo.value = "/index"}
  if (r.value === 1){ whereTo.value = "/index"}
  if (r.value === 999){ whereTo.value = "/root"}
})

const setActiveNav = (href) => {
  activeNav.value = href;
};

// 导航菜单
const navItems = ref([
  { label: '首页', href: '#' },
  { label: '功能特点', href: '#features' },
  { label: '应用场景', href: '#applications' },
  { label: '检测模板', href: '#templates' }
]);

// Hero区域统计数据
const heroStats = ref([
  { value: '90%', label: '检测准确率', icon: 'fas fa-check-circle', color: 'stat-green', trend: 'up', trendIcon: 'fas fa-arrow-up' },
  { value: '2000+', label: '检测次数/月', icon: 'fas fa-chart-bar', color: 'stat-blue', trend: 'up', trendIcon: 'fas fa-arrow-up' },
  { value: '24/7', label: '全天候服务', icon: 'fas fa-clock', color: 'stat-indigo', trend: 'stable', trendIcon: 'fas fa-minus' }
]);

// 硬件端功能
const hardwareFeatures = ref([
  { icon: 'fas fa-ruler', title: '线径测量', color: 'mini-purple' },
  { icon: 'fas fa-expand-arrows-alt', title: '延展率检测', color: 'mini-green' },
  { icon: 'fas fa-bolt', title: '电导率检测', color: 'mini-blue' },
  { icon: 'fas fa-microscope', title: '表面缺陷检测', color: 'mini-red' }
]);

// 软件端功能
const softwareFeatures = ref([
  { icon: 'fas fa-cloud-upload-alt', title: '云端存储', color: 'mini-purple' },
  { icon: 'fas fa-chart-line', title: '数据分析', color: 'mini-indigo' },
  { icon: 'fas fa-shield-alt', title: '风险预估', color: 'mini-blue' }
]);

// 表面缺陷检测特性
const defectFeatures = ref([
  { title: '高分辨率成像', description: '采用2000万像素工业相机，清晰捕捉线材表面细节' },
  { title: '智能算法识别', description: '基于深度学习的缺陷识别算法' },
  { title: '实时检测', description: '在线实时检测，不影响生产效率' },
  { title: '多类型缺陷检测', description: '支持划痕、氧化、裂纹等多种缺陷类型识别' }
]);

const featureColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
const getFeatureColor = (index) => {
  return featureColors[index % featureColors.length];
};

// 风险预估特性
const riskFeatures = ref([
  { icon: 'fas fa-database', title: '历史数据分析' },
  { icon: 'fas fa-bell', title: '智能预警' },
  { icon: 'fas fa-lightbulb', title: '优化建议' }
]);

// 风险预警信息
const riskAlerts = ref([
  { message: '检测到潜在质量波动', type: 'warning' },
  { message: '建议调整生产参数', type: 'info' },
  { message: '风险程度', type: 'success' }
]);

// 应用场景
const applications = ref([
  { icon: 'fas fa-microchip', title: '电子元器件', description: '精密电子元器件对金属线的直径和电导率有严格要求', color: '#3b82f6' },
  { icon: 'fas fa-car', title: '汽车线束', description: '汽车线束需要确保每根导线的拉伸强度和耐久性', color: '#10b981' },
  { icon: 'fas fa-robot', title: '工业机器人', description: '机器人内部布线需要高精度检测确保长期稳定运行', color: '#f59e0b' },
  { icon: 'fas fa-rocket', title: '军工航天', description: '军工航天领域对金属线材的性能要求极为严格', color: '#8b5cf6' },
  { icon: 'fas fa-heartbeat', title: '医疗导线', description: '医疗级微细导线需满足生物相容性与超高精度检测标准', color: '#ef4444' }
]);

// 检测模板
const templates = ref([
  {
    name: '铜线标准检测',
    description: '适用于普通铜线的全面性能检测模板，包含线径、拉伸强度、电导率等多项指标',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    tag: '热门',
    specs: '5项检测指标'
  },
  {
    name: '合金线专项检测',
    description: '针对特殊合金线材的专业检测方案，包含成分分析和性能测试',
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    tag: '专业',
    specs: '8项检测指标'
  },
  {
    name: '微细线材检测',
    description: '专为直径小于0.1mm的微细线材设计的检测流程，超高精度要求',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    tag: '精准',
    specs: '6项检测指标'
  }
]);

</script>

<style scoped>
/* 全局重置 - 去掉链接下划线 */
a {
  text-decoration: none;
  color: inherit;
}

/* 去掉列表默认样式 */
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.landing-container {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航 */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 72px;
  max-width: 1600px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.4;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.2;
}

.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: rgba(129, 140, 248, 0.3);
}

.nav-actions {
  display: flex;
  align-items: center;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
  color: white;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(129, 140, 248, 0.4);
}

/* Hero区域 */
.hero-section {
  position: relative;
  min-height: 100vh;
  padding: 120px 72px 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
}

.bg-layer {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.layer-1 {
  width: 800px;
  height: 800px;
  background: #6366f1;
  top: -300px;
  right: -100px;
  animation: pulse 8s ease-in-out infinite;
}

.layer-2 {
  width: 600px;
  height: 600px;
  background: #8b5cf6;
  bottom: -200px;
  left: -50px;
  animation: pulse 10s ease-in-out infinite reverse;
}

.layer-3 {
  width: 400px;
  height: 400px;
  background: #ec4899;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  animation: pulse 6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-container {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.hero-top {
  text-align: center;
}

.hero-intro {
  display: inline-flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
}

.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #a5b4fc;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-heading {
  font-size: 52px;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin: 0;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Hero视觉区域 */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.central-card {
  position: relative;
  width: 500px;
  height: 300px;
  z-index: 2;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: white;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 70%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%);
}

.card-info {
  padding: 20px;
}

.card-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
}

.card-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.card-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border-radius: 32px;
  filter: blur(20px);
  z-index: -1;
}

/* 环绕式悬浮卡片 */
.float-card-group {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.float-card:hover {
  transform: scale(1.05);
}

.card-top-left {
  top: 20px;
  left: 50px;
  animation: float1 4s ease-in-out infinite;
}

.card-top-right {
  top: 40px;
  right: 50px;
  animation: float2 4s ease-in-out infinite 0.5s;
}

.card-bottom-left {
  bottom: 20px;
  left: 80px;
  animation: float3 4s ease-in-out infinite 1s;
}

.card-bottom-right {
  bottom: 40px;
  right: 80px;
  animation: float4 4s ease-in-out infinite 1.5s;
}

@keyframes float1 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes float4 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.float-icon.hardware {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.float-icon.software {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.float-icon.data {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.float-icon.report {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.float-content {
  display: flex;
  flex-direction: column;
}

.float-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.float-status {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.float-status.online {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.float-status.processing {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.float-status.completed {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

/* Hero统计区域 */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stat-purple {
  background: rgba(147, 51, 234, 0.2);
  color: #c084fc;
}

.stat-green {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.stat-blue {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.stat-indigo {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.stat-trend {
  font-size: 14px;
}

.stat-trend.up {
  color: #10b981;
}

.stat-trend.stable {
  color: #64748b;
}

/* 核心功能区域 */
.features-section {
  padding: 100px 72px;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-tag {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}

.section-desc {
  font-size: 16px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.feature-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.feature-card.large-card {
  grid-column: span 2;
  grid-row: span 2;
}

.feature-card.small-card {
  grid-column: span 1;
  grid-row: span 1;
}

.feature-card.hardware-card {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%);
}

.feature-card.software-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
}

.feature-card.small-card.highlight {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.card-icon-box {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon-box.small-icon {
  width: 44px;
  height: 44px;
  font-size: 20px;
}

.hardware-card .card-icon-box {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title-row h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-badge {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

.hardware-card .card-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-content {
  margin-bottom: 20px;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
  line-height: 1.6;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.mini-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 10px;
}

.mini-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.mini-purple {
  background: rgba(147, 51, 234, 0.1);
  color: #9333ea;
}

.mini-green {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.mini-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.mini-red {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.mini-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.mini-text {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-fill.software {
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
}

.progress-text {
  font-size: 13px;
  color: #64748b;
}

.small-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 12px 0 6px;
}

.small-card p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* 表面缺陷检测专题 */
.defect-section {
  padding: 100px 72px;
  background: linear-gradient(135deg, #fef2f2 0%, #fef3c7 50%, #fef9c3 100%);
}

.defect-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1600px;
  margin: 0 auto;
  align-items: center;
}

.content-header {
  margin-bottom: 20px;
}

.content-tag {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 12px;
}

.content-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.content-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #ef4444;
  margin: 0 0 16px;
}

.content-desc {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 24px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  gap: 14px;
}

.feature-color {
  width: 8px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 统计卡片样式 */
.defect-stats {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-red .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.stat-orange .stat-icon {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
}

.stat-yellow .stat-icon {
  background: linear-gradient(135deg, #eab308 0%, #facc15 100%);
}

.stat-green .stat-icon {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.stat-content {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #64748b;
}

.feature-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.feature-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

/* 右侧视觉区域 */
.defect-visual {
  position: relative;
}

.visual-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.visual-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.visual-item.item-1 {
  grid-row: span 2;
}

.visual-item.item-3 {
  grid-column: span 2;
}

.visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-1 .visual-image {
  height: 100%;
  min-height: 300px;
}

.item-2 .visual-image {
  height: 150px;
}

.stats-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stats-ring {
  position: relative;
  width: 140px;
  height: 140px;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #ef4444;
}

.ring-label {
  font-size: 13px;
  color: #64748b;
}

/* 风险预估专题 */
.risk-section {
  padding: 100px 72px;
  background: white;
}

.risk-wrapper {
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 48px;
  background: #fafbfc;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
}

.risk-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  max-width: 1600px;
  margin: 0;
}

/* 评估流程步骤图 */
.flow-card {
  background: white;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.flow-header i {
  color: #6366f1;
  font-size: 18px;
}

.flow-steps {
  display: flex;
  flex-direction: column;
}

.flow-step {
  display: flex;
  gap: 16px;
}

.flow-step:last-child .node-line {
  display: none;
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 48px;
}

.node-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.node-line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: linear-gradient(to bottom, #e2e8f0, #cbd5e0);
  margin: 8px 0;
}

.node-info {
  padding-bottom: 24px;
}

.node-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.node-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.risk-visual {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-card {
  background: #f8fafc;
  border-radius: 24px;
  padding: 28px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.time-select {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #64748b;
}

.chart-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wave-chart {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}

.chart-labels span {
  font-size: 13px;
  color: #64748b;
}

.metrics-grid {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.metric-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 16px;
}

.metric-ring {
  position: relative;
  width: 90px;
  height: 90px;
}

.metric-svg {
  width: 100%;
  height: 100%;
}

.metric-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 700;
  color: #6366f1;
}

.metric-label {
  font-size: 12px;
  color: #64748b;
}

/* 风险内容区域 */
.risk-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 10px;
  font-size: 14px;
  color: #6366f1;
}

.feature-tag i {
  font-size: 14px;
}

.alert-panel {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.alert-header i {
  color: #6366f1;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  font-size: 14px;
}

.alert-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-item.warning .alert-indicator {
  background: #f59e0b;
}

.alert-item.info .alert-indicator {
  background: #3b82f6;
}

.alert-item.success .alert-indicator {
  background: #10b981;
}

.alert-message {
  color: #64748b;
}

/* 应用场景 */
.applications-section {
  padding: 100px 72px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.app-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.app-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.app-card.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.app-card.featured .card-icon-box {
  width: 72px;
  height: 72px;
  font-size: 32px;
}

.app-card.featured h3 {
  font-size: 22px;
}

.app-card.featured p {
  font-size: 15px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-content p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.card-action {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.app-card:hover .card-action {
  opacity: 1;
  transform: translateY(0);
}

/* 检测模板 */
.templates-section {
  padding: 100px 72px;
  background: white;
}

.templates-carousel {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
}

.carousel-wrapper {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: none;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.template-card {
  flex: 0 0 calc(33.33% - 16px);
  min-width: 350px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.template-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.template-card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.95);
  color: #6366f1;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
}

.card-info {
  padding: 24px;
}

.card-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px;
}

.card-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-specs {
  font-size: 13px;
  color: #94a3b8;
}

.card-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: #6366f1;
  color: white;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-nav:hover {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.carousel-nav.prev {
  left: -22px;
}

.carousel-nav.next {
  right: -22px;
}

/* CTA区域 */
.cta-section {
  position: relative;
  padding: 120px 72px;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  animation: circleFloat 8s ease-in-out infinite;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -50px;
  animation: circleFloat 10s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  right: 30%;
  animation: circleFloat 6s ease-in-out infinite;
}

@keyframes circleFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.cta-content {
  position: relative;
  text-align: center;
}

.cta-badge {
  display: inline-block;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 24px;
  margin-bottom: 20px;
}

.cta-heading {
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px;
}

.cta-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cta-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 72px;
  background: white;
  color: #6366f1;
  font-weight: 600;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cta-btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 72px;
  background: transparent;
  color: white;
  font-weight: 600;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 页脚 */
.site-footer {
  background: #0f172a;
  padding: 60px 72px 32px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  max-width: 1600px;
  margin: 0 auto 48px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.brand-desc {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: #1e293b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #6366f1;
  color: white;
}

.footer-links h4 {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 16px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #64748b;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-contact h4 {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 16px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 14px;
}

.contact-item i {
  width: 16px;
  color: #6366f1;
}

.footer-bottom {
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.legal-links {
  display: flex;
  gap: 24px;
}

.legal-links a {
  font-size: 13px;
  color: #64748b;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: white;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-visual {
    height: 350px;
  }
  
  .central-card {
    width: 400px;
    height: 250px;
  }
  
  .float-card {
    padding: 12px 16px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, auto);
  }
  
  .feature-card.large-card {
    grid-column: span 2;
  }
  
  .applications-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .app-card.featured {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 900px) {
  .hero-heading {
    font-size: 36px;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .defect-container,
  .risk-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .visual-grid {
    grid-template-columns: 1fr;
  }
  
  .visual-item.item-1,
  .visual-item.item-3 {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .hero-section {
    padding: 100px 16px 60px;
  }
  
  .hero-heading {
    font-size: 28px;
  }
  
  .hero-visual {
    height: 280px;
  }
  
  .central-card {
    width: 100%;
    height: 200px;
  }
  
  .float-card {
    display: none;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .app-card.featured {
    grid-column: span 1;
  }
  
  .template-card {
    min-width: 100%;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .cta-heading {
    font-size: 28px;
  }
}
</style>