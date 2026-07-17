<template>
  <div class="inspection-container">
    <div class="page-header">
      <h2 class="page-title">线材检测管理</h2>
      <p class="page-desc">按批次查看检测数据与参数趋势</p>
    </div>

    <!-- 表格筛选栏 -->
    <div v-show="viewMode === 'table'" class="filter-card">
      <div class="filter-row">
        <el-input v-model="filters.batchNo" placeholder="批号" clearable class="filter-input filter-sm" @keyup.enter="handleSearch" />
        <el-input v-model="filters.deviceId" placeholder="设备ID" clearable class="filter-input filter-sm" @keyup.enter="handleSearch" />
        <el-select v-model="filters.modelEvaluationResult" placeholder="评估结果" clearable class="filter-input filter-sm" @change="handleSearch">
          <el-option label="合格" value="PASS" />
          <el-option label="不合格" value="FAIL" />
          <el-option label="未评估" value="UNKNOWN" />
          <el-option label="待审核" value="PENDING_REVIEW" />
        </el-select>
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="filter-input filter-date"
          @change="handleSearch"
        />
        <el-button link type="primary" size="small" @click="showMore = !showMore" class="btn-more">
          <i :class="showMore ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i> 更多
        </el-button>
        <span style="flex: 1;"></span>
        <div class="view-toggle">
          <button :class="['view-btn', { active: viewMode === 'card' }]" @click="switchView('card')" title="卡片视图">
            <i class="fas fa-th-large"></i>
          </button>
          <button :class="['view-btn', { active: viewMode === 'table' }]" @click="switchView('table')" title="表格视图">
            <i class="fas fa-list"></i>
          </button>
        </div>
        <el-button size="small" class="btn-compact" @click="toggleSort">排序</el-button>
        <el-button size="small" class="btn-compact btn-gradient" @click="handleSearch"><i class="fas fa-search"></i> 查询</el-button>
        <el-button size="small" class="btn-compact" @click="handleRefresh">刷新</el-button>
        <el-button size="small" class="btn-export" @click="handleExport"><i class="fas fa-download"></i> 导出</el-button>
      </div>
      <div v-show="showMore" class="filter-row filter-row-extra">
        <el-input v-model="filters.scenarioCode" placeholder="场景编号" clearable class="filter-input filter-sm" @keyup.enter="handleSearch" />
        <el-input v-model="filters.responsiblePerson" placeholder="负责人" clearable class="filter-input filter-sm" @keyup.enter="handleSearch" />
      </div>
    </div>

    <!-- 卡片工具栏（仅视图切换 + 排序 + 导出） -->
    <div v-show="viewMode === 'card'" class="filter-card">
      <div class="filter-row">
        <el-input v-model="filters.batchNo" placeholder="搜索批次号" clearable class="filter-input filter-sm" @keyup.enter="handleSearch" />
        <span style="flex: 1;"></span>
        <div class="view-toggle">
          <button :class="['view-btn', { active: viewMode === 'card' }]" @click="switchView('card')" title="卡片视图">
            <i class="fas fa-th-large"></i>
          </button>
          <button :class="['view-btn', { active: viewMode === 'table' }]" @click="switchView('table')" title="表格视图">
            <i class="fas fa-list"></i>
          </button>
        </div>
        <el-button size="small" class="btn-compact" @click="toggleSort">排序</el-button>
        <el-button size="small" class="btn-compact btn-gradient" @click="handleSearch"><i class="fas fa-search"></i> 查询</el-button>
        <el-button size="small" class="btn-compact" @click="handleRefresh">刷新</el-button>
        <el-button size="small" class="btn-export" @click="handleExport"><i class="fas fa-download"></i> 导出</el-button>
      </div>
    </div>

    <!-- ==================== 卡片视图 ==================== -->
    <transition name="view-switch" mode="out-in">
    <div v-if="viewMode === 'card'" key="card" class="card-grid" v-loading="cardLoading">
      <div
        v-for="batch in cardData" :key="batch.batchNo"
        class="batch-card"
        :class="{ active: activeBatchNo === batch.batchNo }"
        @click="openBatch(batch)"
      >
        <div class="card-strip"></div>
        <!-- 主体 -->
        <div class="card-body">
          <div class="card-batch-no">#{{ batch.batchNo }}</div>
          <div class="card-meta">
            <span><i class="fas fa-layer-group"></i> {{ batch.scenarioCode || '—' }}</span>
          </div>
          <div class="card-params">
            <div class="card-param">
              <span class="param-key">平均直径</span>
              <span class="param-val">{{ batch.diameter }} mm</span>
            </div>
            <div class="card-param">
              <span class="param-key">平均电导率</span>
              <span class="param-val">{{ batch.resistance }} MS/m</span>
            </div>
            <div class="card-param">
              <span class="param-key">平均延展率</span>
              <span class="param-val">{{ batch.extensibility }}%</span>
            </div>
            <div class="card-param">
              <span class="param-key">平均重量</span>
              <span class="param-val">{{ batch.weight }} g</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="card-hint">点击查看详情 →</span>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ==================== 表格视图 ==================== -->
    <transition name="view-switch" mode="out-in">
    <div v-if="viewMode === 'table'" key="table" class="table-card">
      <el-table
        ref="tableRef"
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        @row-click="openTableRow"
        highlight-current-row
      >
        <el-table-column prop="batchNo" label="批号" width="110" align="center">
          <template #default="{ row }">
            <span class="table-batch-no">#{{ row.batchNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rollNo" label="卷序" width="80" align="center" />
        <el-table-column prop="deviceId" label="设备" width="90" align="center" />
        <el-table-column prop="scenarioCode" label="场景" width="80" align="center" />
        <el-table-column label="直径 (mm)" width="110" align="center">
          <template #default="{ row }">{{ row.diameter }}</template>
        </el-table-column>
        <el-table-column label="电导率(MS/m)" width="100" align="center">
          <template #default="{ row }">{{ row.resistance }}</template>
        </el-table-column>
        <el-table-column label="延展率 (%)" width="110" align="center">
          <template #default="{ row }">{{ row.extensibility }}</template>
        </el-table-column>
        <el-table-column label="重量 (g)" width="100" align="center">
          <template #default="{ row }">{{ row.weight }}</template>
        </el-table-column>
        <el-table-column prop="productionMachine" label="生产设备" width="110" align="center" />
        <el-table-column label="置信度" width="110" align="center">
          <template #default="{ row }">
            <template v-if="row.modelConfidence != null">
              <div class="mini-progress">
                <div class="mini-progress-bar">
                  <div class="mini-progress-fill" :style="{ width: confidencePct(row.modelConfidence) + '%', background: confidenceColor(row.modelConfidence) }"></div>
                </div>
                <span class="mini-progress-text" :style="{ color: confidenceColor(row.modelConfidence) }">{{ confidencePct(row.modelConfidence) }}%</span>
              </div>
            </template>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>

        <el-table-column label="结果" min-width="120" align="center">
          <template #default="{ row }">
            <span class="device-tag" :class="row.tagClass">
              <span class="device-dot"></span>
              {{ row.resultLabel }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="评估" min-width="170" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.evaluationMessage" class="eval-text">{{ row.evaluationMessage }}</span>
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="负责人" min-width="100" align="center" />
        <el-table-column label="时间" width="180" align="center">
          <template #default="{ row }">{{ row.createTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" class="action-btn" @click.stop="handleView(row)"><i class="fas fa-eye"></i> 查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </transition>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage" v-model:page-size="pageSize"
        :total="viewMode === 'card' ? cardTotal : tableTotal"
        layout="total, prev, pager, next, jumper"
        :pager-count="3"
      />
    </div>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="viewVisible" title="卷检测详情" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="批号">{{ currentRow.batchNo }}</el-descriptions-item>
        <el-descriptions-item label="卷序">{{ currentRow.rollNo }}</el-descriptions-item>
        <el-descriptions-item label="设备ID">{{ currentRow.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="场景编号">{{ currentRow.scenarioCode }}</el-descriptions-item>
        <el-descriptions-item label="直径">{{ currentRow.diameter }} mm</el-descriptions-item>
        <el-descriptions-item label="电导率(MS/m)">{{ currentRow.resistance }}</el-descriptions-item>
        <el-descriptions-item label="延展率">{{ currentRow.extensibility }}%</el-descriptions-item>
        <el-descriptions-item label="重量">{{ currentRow.weight }} g</el-descriptions-item>
        <el-descriptions-item label="置信度">{{ currentRow.modelConfidence }}</el-descriptions-item>
        <el-descriptions-item label="评估" :span="2">{{ currentRow.evaluationMessage || '—' }}</el-descriptions-item>
        <el-descriptions-item label="生产设备">{{ currentRow.productionMachine }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentRow.responsiblePerson }}</el-descriptions-item>
        <el-descriptions-item label="工艺类型">{{ currentRow.processType }}</el-descriptions-item>
        <el-descriptions-item label="时间" :span="2">{{ currentRow.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button type="primary" @click="viewVisible = false">关闭</el-button></template>
    </el-dialog>

    <!-- ==================== 详情区域（点击卡片后展开） ==================== -->
    <transition name="slide-fade">
      <div v-if="activeBatch" class="detail-section">
        <div class="detail-header">
          <div class="detail-header-left">
            <button class="back-btn" @click="closeBatch"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3 class="detail-title">批次 #{{ activeBatch.batchNo }}</h3>
          </div>
          <div class="detail-header-right">
            <span>场景 {{ activeBatch.scenarioCode || '—' }}</span>
            <span>{{ activeBatch.rolls?.length || 0 }} 卷</span>
            <span v-if="abnormalCount > 0" class="abnormal-tag"><i class="fas fa-exclamation-circle"></i> {{ abnormalCount }} 卷异常</span>
            <span v-else class="normal-tag"><i class="fas fa-check-circle"></i> 全部合格</span>
          </div>
        </div>

        <!-- 图表类型切换 + 4 张图表 2×2 -->
        <div v-if="activeBatch.rolls && activeBatch.rolls.length" class="charts-area">
          <div class="chart-type-toggle">
            <button :class="['type-btn', { active: chartType === 'line' }]" @click="switchChartType('line')">
              <i class="fas fa-chart-line"></i> 折线图
            </button>
            <button :class="['type-btn', { active: chartType === 'bar' }]" @click="switchChartType('bar')">
              <i class="fas fa-chart-bar"></i> 柱状图
            </button>
          </div>
          <div class="charts-2x2">
          <div class="detail-chart-card">
            <div class="detail-chart-title">直径 (mm)</div>
            <div ref="diameterChartRef" class="detail-chart"></div>
          </div>
          <div class="detail-chart-card">
            <div class="detail-chart-title">重量 (g)</div>
            <div ref="weightChartRef" class="detail-chart"></div>
          </div>
          <div class="detail-chart-card">
            <div class="detail-chart-title">延展率 (%)</div>
            <div ref="extensibilityChartRef" class="detail-chart"></div>
          </div>
          <div class="detail-chart-card">
            <div class="detail-chart-title">电导率 (MS/m)</div>
            <div ref="resistanceChartRef" class="detail-chart"></div>
          </div>
        </div>
        </div>

        <!-- 卷数据表格 -->
        <div v-if="activeBatch.rolls && activeBatch.rolls.length" class="detail-table-wrap">
          <h4 class="detail-table-title">卷明细数据 ({{ activeBatch.rolls.length }} 卷)</h4>
          <el-table :data="activeBatch.rolls" size="small" stripe style="width: 100%" :header-cell-style="headerCellStyle" :row-class-name="detailRowClass">
            <el-table-column type="index" label="#" width="50" align="center" />
            <el-table-column prop="diameter" label="直径 (mm)" align="center" />
            <el-table-column prop="resistance" label="电导率(MS/m)" align="center" />
            <el-table-column prop="extensibility" label="延展率 (%)" align="center" />
            <el-table-column prop="weight" label="重量 (g)" align="center" />
            <el-table-column prop="scenarioCode" label="场景" width="80" align="center" />
          </el-table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import wireMaterialApi from '@/api/wire-material'
import scenarioApi from '@/api/scenario'

// 场景标准范围（从应用场景动态获取）
const stdRanges = ref(null)

// ==================== 筛选 & 分页 ====================
const showMore = ref(false)
const filters = ref({
  batchNo: '',
  deviceId: '',
  scenarioCode: '',
  responsiblePerson: '',
  modelEvaluationResult: '',
  dateRange: null
})
const currentPage = ref(1)
const pageSize = ref(10)
const viewMode = ref('card') // 'card' | 'table'

// ==================== 卡片视图 — 真实数据 ====================
const cardLoading = ref(false)
const cardData = ref([])
const cardTotal = ref(0)

const loadCardData = async () => {
  cardLoading.value = true
  try {
    const res = await wireMaterialApi.selectBatchNoAvg(currentPage.value, pageSize.value)
    const p = res.data ?? res
    cardData.value = (p.records || []).map(r => ({
      batchNo: r.batchNo,
      scenarioCode: r.scenarioCode || '—',
      diameter: r.diameter,
      resistance: r.resistance,
      extensibility: r.extensibility,
      weight: r.weight
    }))
    cardTotal.value = p.total ?? 0
  } catch (e) {
    console.error('卡片数据加载失败', e)
    cardData.value = []
  } finally {
    cardLoading.value = false
  }
}

// ==================== 表格视图 — 真实数据 ====================
const tableRef = ref(null)
const tableLoading = ref(false)
const tableData = ref([])
const tableTotal = ref(0)
const viewVisible = ref(false)
const currentRow = ref({})
const RESULT_MAP = { PASS: '合格', FAIL: '不合格', UNKNOWN: '未评估', PENDING_REVIEW: '待审核' }
const RESULT_TAG_CLASS = { PASS: 'tag-on', FAIL: 'tag-off', UNKNOWN: 'tag-unknown', PENDING_REVIEW: 'tag-unknown' }

const buildTableParams = () => {
  const params = { current: currentPage.value, pageSize: pageSize.value }
  const f = filters.value
  if (f.batchNo) params.batchNo = f.batchNo
  if (f.deviceId) params.deviceId = f.deviceId
  if (f.scenarioCode) params.scenarioCode = f.scenarioCode
  if (f.responsiblePerson) params.responsiblePerson = f.responsiblePerson
  if (f.modelEvaluationResult) params.modelEvaluationResult = f.modelEvaluationResult
  if (f.dateRange?.length === 2) {
    params.startDate = f.dateRange[0]
    params.endDate = f.dateRange[1]
  }
  return params
}

const hasFilters = () => {
  const f = filters.value
  return !!(f.batchNo || f.deviceId || f.scenarioCode || f.responsiblePerson || f.modelEvaluationResult || f.dateRange?.length)
}

const loadTableData = async () => {
  tableLoading.value = true
  try {
    const useConditional = hasFilters()
    const res = useConditional
      ? await wireMaterialApi.selectWirePage(buildTableParams())
      : await wireMaterialApi.selectWireList(currentPage.value, pageSize.value)
    const p = res.data ?? res
    const records = p.records || []
    tableData.value = records.map(r => ({
      ...r,
      tagClass: RESULT_TAG_CLASS[r.modelEvaluationResult] || 'tag-unknown',
      resultLabel: RESULT_MAP[r.modelEvaluationResult] || r.modelEvaluationResult || '—'
    }))
    tableTotal.value = p.total ?? 0
  } catch (e) {
    console.error('表格数据加载失败', e)
    tableData.value = []
  } finally {
    tableLoading.value = false
  }
}

// 切换页码时重新加载
watch([currentPage, pageSize], () => {
  if (viewMode.value === 'card') loadCardData()
  else if (viewMode.value === 'table') loadTableData()
})
watch(viewMode, (mode) => {
  currentPage.value = 1
  pageSize.value = mode === 'card' ? 12 : 10
  if (mode === 'card') loadCardData()
  else if (mode === 'table') loadTableData()
})

const switchView = (mode) => {
  viewMode.value = mode
  pageSize.value = mode === 'card' ? 12 : 10
  currentPage.value = 1
  if (mode === 'card') loadCardData()
  else loadTableData()
}

const handleSearch = () => {
  currentPage.value = 1
  if (viewMode.value === 'card') loadCardData()
  else if (viewMode.value === 'table') loadTableData()
}
const handleRefresh = () => {
  filters.value = { batchNo: '', deviceId: '', scenarioCode: '', responsiblePerson: '', modelEvaluationResult: '', dateRange: null }
  currentPage.value = 1
  if (viewMode.value === 'card') loadCardData()
  else if (viewMode.value === 'table') loadTableData()
}
const toggleSort = () => {
  if (viewMode.value === 'card') {
    cardData.value.reverse()
  } else {
    tableData.value.reverse()
  }
  currentPage.value = 1
}

const headerCellStyle = { background: '#1e293b', color: '#f1f5f9', fontWeight: 600, fontSize: '13px', border: 'none' }

// 图表类型切换
const chartType = ref('line') // 'line' | 'bar'

const confidencePct = (val) => {
  if (val == null) return 0
  // modelConfidence 是 0~1 的小数，转为百分比
  const pct = parseFloat(val)
  return pct <= 1 ? Math.round(pct * 100) : Math.round(pct)
}
const confidenceColor = (val) => {
  if (val == null) return '#e5e7eb'
  const pct = confidencePct(val)
  if (pct >= 90) return '#10b981'
  if (pct >= 70) return '#f59e0b'
  return '#ef4444'
}

// ==================== 导出 ====================
const handleExport = () => {
  let rows = []
  if (viewMode.value === 'card') {
    rows = cardData.value.map(b => ({
      batchNo: b.batchNo, scenarioCode: b.scenarioCode,
      diameter: b.diameter, resistance: b.resistance,
      extensibility: b.extensibility, weight: b.weight
    }))
  } else {
    rows = tableData.value
  }
  if (!rows.length) { ElMessage.warning('没有可导出的数据'); return }
  const cols = viewMode.value === 'card'
    ? ['batchNo','scenarioCode','diameter','resistance','extensibility','weight']
    : ['batchNo','rollNo','deviceId','scenarioCode','diameter','resistance','extensibility','weight','productionMachine','responsiblePerson','evaluationMessage','createTime']
  const labels = viewMode.value === 'card'
    ? ['批次号','场景','直径(mm)','电导率(MS/m)','延展率(%)','重量(g)']
    : ['批次号','卷序','设备ID','场景','直径(mm)','电导率(MS/m)','延展率(%)','重量(g)','生产设备','负责人','评估','检测时间']
  const csv = [labels.join(',')]
  rows.forEach(r => csv.push(cols.map(c => { const v = r[c]; return v != null ? `"${String(v).replace(/"/g,'""')}"` : '' }).join(',')))
  const blob = new Blob(['﻿' + csv.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `线材检测_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  ElMessage.success('导出成功')
}

// ==================== 批次详情 ====================
const activeBatchNo = ref(null)
const activeBatch = computed(() => cardData.value.find(b => b.batchNo === activeBatchNo.value) || null)
const abnormalCount = computed(() => {
  const range = stdRanges.value
  if (!range || !activeBatch.value?.rolls) return 0
  return activeBatch.value.rolls.filter(r => {
    return (range.diameter && (r.diameter < range.diameter.min || r.diameter > range.diameter.max)) ||
           (range.resistance && (r.resistance < range.resistance.min || r.resistance > range.resistance.max)) ||
           (range.extensibility && (r.extensibility < range.extensibility.min || r.extensibility > range.extensibility.max)) ||
           (range.weight && (r.weight < range.weight.min || r.weight > range.weight.max))
  }).length
})

// Chart refs
const diameterChartRef = ref(null)
const resistanceChartRef = ref(null)
const extensibilityChartRef = ref(null)
const weightChartRef = ref(null)
let chartInstances = []

const openBatch = async (batch) => {
  activeBatchNo.value = batch.batchNo
  // 如果还没加载过卷数据，从 API 获取
  if (!batch.rolls) {
    try {
      const res = await wireMaterialApi.selectWirePhysical(batch.batchNo)
      const data = res.data ?? res
      batch.rolls = (Array.isArray(data) ? data : []).map((r, i) => ({
        rollNo: i + 1,
        diameter: r.diameter,
        resistance: r.resistance,
        extensibility: r.extensibility,
        weight: r.weight,
        scenarioCode: r.scenarioCode
      }))
    } catch (e) {
      console.error('卷数据加载失败', e)
      batch.rolls = []
    }
  }
  // 根据场景编号查询标准范围
  const firstRoll = batch.rolls?.[0]
  if (firstRoll?.scenarioCode) {
    try {
      const scenarioRes = await scenarioApi.selectScenarioByCode(firstRoll.scenarioCode)
      const s = scenarioRes.data ?? scenarioRes
      stdRanges.value = {
        diameter:     { min: s.diameterMin,     max: s.diameterMax },
        resistance:   { min: s.conductivityMin, max: s.conductivityMax },
        extensibility:{ min: s.extensibilityMin, max: s.extensibilityMax },
        weight:       { min: s.weightMin,       max: s.weightMax }
      }
    } catch (e) {
      console.error('场景标准范围查询失败', e)
      stdRanges.value = null
    }
  }
  nextTick(() => { renderAllCharts() })
}

// 表格行点击 / 查看详情
const openTableRow = (row) => { handleView(row) }
const handleView = (row) => { currentRow.value = { ...row }; viewVisible.value = true }

const closeBatch = () => {
  activeBatchNo.value = null
  chartInstances.forEach(c => c?.dispose())
  chartInstances = []
}

const detailRowClass = ({ row }) => {
  const range = stdRanges.value
  if (!range) return ''
  const out = (range.diameter && (row.diameter < range.diameter.min || row.diameter > range.diameter.max)) ||
              (range.resistance && (row.resistance < range.resistance.min || row.resistance > range.resistance.max)) ||
              (range.extensibility && (row.extensibility < range.extensibility.min || row.extensibility > range.extensibility.max)) ||
              (range.weight && (row.weight < range.weight.min || row.weight > range.weight.max))
  return out ? 'row-abnormal' : ''
}

const CHART_COLORS = {
  diameter:     ['#818cf8', '#6366f1'],
  resistance:   ['#34d399', '#10b981'],
  extensibility:['#fbbf24', '#f59e0b'],
  weight:       ['#f472b6', '#ec4899']
}

const buildChartOption = (title, rolls, key, unit, type = 'line') => {
  const values = rolls.map(r => r[key])
  const xData = rolls.map(r => '卷' + r.rollNo)
  const range = stdRanges.value?.[key]
  const markLine = range ? {
    silent: true,
    symbol: 'none',
    lineStyle: { type: 'dashed', width: 1.5 },
    data: [
      { yAxis: range.min, name: '下限', label: { formatter: `${range.min}`, position: 'insideStartTop', fontSize: 10, color: '#f59e0b' }, lineStyle: { color: '#f59e0b' } },
      { yAxis: range.max, name: '上限', label: { formatter: `${range.max}`, position: 'end', fontSize: 10, color: '#f59e0b' }, lineStyle: { color: '#f59e0b' } }
    ]
  } : undefined
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p) => {
        // 取最后一个系列（数据点系列，z:10），避免取到线段系列的值
        const entry = Array.isArray(p) ? p[p.length - 1] : p
        let html = `${entry.axisValue}<br/>${title}: <b>${entry.value} ${unit}</b>`
        if (range) {
          const v = Number(entry.value)
          const status = v >= range.min && v <= range.max
            ? '<span style="color:#22c55e">● 合格</span>'
            : '<span style="color:#ef4444">● 不合格</span>'
          html += `<br/>范围 [${range.min}, ${range.max}] ${status}`
        }
        return html
      }
    },
    grid: { left: '8%', right: '6%', bottom: '12%', top: '8%', containLabel: true },
    dataZoom: [
      { type: 'slider', start: 0, end: Math.min(100, Math.ceil(100 * 10 / values.length)), bottom: 6, height: 18, borderColor: 'transparent', backgroundColor: '#f3f4f6', fillerColor: 'rgba(99,102,241,0.2)', handleStyle: { color: '#6366f1' }, textStyle: { fontSize: 10, color: '#6b7280' } },
      { type: 'inside', start: 0, end: Math.min(100, Math.ceil(100 * 10 / values.length)) }
    ],
    xAxis: {
      type: 'category', data: xData,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11, interval: 0 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: (() => {
      if (type === 'bar') {
        return [{
          type: 'bar',
          barWidth: '55%',
          data: values.map(v => {
            let color
            if (range) {
              const devBelow = range.min != null ? Math.max(0, range.min - v) / Math.abs(range.min || 1) : 0
              const devAbove = range.max != null ? Math.max(0, v - range.max) / Math.abs(range.max || 1) : 0
              const ratio = Math.min(1, devBelow + devAbove)
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
            } else {
              color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#86efac' }, { offset: 1, color: '#22c55e' }
              ])
            }
            return { value: v, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }
          }),
          markLine
        }]
      }
      // 逐段着色：两端都合格=绿，两端都不合格=红，一合格一不合格=橙
      const segSeries = []
      for (let i = 0; i < values.length - 1; i++) {
        const startOk = range ? (values[i] >= range.min && values[i] <= range.max) : true
        const endOk = range ? (values[i + 1] >= range.min && values[i + 1] <= range.max) : true
        let segColor
        if (startOk && endOk) segColor = '#22c55e'
        else if (!startOk && !endOk) segColor = '#ef4444'
        else segColor = '#f59e0b'
        segSeries.push({
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: segColor },
          data: values.map((v, j) => (j === i || j === i + 1) ? v : null)
        })
      }
      const lineData = values.map(v => {
        const qualified = range ? (v >= range.min && v <= range.max) : true
        return {
          value: v,
          symbol: 'circle',
          symbolSize: qualified ? 6 : 10,
          itemStyle: { color: qualified ? '#22c55e' : '#ef4444', borderColor: '#fff', borderWidth: 2 }
        }
      })
      // 把 markLine 放在第一个可见线段系列上，确保虚线渲染
      if (segSeries.length > 0) segSeries[0].markLine = markLine
      return [
        ...segSeries,
        { type: 'line', smooth: true, lineStyle: { width: 0 }, symbol: 'circle', data: lineData, z: 10 }
      ]
    })()
  }
}

const switchChartType = (type) => {
  chartType.value = type
  nextTick(() => { renderAllCharts() })
}

function renderAllCharts() {
  chartInstances.forEach(c => c?.dispose())
  chartInstances = []
  const batch = activeBatch.value
  if (!batch?.rolls?.length) return
  const refs = [
    { ref: diameterChartRef, key: 'diameter', unit: 'mm' },
    { ref: weightChartRef, key: 'weight', unit: 'g' },
    { ref: extensibilityChartRef, key: 'extensibility', unit: '%' },
    { ref: resistanceChartRef, key: 'resistance', unit: 'MS/m' }
  ]
  const titles = ['直径', '重量', '延展率', '电导率']
  refs.forEach((r, i) => {
    if (!r.ref.value) return
    const instance = echarts.init(r.ref.value)
    chartInstances.push(instance)
    instance.setOption(buildChartOption(titles[i], batch.rolls, r.key, r.unit, chartType.value))
  })
}

// 初始加载
onMounted(() => { loadCardData() })

// resize
const onResize = () => chartInstances.forEach(c => c?.resize())
watch(activeBatch, (v) => { if (v) nextTick(() => window.addEventListener('resize', onResize)) })
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); chartInstances.forEach(c => c?.dispose()) })
</script>

<style scoped>
.inspection-container { padding: 24px; background: #f5f7fa; min-height: calc(100vh - 64px); }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #6b7280; margin: 0; }

/* ===== 筛选栏 ===== */
.filter-card { background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
.filter-row { display: flex; gap: 12px; align-items: center; }
.filter-input { width: 240px; flex: none; }
.filter-sm { width: 150px; flex: none; }
.filter-date { width: 240px; flex: none; }
.filter-row-extra { margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6; }
.btn-more { flex: none; font-size: 12px; white-space: nowrap; }
.filter-input :deep(.el-input__wrapper) { border-radius: 10px !important; }
.btn-compact { height: 32px; width: 60px; padding: 0; flex: none; }
.btn-gradient { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; border: none !important; color: white !important; }
.btn-export { height: 32px; padding: 0 10px; font-size: 12px; flex: none; }

/* ===== 视图切换 ===== */
.view-toggle { display: flex; gap: 2px; background: #f1f5f9; border-radius: 8px; padding: 3px; }
.view-btn { width: 34px; height: 28px; border: none; background: transparent; border-radius: 6px; cursor: pointer; color: #94a3b8; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.view-btn:hover { color: #6366f1; }
.view-btn.active { background: white; color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* ===== 卡片网格 ===== */
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.batch-card { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; }
.batch-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(99,102,241,0.12), 0 4px 12px rgba(0,0,0,0.08); }
.batch-card:hover .card-strip { width: 6px; }
.batch-card.active { box-shadow: 0 0 0 2px #6366f1, 0 8px 24px rgba(99,102,241,0.15); }

.card-strip { width: 5px; flex-shrink: 0; background: linear-gradient(180deg, #818cf8, #6366f1); border-radius: 3px 0 0 3px; }

.card-body { flex: 1; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.card-top { display: flex; justify-content: space-between; align-items: center; }
.card-result-tag { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
.card-result-tag.pass    { background: #ecfdf5; color: #059669; }
.card-result-tag.fail    { background: #fef2f2; color: #dc2626; }
.card-result-tag.pending { background: #fffbeb; color: #d97706; }
.card-result-tag.unknown { background: #f1f5f9; color: #64748b; }
.card-time { font-size: 11px; color: #9ca3af; }

.card-batch-no { font-size: 18px; font-weight: 700; color: #1f2937; font-family: 'SF Mono', 'Consolas', monospace; }
.card-meta { display: flex; gap: 14px; font-size: 12px; color: #6b7280; }
.card-meta i { color: #94a3b8; margin-right: 3px; font-size: 10px; }

.card-params { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; background: #eff6ff; border-radius: 8px; padding: 10px 12px; }
.card-param { display: flex; justify-content: space-between; font-size: 12px; }
.param-key { color: #9ca3af; }
.param-val { color: #1f2937; font-weight: 600; }

.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-confidence { font-size: 12px; color: #6366f1; font-weight: 600; }
.card-hint { font-size: 11px; color: #93c5fd; transition: color 0.2s; }
.batch-card:hover .card-hint { color: #6366f1; }

/* ===== 分页 ===== */
.pagination-wrapper { display: flex; justify-content: flex-end; align-items: center; margin-top: 16px; padding: 12px 24px; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.pagination-wrapper :deep(.el-pagination__total) { margin-right: auto; }
.pagination-wrapper :deep(.el-pager) { background: #f1f5f9; border-radius: 30px; padding: 3px 4px; }
.pagination-wrapper :deep(.el-pager li) { border: none !important; background: transparent !important; border-radius: 50% !important; min-width: 30px; height: 30px; line-height: 30px; font-weight: 500; }
.pagination-wrapper :deep(.el-pager li.is-active) { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: white !important; }
.pagination-wrapper :deep(.el-pager li:hover:not(.is-active)) { background: #e2e8f0 !important; }
.pagination-wrapper :deep(.btn-prev), .pagination-wrapper :deep(.btn-next) { background: #f1f5f9 !important; border: none !important; border-radius: 50% !important; }
.pagination-wrapper :deep(.btn-prev:hover), .pagination-wrapper :deep(.btn-next:hover) { background: #e2e8f0 !important; }
.pagination-wrapper :deep(.btn-prev:disabled), .pagination-wrapper :deep(.btn-next:disabled) { background: #f1f5f9 !important; color: #cbd5e1 !important; }
.pagination-wrapper :deep(.el-input__wrapper) { border-radius: 10px !important; }

/* ===== 视图切换动画 ===== */
.view-switch-enter-active { transition: all 0.3s ease-out; }
.view-switch-leave-active { transition: all 0.2s ease-in; }
.view-switch-enter-from { opacity: 0; transform: translateY(10px) scale(0.98); }
.view-switch-leave-to { opacity: 0; transform: translateY(-6px) scale(0.99); }

/* ===== 详情区域 ===== */
.slide-fade-enter-active { transition: all 0.35s ease; }
.slide-fade-leave-active { transition: all 0.25s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateY(-12px); }
.slide-fade-leave-to { opacity: 0; }

.detail-section { background: white; border-radius: 16px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; margin-top: 10px; }
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f3f4f6; }
.detail-header-left { display: flex; align-items: center; gap: 12px; }
.back-btn { background: #f3f4f6; border: none; border-radius: 8px; padding: 6px 14px; font-size: 13px; color: #4b5563; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.back-btn:hover { background: #e5e7eb; color: #1f2937; }
.detail-title { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0; }
.detail-result-tag { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
.detail-result-tag.pass    { background: #ecfdf5; color: #059669; }
.detail-result-tag.fail    { background: #fef2f2; color: #dc2626; }
.detail-result-tag.pending { background: #fffbeb; color: #d97706; }
.detail-result-tag.unknown { background: #f1f5f9; color: #64748b; }
.detail-header-right { display: flex; gap: 20px; font-size: 13px; color: #6b7280; align-items: center; }
.abnormal-tag { background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }
.normal-tag { background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; }

/* 批次平均参数大数字 */
.detail-batch-params { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
.detail-big-value { font-size: 22px; font-weight: 700; color: #1f2937; text-align: center; margin-top: 8px; }
.detail-big-value small { font-size: 12px; font-weight: 400; color: #9ca3af; }

@media (max-width: 768px) { .detail-batch-params { grid-template-columns: repeat(2, 1fr); } }

.detail-alert { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px 16px; font-size: 13px; color: #dc2626; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.detail-alert i { font-size: 16px; }

/* 2×2 图表 */
.charts-area { margin-bottom: 18px; }
.chart-type-toggle { display: flex; gap: 4px; background: #f1f5f9; border-radius: 8px; padding: 3px; width: fit-content; margin-bottom: 14px; }
.type-btn { height: 30px; padding: 0 14px; border: none; background: transparent; border-radius: 6px; cursor: pointer; color: #94a3b8; font-size: 13px; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
.type-btn:hover { color: #6366f1; }
.type-btn.active { background: white; color: #6366f1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 600; }
.charts-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.detail-chart-card { background: #f8fafc; border-radius: 12px; padding: 14px 16px; border: 1px solid #e5e7eb; }
.detail-chart-title { font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
.detail-chart { width: 100%; height: 250px; }

/* 卷明细表格 */
.detail-table-wrap { margin-top: 4px; }
.detail-table-title { font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0; }
.cell-abnormal { color: #dc2626; font-weight: 600; font-size: 12px; }
.cell-ok { color: #22c55e; font-weight: 500; font-size: 12px; }
.detail-table-wrap :deep(.row-abnormal) { background: #eff6ff !important; }
.detail-table-wrap :deep(.row-abnormal:hover) { background: #dbeafe !important; }

/* ===== 表格视图（与设备管理一致） ===== */
.table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.table-card :deep(.el-table__header th) { background: #1e293b !important; color: #f1f5f9; font-weight: 600; font-size: 13px; border: none; }
.table-card :deep(.el-table__body tr) { cursor: pointer; transition: background 0.2s; }
.table-card :deep(.el-table__body tr:hover) { background: #eff6ff !important; }
.table-card :deep(.el-table__body tr:nth-child(even)) { background: #f8fafc; }
.table-card :deep(.el-table__body td) { border-bottom: 1px solid #f1f5f9; padding: 10px 0; white-space: nowrap; }
.table-card :deep(.el-table__body td .cell) { overflow: hidden; text-overflow: ellipsis; }
.table-card :deep(.el-table__body tr:hover td:first-child) { border-left: 3px solid #3b82f6; }
.table-card :deep(.el-table__fixed-right-patch) { background: #1e293b !important; }
.table-card :deep(.el-table__header th:empty) { border-right: none !important; }
.table-card :deep(.el-table .current-row > td) { background: #eef2ff !important; }
.table-batch-no { font-weight: 700; color: #1f2937; font-family: 'SF Mono', 'Consolas', monospace; font-size: 14px; }

/* 迷你进度条（置信度） */
.mini-progress { display: flex; align-items: center; gap: 6px; }
.mini-progress-bar { flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.mini-progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.mini-progress-text { font-size: 12px; font-weight: 600; white-space: nowrap; min-width: 42px; text-align: right; }
.text-muted { color: #9ca3af; }
.eval-text { font-size: 12px; color: #4b5563; line-height: 1.4; }

/* 加载闪烁 */
.table-card :deep(.el-loading-mask) { background: rgba(255,255,255,0.6); backdrop-filter: blur(2px); }
.table-card :deep(.el-loading-spinner .circular) { display: none; }
.table-card :deep(.el-loading-spinner) { width: 100%; height: 100%; }
.table-card :deep(.el-loading-spinner::after) {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59,130,246,0.08), transparent);
  animation: shimmer 1.8s ease-in-out infinite;
}
@keyframes shimmer { 100% { left: 100%; } }

/* 设备标签（设备管理同款） */
.device-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.device-dot { width: 6px; height: 6px; border-radius: 50%; }
.tag-on { background: #ecfdf5; color: #059669; } .tag-on .device-dot { background: #10b981; box-shadow: 0 0 4px #10b981; }
.tag-off { background: #f1f5f9; color: #64748b; } .tag-off .device-dot { background: #94a3b8; }
.tag-unknown { background: #fffbeb; color: #d97706; } .tag-unknown .device-dot { background: #f59e0b; box-shadow: 0 0 4px #f59e0b; }

/* ===== 响应式 ===== */
@media (max-width: 1200px) { .card-grid { grid-template-columns: repeat(2, 1fr); } .charts-2x2 { grid-template-columns: 1fr; } }
@media (max-width: 768px)  { .card-grid { grid-template-columns: 1fr; } .filter-row { flex-wrap: wrap; } .filter-input, .filter-sm { width: 100%; flex: auto; } }
</style>
