<template>
  <div class="qr-page" :class="{ 'is-desktop': !isMobile }">
    <!-- 加载态 -->
    <div v-if="loading" class="qr-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>正在加载溯源信息...</p>
    </div>

    <!-- 错误态 -->
    <div v-else-if="errorMsg" class="qr-error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ errorMsg }}</p>
      <button @click="loadData" class="qr-retry-btn">重试</button>
    </div>

    <!-- 数据展示 -->
    <template v-else-if="data">
      <div class="qr-header">
        <h1 class="qr-title">线材溯源信息</h1>
        <div class="qr-batch-info">
          <span class="qr-batch">#{{ data.batchNo }}</span>
          <span class="qr-divider">/</span>
          <span class="qr-roll">卷{{ data.rollNo }}</span>
        </div>
        <div class="qr-url-hint" v-if="isMobile">
          <i class="fas fa-link"></i>
          {{ baseUrl }}/qr/batchNo={{ data.batchNo }}/rollNo={{ data.rollNo }}
        </div>
      </div>

      <!-- ========== 手机端 ========== -->
      <template v-if="isMobile">
        <div class="qr-card qr-result-card">
          <div class="qr-card-title"><i class="fas fa-robot"></i> AI 评估结果</div>
          <div class="qr-result-badge" :class="resultClass">{{ resultLabel }}</div>
          <div class="mini-progress" v-if="confidence != null">
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" :style="{ width: confidence + '%', background: confidenceColor(confidence) }"></div>
            </div>
            <span class="mini-progress-text" :style="{ color: confidenceColor(confidence) }">置信度 {{ confidence }}%</span>
          </div>
        </div>
        <div class="qr-card">
          <div class="qr-card-title"><i class="fas fa-microscope"></i> 物理参数</div>
          <div class="qr-params">
            <div class="qr-param"><span class="qr-param-label">直径</span><span class="qr-param-value">{{ data.diameter ?? '—' }} <small>mm</small></span></div>
            <div class="qr-param"><span class="qr-param-label">电导率</span><span class="qr-param-value">{{ data.resistance ?? '—' }} <small>MS/m</small></span></div>
            <div class="qr-param"><span class="qr-param-label">延展率</span><span class="qr-param-value">{{ data.extensibility ?? '—' }} <small>%</small></span></div>
            <div class="qr-param"><span class="qr-param-label">重量</span><span class="qr-param-value">{{ data.weight ?? '—' }} <small>g</small></span></div>
          </div>
        </div>
        <div class="qr-card">
          <div class="qr-card-title"><i class="fas fa-exclamation-triangle"></i> 缺陷统计</div>
          <div class="qr-defects">
            <div class="qr-defect" v-for="d in defectItems" :key="d.key">
              <div class="qr-defect-label">{{ d.label }}</div>
              <div class="qr-defect-bar-wrap"><div class="qr-defect-bar" :style="{ width: d.pct + '%', background: d.color }"></div></div>
              <span class="qr-defect-count">{{ d.value }}</span>
            </div>
          </div>
          <div v-if="noDefects" class="qr-no-defects">暂无缺陷记录</div>
        </div>
        <div class="qr-card">
          <div class="qr-card-title"><i class="fas fa-industry"></i> 生产追溯</div>
          <div class="qr-params">
            <div class="qr-param"><span class="qr-param-label">设备</span><span class="qr-param-value">{{ data.deviceId || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">生产机器</span><span class="qr-param-value">{{ data.productionMachine || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">工艺类型</span><span class="qr-param-value">{{ data.processType || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">负责人</span><span class="qr-param-value">{{ data.responsiblePerson || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">应用场景</span><span class="qr-param-value">{{ data.scenarioCode || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">检测时间</span><span class="qr-param-value qr-time">{{ fmtTime }}</span></div>
          </div>
        </div>
      </template>

      <!-- ========== 桌面端 ========== -->
      <template v-else>
        <div class="qr-row">
          <div class="qr-card qr-result-card">
            <div class="qr-card-title"><i class="fas fa-robot"></i> AI 评估结果</div>
            <div class="qr-result-badge" :class="resultClass">{{ resultLabel }}</div>
            <div class="mini-progress" v-if="confidence != null">
              <div class="mini-progress-bar">
                <div class="mini-progress-fill" :style="{ width: confidence + '%', background: confidenceColor(confidence) }"></div>
              </div>
              <span class="mini-progress-text" :style="{ color: confidenceColor(confidence) }">置信度 {{ confidence }}%</span>
            </div>
          </div>
          <div class="qr-card">
            <div class="qr-card-title"><i class="fas fa-microscope"></i> 物理参数</div>
            <div class="qr-params">
              <div class="qr-param"><span class="qr-param-label">直径</span><span class="qr-param-value">{{ data.diameter ?? '—' }} <small>mm</small></span></div>
              <div class="qr-param"><span class="qr-param-label">电导率</span><span class="qr-param-value">{{ data.resistance ?? '—' }} <small>MS/m</small></span></div>
              <div class="qr-param"><span class="qr-param-label">延展率</span><span class="qr-param-value">{{ data.extensibility ?? '—' }} <small>%</small></span></div>
              <div class="qr-param"><span class="qr-param-label">重量</span><span class="qr-param-value">{{ data.weight ?? '—' }} <small>g</small></span></div>
            </div>
          </div>
        </div>
        <div class="qr-card">
          <div class="qr-card-title"><i class="fas fa-exclamation-triangle"></i> 缺陷统计</div>
          <div class="qr-defects">
            <div class="qr-defect" v-for="d in defectItems" :key="d.key">
              <div class="qr-defect-label">{{ d.label }}</div>
              <div class="qr-defect-bar-wrap"><div class="qr-defect-bar" :style="{ width: d.pct + '%', background: d.color }"></div></div>
              <span class="qr-defect-count">{{ d.value }}</span>
            </div>
          </div>
          <div v-if="noDefects" class="qr-no-defects">暂无缺陷记录</div>
        </div>
        <div class="qr-card qr-card-trace">
          <div class="qr-card-title"><i class="fas fa-industry"></i> 生产追溯</div>
          <div class="qr-params">
            <div class="qr-param"><span class="qr-param-label">设备</span><span class="qr-param-value">{{ data.deviceId || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">生产机器</span><span class="qr-param-value">{{ data.productionMachine || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">工艺类型</span><span class="qr-param-value">{{ data.processType || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">负责人</span><span class="qr-param-value">{{ data.responsiblePerson || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">应用场景</span><span class="qr-param-value">{{ data.scenarioCode || '—' }}</span></div>
            <div class="qr-param"><span class="qr-param-label">检测时间</span><span class="qr-param-value qr-time">{{ fmtTime }}</span></div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import wireMaterialApi from '@/api/wire-material'

const route = useRoute()
const baseUrl = window.location.origin

const data = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }

const RESULT_MAP = { PASS: '合格', FAIL: '不合格', UNKNOWN: '未评估', PENDING_REVIEW: '待审核' }
const RESULT_CLASS = { PASS: 'pass', FAIL: 'fail', UNKNOWN: 'unknown', PENDING_REVIEW: 'pending' }

const resultLabel = computed(() => RESULT_MAP[data.value?.modelEvaluationResult] || '未评估')
const resultClass = computed(() => RESULT_CLASS[data.value?.modelEvaluationResult] || 'unknown')

const confidence = computed(() => {
  if (data.value?.modelConfidence == null) return null
  const v = parseFloat(data.value.modelConfidence)
  return v <= 1 ? Math.round(v * 100) : Math.round(v)
})
const confidenceColor = (val) => {
  if (val >= 90) return '#10b981'
  if (val >= 70) return '#f59e0b'
  return '#ef4444'
}

const DEFECT_KEYS = [
  { key: 'scratchCount', label: '划痕', color: '#3b82f6' },
  { key: 'blockDefectCount', label: '块状', color: '#f59e0b' },
  { key: 'clusterDefectCount', label: '簇状', color: '#ef4444' },
  { key: 'metalBurrCount', label: '毛刺', color: '#8b5cf6' },
  { key: 'scuffCount', label: '擦伤', color: '#06b6d4' }
]
const defectItems = computed(() => {
  if (!data.value) return []
  const max = Math.max(1, ...DEFECT_KEYS.map(d => data.value[d.key] || 0))
  return DEFECT_KEYS.map(d => ({ ...d, value: data.value[d.key] ?? 0, pct: Math.round(((data.value[d.key] || 0) / max) * 100) }))
})
const noDefects = computed(() => defectItems.value.every(d => d.value === 0))

const fmtTime = computed(() => {
  const t = data.value?.createTime
  if (!t) return '—'
  return t.replace('T', ' ').substring(0, 19)
})

const loadData = async () => {
  loading.value = true
  errorMsg.value = ''
  const batchNo = route.params.batchNo
  const rollNo = route.params.rollNo
  if (!batchNo || !rollNo) {
    errorMsg.value = '缺少批次号或卷序号参数，请扫描正确的二维码'
    loading.value = false
    return
  }
  try {
    const res = await wireMaterialApi.selectWireInfoWithDetection(batchNo, rollNo)
    const d = res.data ?? res
    if (d && d.wireInfo) {
      // API 返回 { wireInfo, defects }
      data.value = { ...d.wireInfo, defects: d.defects || [] }
    } else {
      data.value = d
    }
    loading.value = false
  } catch (e) {
    console.error('溯源信息加载失败', e)
    errorMsg.value = '加载失败，请稍后重试'
    loading.value = false
  }
}

onMounted(() => { loadData(); window.addEventListener('resize', onResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', onResize) })
</script>

<style scoped>
/* ===== 手机端（默认） ===== */
.qr-page {
  max-width: 480px; margin: 0 auto; padding: 20px 16px 40px;
  min-height: 100vh; background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.qr-loading, .qr-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6b7280; gap: 12px; }
.qr-loading i { font-size: 36px; color: #6366f1; }
.qr-error i { font-size: 40px; color: #ef4444; }
.qr-error p { font-size: 14px; margin: 0; }
.qr-retry-btn { margin-top: 8px; padding: 8px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }

.qr-header { text-align: center; margin-bottom: 20px; }
.qr-title { font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 6px 0; }
.qr-batch-info { font-size: 16px; color: #6366f1; font-weight: 600; }
.qr-divider { color: #d1d5db; margin: 0 6px; }
.qr-roll { color: #6b7280; }
.qr-url-hint { margin-top: 8px; font-size: 11px; color: #9ca3af; background: #f1f5f9; padding: 4px 12px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; word-break: break-all; }
.qr-url-hint i { font-size: 10px; }

.qr-card { background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 14px; }
.qr-card-title { font-size: 14px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #f3f4f6; }
.qr-card-title i { color: #6366f1; font-size: 14px; }

.qr-result-card { text-align: center; }
.qr-result-badge { display: inline-block; font-size: 18px; font-weight: 700; padding: 8px 28px; border-radius: 24px; margin-bottom: 12px; }
.qr-result-badge.pass    { background: #ecfdf5; color: #059669; }
.qr-result-badge.fail    { background: #fef2f2; color: #dc2626; }
.qr-result-badge.unknown { background: #f1f5f9; color: #64748b; }
.qr-result-badge.pending { background: #fffbeb; color: #d97706; }

.qr-params { display: flex; flex-direction: column; gap: 10px; }
.qr-param { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f9fafb; }
.qr-param:last-child { border-bottom: none; }
.qr-param-label { font-size: 13px; color: #9ca3af; }
.qr-param-value { font-size: 14px; font-weight: 600; color: #1f2937; }
.qr-param-value small { font-weight: 400; color: #9ca3af; font-size: 11px; }
.qr-time { font-size: 12px !important; }

.mini-progress { display: flex; align-items: center; gap: 8px; padding: 0 8px; }
.mini-progress-bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.mini-progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.mini-progress-text { font-size: 13px; font-weight: 600; white-space: nowrap; }

.qr-defects { display: flex; flex-direction: column; gap: 8px; }
.qr-defect { display: flex; align-items: center; gap: 10px; }
.qr-defect-label { width: 36px; font-size: 12px; color: #6b7280; flex-shrink: 0; }
.qr-defect-bar-wrap { flex: 1; height: 14px; background: #f3f4f6; border-radius: 7px; overflow: hidden; }
.qr-defect-bar { height: 100%; border-radius: 7px; min-width: 4px; transition: width 0.5s ease; }
.qr-defect-count { width: 24px; font-size: 13px; font-weight: 600; color: #374151; text-align: right; }
.qr-no-defects { text-align: center; color: #9ca3af; font-size: 13px; padding: 8px 0; }

/* ===== 桌面端 ===== */
.is-desktop {
  max-width: 900px;
  padding: 32px 40px 60px;
}
.is-desktop .qr-header { margin-bottom: 28px; }
.is-desktop .qr-title { font-size: 26px; }
.is-desktop .qr-batch-info { font-size: 18px; }
.is-desktop .qr-card { padding: 24px; margin-bottom: 0; }
.is-desktop .qr-card-title { font-size: 15px; }
.is-desktop .qr-card-title i { font-size: 15px; }
.is-desktop .qr-result-badge { font-size: 22px; padding: 10px 36px; }
.is-desktop .qr-param-label { font-size: 14px; }
.is-desktop .qr-param-value { font-size: 16px; }

.qr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }

.is-desktop .qr-card-trace { margin-top: 10px; }
</style>
