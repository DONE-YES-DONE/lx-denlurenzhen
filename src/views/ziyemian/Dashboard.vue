<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h2 class="page-title">数据概览</h2>
      <p class="page-desc">实时监控系统运行状态与检测数据</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <template v-if="loadingStates.stats">
        <div class="stat-card" v-for="i in 4" :key="i">
          <el-skeleton animated style="width: 100%">
            <template #template>
              <div style="display: flex; align-items: center; gap: 16px;">
                <el-skeleton-item variant="circle" style="width: 56px; height: 56px;" />
                <div style="flex: 1;">
                  <el-skeleton-item variant="text" style="width: 60%; height: 28px; margin-bottom: 8px;" />
                  <el-skeleton-item variant="text" style="width: 40%; height: 14px;" />
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </template>
      <template v-else>
        <div class="stat-card">
          <div class="stat-icon icon-blue"><i class="fas fa-flask"></i></div>
          <div class="stat-info">
            <h3 class="stat-value">{{ overview.totalChecks.toLocaleString() }}</h3>
            <p class="stat-label">检测总数量</p>
          </div>
          <div class="stat-trend" :class="overview.checksTrendUp ? 'up' : 'down'" v-if="overview.checksTrend">
            <i :class="overview.checksTrendUp ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>较上月 {{ overview.checksTrendUp ? '+' : '-' }}{{ overview.checksTrend }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info">
            <h3 class="stat-value">{{ overview.passRate != null ? overview.passRate + '%' : '--' }}</h3>
            <p class="stat-label">合格率</p>
          </div>
          <div class="stat-trend" :class="overview.passRateTrendUp ? 'up' : 'down'" v-if="overview.passRateTrend">
            <i :class="overview.passRateTrendUp ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>较上月 {{ overview.passRateTrendUp ? '+' : '-' }}{{ overview.passRateTrend }}</span>
          </div>
        </div>
        <div class="stat-card device-card">
          <div class="stat-icon icon-purple"><i class="fas fa-microchip"></i></div>
          <div class="stat-info">
            <h3 class="stat-value">{{ overview.activeDevices }}/{{ overview.totalDevices }}</h3>
            <p class="stat-label">设备数量</p>
          </div>
          <span class="device-inactive">未启动 {{ overview.inactiveDevices }} 台</span>
        </div>
        <div class="stat-card scenario-card">
          <div class="stat-icon icon-orange"><i class="fas fa-layer-group"></i></div>
          <div class="stat-info">
            <h3 class="stat-value">{{ overview.scenarioTypeCount }}</h3>
            <p class="stat-label">应用场景</p>
          </div>
          <span class="scenario-sub">覆盖 {{ overview.scenarioTypeCount }} 类场景</span>
        </div>
      </template>
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <!-- 质量检测统计 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title"><i class="fas fa-chart-bar"></i>质量检测统计</h3>
          <div class="chart-tools">
            <div class="month-picker">
              <el-button size="small" circle @click="prevMonth"><i class="fas fa-chevron-left"></i></el-button>
              <el-date-picker
                v-model="selectedMonth" type="month" placeholder="选择月份"
                format="YYYY年M月" value-format="YYYY-MM" size="small"
                style="width: 130px" @change="onMonthChange"
                :disabled-date="disabledDate"
              />
              <el-button size="small" circle @click="nextMonth" :disabled="isCurrentMonth"><i class="fas fa-chevron-right"></i></el-button>
            </div>
            <el-button size="small" type="primary" plain @click="refreshComboChart">刷新</el-button>
          </div>
        </div>
        <div class="chart-body">
          <el-skeleton v-if="loadingStates.chart" animated style="width: 100%; height: 380px;">
            <template #template>
              <el-skeleton-item variant="rect" style="width: 100%; height: 100%; border-radius: 12px;" />
            </template>
          </el-skeleton>
          <div v-show="!loadingStates.chart" ref="comboChartRef" class="chart-container" style="height: 380px"></div>
        </div>
      </div>
      <!-- 近7天缺陷分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title"><i class="fas fa-chart-pie"></i>近7天缺陷分布</h3>
        </div>
        <div class="chart-body">
          <el-skeleton v-if="loadingStates.defect" animated style="width: 100%; height: 380px;">
            <template #template>
              <el-skeleton-item variant="rect" style="width: 100%; height: 100%; border-radius: 12px;" />
            </template>
          </el-skeleton>
          <div v-show="!loadingStates.defect" ref="defectBarRef" class="chart-container" style="height: 380px"></div>
        </div>
      </div>
    </div>

    <!-- 最新批次物理参数分布 -->
    <div class="chart-card batch-params-card">
      <div class="chart-header">
        <h3 class="chart-title"><i class="fas fa-cubes"></i>最新批次物理参数分布 <span class="batch-no-tag">#{{ latestBatchNo }}</span></h3>
        <span class="batch-roll-count">{{ batchRolls.length }} 卷</span>
        <div class="chart-type-toggle">
          <button :class="['type-btn', { active: batchChartType === 'line' }]" @click="switchBatchChartType('line')">
            <i class="fas fa-chart-line"></i> 折线
          </button>
          <button :class="['type-btn', { active: batchChartType === 'bar' }]" @click="switchBatchChartType('bar')">
            <i class="fas fa-chart-bar"></i> 柱状
          </button>
        </div>
      </div>
      <div class="batch-charts-2x2">
        <div class="mini-chart-card" v-for="(item, i) in paramCharts" :key="i">
          <div class="mini-chart-title">{{ item.label }} <span class="mini-chart-unit">({{ item.unit }})</span></div>
          <div :ref="el => { if (el) batchChartRefs[i] = el }" class="mini-chart"></div>
        </div>
      </div>
    </div>

    <!-- 最近检测记录 -->
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">最近检测记录</h3>
        <el-button type="primary" size="small" plain @click="goToWireMaterial">查看全部</el-button>
      </div>
      <div class="table-body">
        <el-skeleton v-if="loadingStates.records" animated :rows="5" :throttle="0" />
        <el-table v-else :data="recentRecords" style="width: 100%">
          <el-table-column prop="batchNumber" label="批次号" width="140" />
          <el-table-column prop="deviceCode" label="设备编号" width="120" />
          <el-table-column prop="diameter" label="直径(mm)" width="100" />
          <el-table-column prop="result" label="检测结果" width="100">
            <template #default="{ row }"><el-tag :type="getResultTagType(row.result)" size="small">{{ row.result }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="time" label="检测时间" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- ========== 详情弹窗 ========== -->
    <el-dialog v-model="viewVisible" title="检测记录详情" width="800px" top="5vh">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="批次号">{{ currentRow.batchNumber || '—' }}</el-descriptions-item>
          <el-descriptions-item label="批号">{{ currentRow.batchNo ?? currentRow.batch_no ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="卷号">{{ currentRow.rollNo ?? currentRow.roll_no ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="设备ID">{{ currentRow.deviceId || '—' }}</el-descriptions-item>
          <el-descriptions-item label="应用场景">{{ currentRow.scenarioCode || '—' }}</el-descriptions-item>
          <el-descriptions-item label="工艺类型">{{ currentRow.processType || '—' }}</el-descriptions-item>
          <el-descriptions-item label="检测时间" :span="2">{{ currentRow.createTime || '—' }}</el-descriptions-item>
        </el-descriptions>
        <el-divider style="margin: 12px 0" />
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="直径(mm)">{{ currentRow.diameter ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="电导率(MS/m)">{{ currentRow.resistance ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="延展率(%)">{{ currentRow.extensibility ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="重量(g)">{{ currentRow.weight ?? '—' }}</el-descriptions-item>
          <el-descriptions-item label="生产商">{{ currentRow.manufacturer || '—' }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ currentRow.responsiblePerson || '—' }}</el-descriptions-item>
          <el-descriptions-item label="生产机器">{{ currentRow.productionMachine || '—' }}</el-descriptions-item>
          <el-descriptions-item label="联系邮箱" :span="2">{{ currentRow.contactEmail || '—' }}</el-descriptions-item>
        </el-descriptions>
        <el-divider style="margin: 12px 0" />
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="模型评估结果">
            <el-tag :type="evalTag(currentRow.modelEvaluationResult)">
              {{ evalText(currentRow.modelEvaluationResult) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="置信度">
            {{ currentRow.modelConfidence != null ? (currentRow.modelConfidence * 100).toFixed(1) + '%' : '—' }}
          </el-descriptions-item>
          <el-descriptions-item label="评估详情" :span="2">
            {{ currentRow.evaluationMessage || '—' }}
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="currentRow.sourceOriginRaw" style="margin-top: 12px">
          <el-divider style="margin: 12px 0">原始生产信息</el-divider>
          <div class="raw-data-box">{{ currentRow.sourceOriginRaw }}</div>
        </div>
      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import dashboardApi from '@/api/dashboard'
import wireMaterialApi from '@/api/wire-material'
import scenarioApi from '@/api/scenario'

const router = useRouter()

// ==================== 年月选择 ====================
const selectedMonth = ref(formatYearMonth(new Date()))
function formatYearMonth(d) { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); return `${y}-${m}` }
const selectedYear = computed(() => Number(selectedMonth.value.split('-')[0]))
const selectedMonthNum = computed(() => Number(selectedMonth.value.split('-')[1]))
function prevMonth() { const [y, m] = selectedMonth.value.split('-').map(Number); selectedMonth.value = formatYearMonth(new Date(y, m - 2, 1)); onMonthChange() }
function nextMonth() { const [y, m] = selectedMonth.value.split('-').map(Number); selectedMonth.value = formatYearMonth(new Date(y, m, 1)); onMonthChange() }
// 不可选未来月份
const disabledDate = (time) => {
  const now = new Date()
  return time.getFullYear() > now.getFullYear() ||
    (time.getFullYear() === now.getFullYear() && time.getMonth() > now.getMonth())
}
// 当前是否已是本月（禁用右箭头）
const isCurrentMonth = computed(() => {
  const now = new Date()
  return selectedYear.value === now.getFullYear() && selectedMonthNum.value === now.getMonth() + 1
})

// ==================== 独立图表实例 ====================
const comboChartRef = ref(null)
const defectBarRef = ref(null)
let comboChartInstance = null
let defectBarInstance = null

// ==================== 加载状态 ====================
const loadingStates = reactive({
  stats: true,
  chart: true,
  defect: true,
  records: true
})

// 统计概览
const overview = reactive({ totalChecks: 0, checksTrend: null, checksTrendUp: true, passRate: null, passRateTrend: null, passRateTrendUp: true, totalDevices: 0, activeDevices: 0, inactiveDevices: 0, scenarioTypeCount: 0 })

const passRateData = ref({ dates: [], passRates: [] })
const qualityData = ref({ dates: [], passCounts: [], failCounts: [] })
const recentRecords = ref([])
const defectData = ref([0, 0, 0, 0, 0]) // 划痕/块状/簇状/毛刺/擦伤

const getResultTagType = (r) => ({ '合格': 'success', '不合格': 'danger', '待审核': 'warning', '未评估': 'info' }[r] || 'info')

// ==================== 详情弹窗 ====================
const viewVisible = ref(false)
const currentRow = ref({})
const evalTag = (v) => ({ PASS: 'success', FAIL: 'danger', UNKNOWN: 'info', PENDING_REVIEW: 'warning' }[v] || 'info')
const evalText = (v) => ({ PASS: '合格', FAIL: '不合格', UNKNOWN: '未评估', PENDING_REVIEW: '待审核' }[v] || v || '—')

const handleViewDetail = (row) => {
  viewVisible.value = true
  currentRow.value = { ...row }
}

// 跳转到检测管理
const goToWireMaterial = () => router.push('/home/wirematerial')

// ==================== API ====================
const assignIfOk = (res) => { if (res && res.code === 200 && res.data) Object.assign(overview, res.data) }
const loadChecksTotal = async () => {
  try {
    assignIfOk(await dashboardApi.getChecksTotal())
    const trendRes = await dashboardApi.getChecksMonthlyTrend()
    if (trendRes && trendRes.code === 200 && trendRes.data && trendRes.data.checksTrend) {
      overview.checksTrend = trendRes.data.checksTrend
      overview.checksTrendUp = trendRes.data.checksTrendUp
    }
  } catch { ElMessage.error('网络错误') }
}
const loadPassRateOverview = async () => {
  try {
    const now = new Date()
    const res = await dashboardApi.getPassRateOverview(now.getFullYear(), now.getMonth() + 1)
    if (res && res.code === 200 && res.data) overview.passRate = res.data.passRate
    const trendRes = await dashboardApi.getPassRateMonthlyTrend()
    if (trendRes && trendRes.code === 200 && trendRes.data && trendRes.data.passRateTrend) {
      overview.passRateTrend = trendRes.data.passRateTrend
      overview.passRateTrendUp = trendRes.data.passRateTrendUp
    }
  } catch { ElMessage.error('网络错误') }
}
const loadDeviceStatus = async () => {
  try { assignIfOk(await dashboardApi.getDeviceStatus()) } catch { ElMessage.error('网络错误') }
}
const loadScenarioCount = async () => {
  try { assignIfOk(await dashboardApi.getScenarioCount()) } catch { ElMessage.error('网络错误') }
}

const loadStats = async () => {
  await Promise.all([loadChecksTotal(), loadPassRateOverview(), loadDeviceStatus(), loadScenarioCount()])
  loadingStates.stats = false
}

// 最近5条检测记录
const loadRecentRecords = async () => {
  try {
    const res = await dashboardApi.getRecentRecords()
    if (res && res.code === 200 && res.data) recentRecords.value = res.data
  } catch { ElMessage.error('网络错误') }
  loadingStates.records = false
}

// 图表数据
const loadDefectSummary = async () => {
  try {
    const res = await dashboardApi.getDefectSummary()
    if (res && res.code === 200 && res.data) {
      const d = res.data
      defectData.value = [d.scratch || 0, d.block || 0, d.cluster || 0, d.burr || 0, d.scuff || 0]
    }
  } catch { /* 静默失败 */ }
  loadingStates.defect = false
  await nextTick()
  renderDefectBar()
}

// 图表数据（质量）
const loadChartData = async () => {
  try {
    const res = await dashboardApi.getDailyStats(selectedYear.value, selectedMonthNum.value)
    if (res && res.code === 200 && res.data && res.data.length > 0) {
      const arr = res.data
      qualityData.value = {
        dates: arr.map(d => d.day?.slice(-5) || ''),
        passCounts: arr.map(d => d.passCount),
        failCounts: arr.map(d => d.failCount)
      }
      passRateData.value = {
        dates: arr.map(d => d.day?.slice(-5) || ''),
        passRates: arr.map(d => d.passRate)
      }
      return
    }
    // 无数据时清空图表
    qualityData.value = { dates: [], passCounts: [], failCounts: [] }
    passRateData.value = { dates: [], passRates: [] }
  } catch {
    ElMessage.error('网络错误')
    qualityData.value = { dates: [], passCounts: [], failCounts: [] }
    passRateData.value = { dates: [], passRates: [] }
  }
}
// ==================== 图表渲染
const comboOption = () => {
  const count = passRateData.value.passRates.length
  const hasEnough = count >= 3
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['合格率', '合格数量', '不合格数量'], right: 20, top: 0, textStyle: { fontSize: 12 } },
    grid: { left: '8%', right: '6%', bottom: '8%', top: '22%', containLabel: true },
    dataZoom: count > 0 ? [{ type: 'slider', start: 0, end: 100, bottom: 6, height: 20, borderColor: 'transparent', backgroundColor: '#f3f4f6', fillerColor: 'rgba(99,102,241,0.2)', handleStyle: { color: '#6366f1' }, textStyle: { fontSize: 10, color: '#6b7280' } }] : [],
    xAxis: { type: 'category', data: qualityData.value.dates, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false } },
    yAxis: [
      { type: 'value', axisLabel: { color: '#6b7280' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
      { type: 'value', axisLabel: { color: '#6b7280', formatter: '{value}%' }, splitLine: { show: false } }
    ],
    series: [
      { name: '合格数量', type: 'bar', yAxisIndex: 0, barWidth: '40%', barGap: '30%', data: qualityData.value.passCounts, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4ade80' }, { offset: 1, color: '#22c55e' }]), borderRadius: [4, 4, 0, 0] }, label: { show: false } },
      { name: '不合格数量', type: 'bar', yAxisIndex: 0, barWidth: '40%', data: qualityData.value.failCounts, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#fca5a5' }, { offset: 1, color: '#ef4444' }]), borderRadius: [4, 4, 0, 0] }, label: { show: false } },
      { name: '合格率', type: 'line', yAxisIndex: 1, smooth: hasEnough, symbol: hasEnough ? 'emptyCircle' : 'circle', symbolSize: hasEnough ? 8 : 6, data: passRateData.value.passRates, lineStyle: { color: '#6366f1', width: 3 }, itemStyle: { color: '#6366f1', borderWidth: 2 }, areaStyle: hasEnough ? { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(99,102,241,0.25)' }, { offset: 1, color: 'rgba(99,102,241,0.02)' }]) } : undefined, label: { show: true, position: 'top', distance: 12, color: '#6366f1', fontWeight: 'bold', fontSize: 10, formatter: '{c}%' } }
    ]
  }
}

// 初始化 / 刷新
function renderCombo() {
  if (!comboChartRef.value) return
  if (!comboChartInstance) comboChartInstance = echarts.init(comboChartRef.value)
  comboChartInstance.setOption(comboOption(), true)
}

const DEFECT_LABELS = ['划痕', '块状', '簇状', '毛刺', '擦伤']
const DEFECT_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function renderDefectBar() {
  if (!defectBarRef.value) return
  if (!defectBarInstance) defectBarInstance = echarts.init(defectBarRef.value)
  const hasData = defectData.value.some(v => v > 0)
  defectBarInstance.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '8%', right: '8%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: DEFECT_LABELS,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#6b7280' },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [{
      type: 'bar',
      barWidth: '50%',
      data: hasData
        ? defectData.value.map((v, i) => ({ value: v, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: DEFECT_COLORS[i] }, { offset: 1, color: DEFECT_COLORS[i] + '88' }]), borderRadius: [6, 6, 0, 0] } }))
        : [],
      label: { show: true, position: 'top', color: '#6b7280', fontSize: 11, fontWeight: 600 }
    }]
  }, true)
}

// ---- 刷新质量图 ----
const refreshComboChart = async () => {
  loadingStates.chart = true
  await loadChartData()
  await nextTick()
  renderCombo()
  loadingStates.chart = false
}

// ---- 月份切换 ----
const onMonthChange = () => {
  refreshComboChart()
}

// resize
const handleResize = () => { comboChartInstance?.resize(); defectBarInstance?.resize(); batchChartInstances.forEach(c => c?.resize()) }

// ==================== 最新批次物理参数分布 ====================
const batchChartRefs = ref([])
let batchChartInstances = []
const latestBatchNo = ref(null)
const batchRolls = ref([])
const batchChartType = ref('line')

const switchBatchChartType = (type) => {
  batchChartType.value = type
  nextTick(() => renderBatchCharts())
}

const paramCharts = [
  { label: '直径', unit: 'mm', key: 'diameter' },
  { label: '电导率', unit: 'MS/m', key: 'resistance' },
  { label: '延展率', unit: '%', key: 'extensibility' },
  { label: '重量', unit: 'g', key: 'weight' }
]
const stdRange = ref(null) // 动态获取的场景标准范围

const loadBatchPhysical = async () => {
  try {
    const res = await wireMaterialApi.selectWirePhysical() // 不传 batchNo → 查最近批次
    const data = res.data ?? res
    const list = Array.isArray(data) ? data : []
    batchRolls.value = list.map((r, i) => ({
      rollNo: i + 1,
      diameter: r.diameter,
      resistance: r.resistance,
      extensibility: r.extensibility,
      weight: r.weight,
      scenarioCode: r.scenarioCode
    }))
    latestBatchNo.value = list[0]?.batchNo ?? '—'

    // 根据场景编号查询真实标准范围
    const scenarioCode = list[0]?.scenarioCode
    if (scenarioCode) {
      try {
        const sr = await scenarioApi.selectScenarioByCode(scenarioCode)
        const s = sr.data ?? sr
        stdRange.value = {
          diameter: { min: s.diameterMin, max: s.diameterMax },
          resistance: { min: s.conductivityMin, max: s.conductivityMax },
          extensibility: { min: s.extensibilityMin, max: s.extensibilityMax },
          weight: { min: s.weightMin, max: s.weightMax }
        }
      } catch { stdRange.value = null }
    }
  } catch (e) {
    console.error('最新批次数据加载失败', e)
    batchRolls.value = []
  }
  nextTick(() => renderBatchCharts())
}

function renderBatchCharts() {
  batchChartInstances.forEach(c => c?.dispose())
  batchChartInstances = []
  paramCharts.forEach((p, i) => {
    const el = batchChartRefs.value[i]
    if (!el) return
    const instance = echarts.init(el)
    batchChartInstances.push(instance)
    const values = batchRolls.value.map(r => r[p.key])
    const xData = batchRolls.value.map(r => '卷' + r.rollNo)
    const isLine = batchChartType.value === 'line'
    const sceneRange = stdRange.value?.[p.key]
    const range = sceneRange || { min: p.min ?? 0.80, max: p.max ?? 0.95 }

    const buildDataZoom = (vals) => [
      { type: 'slider', start: 0, end: Math.min(100, Math.ceil(100 * 10 / vals.length)), bottom: 6, height: 18, borderColor: 'transparent', backgroundColor: '#f3f4f6', fillerColor: 'rgba(99,102,241,0.2)', handleStyle: { color: '#6366f1' }, textStyle: { fontSize: 10, color: '#6b7280' } },
      { type: 'inside', start: 0, end: Math.min(100, Math.ceil(100 * 10 / vals.length)) }
    ]

    const markLine = {
      silent: true,
      symbol: 'none',
      lineStyle: { type: 'dashed', width: 1.5 },
      data: [
        { yAxis: range.min, name: '下限', label: { formatter: `${range.min}`, position: 'insideStartTop', fontSize: 10, color: '#f59e0b' }, lineStyle: { color: '#f59e0b' } },
        { yAxis: range.max, name: '上限', label: { formatter: `${range.max}`, position: 'end', fontSize: 10, color: '#f59e0b' }, lineStyle: { color: '#f59e0b' } }
      ]
    }

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const v = params[0].value
          let html = `${params[0].axisValue}<br/>${p.label}: <b>${v} ${p.unit}</b>`
          const status = v >= range.min && v <= range.max
            ? '<span style="color:#22c55e">● 合格</span>'
            : '<span style="color:#ef4444">● 不合格</span>'
          html += `<br/>范围 [${range.min}, ${range.max}] ${status}`
          return html
        }
      },
      grid: { left: '8%', right: '6%', bottom: '12%', top: '8%', containLabel: true },
      dataZoom: buildDataZoom(values),
      xAxis: {
        type: 'category', data: xData,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11, interval: 0 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 10 },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      }
    }

    if (isLine) {
      // 逐段着色：两端都合格=绿线，否则=红线
      const segSeries = []
      for (let i = 0; i < values.length - 1; i++) {
        const qA = values[i] >= range.min && values[i] <= range.max
        const qB = values[i + 1] >= range.min && values[i + 1] <= range.max
        const segColor = (qA && qB) ? '#22c55e' : '#ef4444'
        segSeries.push({
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: segColor },
          data: values.map((v, j) => (j === i || j === i + 1) ? v : null)
        })
      }
      option.series = [
        ...segSeries,
        {
          type: 'line',
          smooth: true,
          lineStyle: { width: 0 },
          symbol: 'circle',
          data: values.map(v => {
            const qualified = v >= range.min && v <= range.max
            return {
              value: v,
              symbolSize: qualified ? 6 : 10,
              itemStyle: { color: qualified ? '#22c55e' : '#ef4444', borderColor: '#fff', borderWidth: 2 }
            }
          }),
          markLine,
          z: 10
        }
      ]
    } else {
      option.series = [{
        type: 'bar',
        barWidth: '55%',
        data: values.map(v => {
          const devBelow = Math.max(0, range.min - v) / Math.abs(range.min || 1)
          const devAbove = Math.max(0, v - range.max) / Math.abs(range.max || 1)
          const ratio = Math.min(1, devBelow + devAbove)
          let color
          if (ratio <= 0.01) {
            color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#86efac' }, { offset: 1, color: '#22c55e' }
            ])
          } else {
            const r = Math.round(239 - ratio * 40)
            const g = Math.round(68 - ratio * 50)
            const b = Math.round(68 - ratio * 50)
            color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgb(${r + 16},${g + 10},${b + 10})` },
              { offset: 1, color: `rgb(${r},${g},${b})` }
            ])
          }
          return { value: v, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }
        }),
        markLine
      }]
    }
    instance.setOption(option, true)
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  loadStats()
  loadRecentRecords()
  loadDefectSummary()
  loadBatchPhysical()
  await loadChartData()
  await nextTick()
  loadingStates.chart = false
  await nextTick()
  renderCombo()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  comboChartInstance?.dispose()
  defectBarInstance?.dispose()
  batchChartInstances.forEach(c => c?.dispose())
})

</script>

<style scoped>
.dashboard-container { padding: 24px; background: #f5f7fa; min-height: 100vh; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #6b7280; margin: 0; }

.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-card { background: white; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: all 0.3s; }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; flex-shrink: 0; }
.icon-blue  { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
.icon-green { background: linear-gradient(135deg, #22c55e, #4ade80); }
.icon-orange { background: linear-gradient(135deg, #f97316, #fb923c); }
.icon-purple { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.stat-info { flex: 1; }
.stat-value { font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 4px 0; }
.stat-label { font-size: 14px; color: #6b7280; margin: 0; }
.stat-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.stat-trend.up     { color: #22c55e; }
.stat-trend.down   { color: #ef4444; }
.stat-trend.stable { color: #6b7280; }
.device-card { position: relative; }
.device-inactive { position: absolute; right: 16px; bottom: 12px; font-size: 12px; font-weight: 600; color: #ef4444; display: flex; align-items: center; gap: 4px; }
.scenario-card { position: relative; }
.scenario-sub { position: absolute; right: 16px; bottom: 12px; font-size: 12px; font-weight: 600; color: #6b7280; display: flex; align-items: center; gap: 4px; }

.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.chart-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.chart-title { font-size: 16px; font-weight: 600; color: #1f2937; margin: 0; display: flex; align-items: center; gap: 8px; }
.chart-title i { color: #6366f1; font-size: 16px; }
.chart-tools { display: flex; align-items: center; gap: 10px; }
.month-picker { display: flex; align-items: center; gap: 8px; }
.chart-body { width: 100%; }
.chart-container { width: 100%; height: 320px; }

/* ========== 预警提示 ========== */
.alert-section { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 24px; }
.alert-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.alert-header-right { display: flex; align-items: center; gap: 8px; }
.alert-title { font-size: 18px; font-weight: 600; color: #1f2937; margin: 0; display: flex; align-items: center; gap: 8px; }
.alert-title i { color: #f59e0b; font-size: 20px; }
.alert-badge { font-size: 13px; font-weight: 600; color: #ef4444; background: #fef2f2; padding: 4px 12px; border-radius: 20px; border: 1px solid #fecaca; }
.alert-badge-total { color: #6366f1; background: #eef2ff; border-color: #c7d2fe; }

/* 左右两栏布局 */
.alert-body { display: flex; gap: 20px; min-height: 360px; }

/* ===== 左侧：详细信息 ===== */
.alert-detail { flex: 1; background: #f8fafc; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.alert-detail-top { display: flex; align-items: center; gap: 12px; }
.alert-detail-level { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; padding: 4px 14px; border-radius: 20px; }
.alert-detail-level.critical { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.alert-detail-level.warn      { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.alert-detail-level.info      { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.alert-detail-batch { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0; }
.alert-detail-desc { font-size: 14px; color: #6b7280; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
.alert-detail-desc i { color: #f59e0b; margin-top: 2px; flex-shrink: 0; }

/* AI 分析文本 */
.alert-detail-ai { flex: 1; overflow-y: auto; min-height: 0; }
.ai-analysis-label { font-size: 14px; font-weight: 600; color: #6366f1; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; user-select: none; }
.ai-analysis-label:hover { color: #4f46e5; }
.ai-hint { font-size: 11px; font-weight: 400; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 10px; }
.ai-analysis-label i { font-size: 16px; }
.ai-analysis-text { font-size: 13px; color: #4b5563; line-height: 1.7; white-space: pre-wrap; max-height: 200px; overflow-y: auto; font-family: 'SF Mono', 'Consolas', monospace; }

.alert-detail-params { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.param-item { background: white; border-radius: 8px; padding: 10px 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 2px; }
.param-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.param-value { font-size: 16px; font-weight: 600; color: #1f2937; }
.param-value.warn { color: #d97706; }
.param-value.fail { color: #dc2626; }

.alert-detail-type { font-size: 13px; color: #6366f1; background: #eef2ff; padding: 3px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px; }
.alert-detail-stats { display: flex; flex-direction: column; gap: 12px; }
.risk-stat { display: flex; flex-direction: column; gap: 4px; }
.risk-stat-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.risk-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.alert-detail-empty { display: flex; align-items: center; justify-content: center; min-height: 200px; }
.empty-hint { font-size: 16px; color: #9ca3af; display: flex; align-items: center; gap: 8px; }
.empty-hint i { color: #22c55e; font-size: 22px; }

/* 迷你进度条（预警区） */
.mini-progress { display: flex; align-items: center; gap: 6px; }
.mini-progress-bar { flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.mini-progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.mini-progress-text { font-size: 13px; font-weight: 600; white-space: nowrap; min-width: 42px; text-align: right; }

.alert-detail-actions { display: flex; gap: 10px; margin-top: auto; padding-top: 4px; }

/* ===== 右侧：预警滚动列表 ===== */
.alert-scroll { width: 360px; flex-shrink: 0; overflow-y: auto; max-height: 420px; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
.alert-scroll::-webkit-scrollbar { width: 4px; }
.alert-scroll::-webkit-scrollbar-track { background: transparent; }
.alert-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
.alert-scroll::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

.alert-scroll-item { padding: 12px 14px; border-radius: 10px; border-left: 4px solid transparent; cursor: pointer; transition: all 0.2s; }
.alert-scroll-item:hover { transform: translateX(4px); }
.alert-scroll-item.active { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.alert-scroll-item.critical { background: #fef2f2; border-left-color: #ef4444; }
.alert-scroll-item.critical.active { background: #fee2e2; }
.alert-scroll-item.warn      { background: #fffbeb; border-left-color: #f59e0b; }
.alert-scroll-item.warn.active { background: #fef3c7; }
.alert-scroll-item.info      { background: #eff6ff; border-left-color: #3b82f6; }
.alert-scroll-item.info.active { background: #dbeafe; }

.scroll-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.scroll-level-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.tag-critical { background: #fecaca; color: #dc2626; }
.tag-warn      { background: #fde68a; color: #d97706; }
.tag-info      { background: #bfdbfe; color: #2563eb; }
.scroll-time { font-size: 12px; color: #9ca3af; }

.scroll-item-batch { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
.scroll-item-desc { font-size: 13px; color: #6b7280; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.table-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.table-title { font-size: 16px; font-weight: 600; color: #1f2937; margin: 0; }

/* ===== 最新批次物理参数 ===== */
.batch-params-card { margin-bottom: 24px; }
.batch-no-tag { font-size: 13px; font-weight: 600; color: #6366f1; background: #eef2ff; padding: 2px 10px; border-radius: 10px; margin-left: 8px; }
.batch-roll-count { font-size: 13px; color: #9ca3af; margin-right: 12px; }
.chart-type-toggle { display: flex; gap: 2px; background: #f1f5f9; border-radius: 6px; padding: 2px; }
.type-btn { height: 26px; padding: 0 10px; border: none; background: transparent; border-radius: 4px; cursor: pointer; color: #94a3b8; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 4px; }
.type-btn:hover { color: #6366f1; }
.type-btn.active { background: white; color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-weight: 600; }
.batch-charts-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mini-chart-card { background: #f8fafc; border-radius: 10px; padding: 12px 14px; border: 1px solid #e5e7eb; }
.mini-chart-title { font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 4px; }
.mini-chart-unit { font-size: 11px; color: #9ca3af; font-weight: 400; }
.mini-chart { width: 100%; height: 240px; }

@media (max-width: 1200px) { .stats-cards { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } .batch-charts-2x2 { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .stats-cards { grid-template-columns: 1fr; } }

.raw-data-box {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #6b7280;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}
</style>
