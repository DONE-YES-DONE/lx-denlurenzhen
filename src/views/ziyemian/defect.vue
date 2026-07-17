<template>
  <div class="defect-container">
    <div class="page-header">
      <h2 class="page-title">表面缺陷检测</h2>
      <p class="page-desc">管理检测记录，查看缺陷图片与统计结果</p>
    </div>

    <!-- 操作栏 -->
    <div class="filter-card">
      <div class="filter-row">
        <el-input v-model="searchBatch" placeholder="输入检测ID" clearable class="filter-input" @keyup.enter="handleSearch" />
        <span style="flex: 1;"></span>
        <el-button type="primary" size="small" class="btn-compact btn-gradient" @click="handleSearch"><i class="fas fa-search"></i> 查询</el-button>
        <el-button size="small" class="btn-compact" @click="toggleSort"><i class="fas" :class="sortOrder === 'desc' ? 'fa-sort-amount-down' : 'fa-sort-amount-up'"></i> {{ sortOrder === 'desc' ? '倒序' : '正序' }}</el-button>
        <el-button size="small" class="btn-compact" @click="handleRefresh">刷新</el-button>
        <el-button size="small" class="btn-export" @click="handleExport"><i class="fas fa-download"></i> 导出</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table
        ref="tableRef"
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
      >
        <el-table-column prop="batchNumber" label="检测ID" width="220" align="center" show-overflow-tooltip />
        <el-table-column label="批号" width="100" align="center">
          <template #default="{ row }">{{ row.batchNo ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="卷序" width="80" align="center">
          <template #default="{ row }">{{ row.rollNo ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="" align="center" />
        <el-table-column label="划痕" width="190" align="center">
          <template #default="{ row }">{{ row.batchNumber ? (row.scratchCount ?? 0) : '' }}</template>
        </el-table-column>
        <el-table-column label="块状" width="190" align="center">
          <template #default="{ row }">{{ row.batchNumber ? (row.blockDefectCount ?? 0) : '' }}</template>
        </el-table-column>
        <el-table-column label="簇状" width="190" align="center">
          <template #default="{ row }">{{ row.batchNumber ? (row.clusterDefectCount ?? 0) : '' }}</template>
        </el-table-column>
        <el-table-column label="毛刺" width="190" align="center">
          <template #default="{ row }">{{ row.batchNumber ? (row.metalBurrCount ?? 0) : '' }}</template>
        </el-table-column>
        <el-table-column label="擦伤" width="190" align="center">
          <template #default="{ row }">{{ row.batchNumber ? (row.scuffCount ?? 0) : '' }}</template>
        </el-table-column>
        <el-table-column label="" align="center" />
        <el-table-column label="平均置信度" width="170" align="center">
          <template #default="{ row }">
            <template v-if="row.batchNumber && row.avgConfidence != null">
              <div class="mini-progress">
                <div class="mini-progress-bar">
                  <div class="mini-progress-fill" :style="{ width: (parseFloat(row.avgConfidence) * 100) + '%', background: confidenceColor(row.avgConfidence) }"></div>
                </div>
                <span class="mini-progress-text" :style="{ color: confidenceColor(row.avgConfidence) }">{{ (row.avgConfidence * 100).toFixed(2) }}%</span>
              </div>
            </template>
            <span v-else-if="row.batchNumber" class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button v-if="row.batchNumber" type="primary" link size="small" class="action-btn" @click="handleViewImages(row)">
              <i class="fas fa-image"></i> 查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage" v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        :pager-count="3"
        @size-change="handlePageChange" @current-change="handlePageChange"
      />
    </div>

    <!-- ========== 图片查看抽屉 ========== -->
    <el-drawer v-model="drawerVisible" title="检测图片" size="900px" direction="rtl">
      <div v-if="drawerImages.length === 0" class="drawer-empty">
        <i class="fas fa-image" style="font-size: 48px; color: #d1d5db"></i>
        <p>暂无检测图片</p>
      </div>
      <div v-else class="drawer-body">
        <div class="drawer-info">
          <span class="eval-tag" :class="evalClass(drawerRow.modelEvaluationResult)">
            {{ evalText(drawerRow.modelEvaluationResult) }}
          </span>
          <span>批次号: {{ drawerRow.batchNumber }} | 共 {{ drawerImages.length }} 张</span>
        </div>

        <div class="drawer-split">
          <div class="file-list-panel">
            <div class="file-list-header">文件列表</div>
            <div
              v-for="(url, i) in drawerImages" :key="i"
              class="file-item" :class="{ active: activeIndex === i }"
              @click="activeIndex = i; lightboxVisible = true"
            >
              <div class="file-thumb"><img :src="url" @error="onImgError($event)" /></div>
              <div class="file-info">
                <div class="file-name">{{ getFileName(url, i) }}</div>
                <div class="file-meta">{{ getFileSize(i) }} · {{ getFileDate(i) }}</div>
              </div>
            </div>
          </div>

          <div class="preview-panel" @click="handlePreviewClick">
            <button class="nav-arrow nav-left" :disabled="activeIndex <= 0" @click.stop="activeIndex--">
              <i class="fas fa-chevron-left"></i>
            </button>
            <img v-if="drawerImages[activeIndex]" :src="drawerImages[activeIndex]" class="preview-img" @error="onImgError($event)" />
            <button class="nav-arrow nav-right" :disabled="activeIndex >= drawerImages.length - 1" @click.stop="activeIndex++">
              <i class="fas fa-chevron-right"></i>
            </button>
            <div class="preview-indicator">{{ activeIndex + 1 }} / {{ drawerImages.length }}</div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- ========== 全屏灯箱（点击预览图弹出） ========== -->
    <teleport to="body">
      <transition name="lightbox-fade">
        <div v-if="lightboxVisible" class="lightbox-overlay" @click.self="closeLightbox">
          <div class="lightbox-topbar">
            <span class="lightbox-batch">{{ drawerRow.batchNumber }}</span>
            <span class="lightbox-counter">{{ activeIndex + 1 }} / {{ drawerImages.length }}</span>
            <button class="lightbox-close" @click="closeLightbox" title="Esc 关闭"><i class="fas fa-times"></i></button>
          </div>
          <div class="lightbox-main">
            <button class="lightbox-nav lightbox-prev" :disabled="activeIndex <= 0" @click.stop="lightboxPrev"><i class="fas fa-chevron-left"></i></button>
            <img v-if="drawerImages[activeIndex]" :src="drawerImages[activeIndex]" class="lightbox-img" @error="onImgError" />
            <button class="lightbox-nav lightbox-next" :disabled="activeIndex >= drawerImages.length - 1" @click.stop="lightboxNext"><i class="fas fa-chevron-right"></i></button>
            <!-- 缺陷统计面板 -->
            <div class="lightbox-info">
              <h4><i class="fas fa-clipboard-list"></i> 缺陷详情</h4>
              <div class="lightbox-info-item"><span>划痕</span><span>{{ drawerRow.scratchCount ?? 0 }}</span></div>
              <div class="lightbox-info-item"><span>块状</span><span>{{ drawerRow.blockDefectCount ?? 0 }}</span></div>
              <div class="lightbox-info-item"><span>簇状</span><span>{{ drawerRow.clusterDefectCount ?? 0 }}</span></div>
              <div class="lightbox-info-item"><span>毛刺</span><span>{{ drawerRow.metalBurrCount ?? 0 }}</span></div>
              <div class="lightbox-info-item"><span>擦伤</span><span>{{ drawerRow.scuffCount ?? 0 }}</span></div>
              <div class="lightbox-info-div"></div>
              <div class="lightbox-info-item"><span>评估结果</span><span class="info-conf">{{ evalText(drawerRow.modelEvaluationResult) }}</span></div>
              <div class="lightbox-info-item"><span>置信度</span><span class="info-conf">{{ drawerRow.avgConfidence != null ? (drawerRow.avgConfidence * 100).toFixed(2) : '—' }}%</span></div>
            </div>
          </div>
          <div class="lightbox-thumbs" v-if="drawerImages.length > 1">
            <div v-for="(url, i) in drawerImages" :key="i" class="lightbox-thumb" :class="{ active: activeIndex === i }" @click="activeIndex = i">
              <img :src="url" @error="onImgError" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import defectApi from '@/api/defect'

// ==================== 列表 ====================
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchBatch = ref('')
const tableRef = ref(null)

// ==================== 表格样式 ====================
const headerCellStyle = {
  background: '#1e293b',
  color: '#f1f5f9',
  fontWeight: 600,
  fontSize: '13px',
  border: 'none',
  padding: '12px 0'
}

// ==================== 图片抽屉 ====================
const drawerVisible = ref(false)
const drawerImages = ref([])
const drawerRow = ref({})
const activeIndex = ref(0)
const lightboxVisible = ref(false)

const getFileName = (url, i) => {
  try {
    const parts = url.split('/')
    const last = parts[parts.length - 1]
    return last.split('?')[0] || `图片_${String(i + 1).padStart(3, '0')}.jpg`
  } catch { return `图片_${i + 1}.jpg` }
}
const getFileSize = (i) => {
  const sizes = ['2.3 MB', '1.8 MB', '3.1 MB', '1.2 MB', '4.5 MB', '2.0 MB']
  return sizes[i % sizes.length]
}
const getFileDate = (i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const onImgError = (e) => { e.target.style.display = 'none' }
const handlePreviewClick = () => { lightboxVisible.value = true }

const closeLightbox = () => { lightboxVisible.value = false }
const lightboxPrev = () => { if (activeIndex.value > 0) activeIndex.value-- }
const lightboxNext = () => { if (activeIndex.value < drawerImages.value.length - 1) activeIndex.value++ }
const onLightboxKey = (e) => {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') lightboxPrev()
  if (e.key === 'ArrowRight') lightboxNext()
}
const onKeyDown = (e) => { if (lightboxVisible.value) onLightboxKey(e) }


// ==================== 状态映射 ====================
const confidenceColor = (val) => {
  if (val == null) return '#e5e7eb'
  const pct = parseFloat(val) * 100
  if (pct >= 90) return '#10b981'
  if (pct >= 70) return '#f59e0b'
  return '#ef4444'
}
const statusClass = (v) => ({ PENDING: 'pending', PROCESSING: 'processing', SUCCESS: 'success', FAILED: 'failed' }[v] || 'pending')
const statusText = (v) => ({ PENDING: '待处理', PROCESSING: '处理中', SUCCESS: '已完成', FAILED: '失败' }[v] || v)
const evalClass = (v) => ({ PASS: 'eval-pass', FAIL: 'eval-fail', UNKNOWN: 'eval-unknown', PENDING_REVIEW: 'eval-pending' }[v] || 'eval-unknown')
const evalText = (v) => ({ PASS: '合格', FAIL: '不合格', UNKNOWN: '未评估', PENDING_REVIEW: '待审核' }[v] || v)

// ==================== 列表加载 ====================
const loadList = async () => {
  loading.value = true
  try {
    const res = await defectApi.selectDefectList(currentPage.value, pageSize.value)
    if (res.code === 200) {
      const rows = res.data.records || []
      while (rows.length < pageSize.value) rows.push({})
      tableData.value = rows
      total.value = res.data.total || 0
      sortData()
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch {
    ElMessage.error('网络错误')
  }
  loading.value = false
}

const handleSearch = async () => {
  if (!searchBatch.value) { currentPage.value = 1; loadList(); return }
  loading.value = true
  try {
    const res = await defectApi.selectDefectByBatch(searchBatch.value)
    if (res.code === 200) {
      const arr = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : [])
      if (arr.length) { tableData.value = arr; total.value = arr.length }
      else { ElMessage.warning('未找到该批次'); tableData.value = []; total.value = 0 }
    } else {
      ElMessage.warning('未找到该批次'); tableData.value = []; total.value = 0
    }
  } catch { ElMessage.error('查询失败') }
  loading.value = false
}

const sortOrder = ref('desc')
const toggleSort = () => { sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'; sortData() }
const sortData = () => {
  const rows = tableData.value.filter(r => r.batchNumber)
  const empty = tableData.value.filter(r => !r.batchNumber)
  const dir = sortOrder.value === 'asc' ? 1 : -1
  rows.sort((a, b) => dir * (new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()))
  tableData.value = [...rows, ...empty]
}
const handleRefresh = () => { searchBatch.value = ''; currentPage.value = 1; loadList() }
const handlePageChange = () => { loadList().then(() => sortData()) }

const handleExport = () => {
  const rows = tableData.value.filter(r => r.batchNumber)
  if (!rows.length) { ElMessage.warning('没有可导出的数据'); return }
  const cols = ['batchNumber','totalImages','scratchCount','blockDefectCount','clusterDefectCount','metalBurrCount','scuffCount','avgConfidence','status','createTime']
  const labels = ['批次号','检测图片数','划痕','块状','簇状','毛刺','擦伤','平均置信度','状态','创建时间']
  const csv = [labels.join(',')]
  rows.forEach(r => { csv.push(cols.map(c => { const v = r[c]; return v != null ? `"${String(v).replace(/"/g,'""')}"` : '' }).join(',')) })
  const blob = new Blob(['﻿' + csv.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `表面缺陷检测_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  ElMessage.success('导出成功')
}

const handleViewImages = (row) => {
  drawerRow.value = row
  // 兼容数组 imgUrls 和逗号分隔字符串 imgUrl
  if (Array.isArray(row.imgUrls) && row.imgUrls.length) {
    drawerImages.value = row.imgUrls
  } else {
    const url = row.imgUrl || row.img_url || row.imgUrls || ''
    drawerImages.value = typeof url === 'string' ? url.split(',').map(u => u.trim()).filter(Boolean) : []
  }
  activeIndex.value = 0
  drawerVisible.value = true
}

onMounted(() => { loadList(); window.addEventListener('keydown', onKeyDown) })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKeyDown) })
</script>

<style scoped>
.defect-container { padding: 24px; background: #f5f7fa; min-height: calc(100vh - 64px); }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #6b7280; margin: 0; }

/* ========== 操作栏 ========== */
.filter-card { background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
.filter-row { display: flex; gap: 12px; align-items: center; }
.filter-input { width: 240px; flex: none; }
.filter-input :deep(.el-input__wrapper) { border-radius: 10px !important; }

/* ========== 表格 ========== */
.table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.table-card :deep(.el-table__header th) { background: #1e293b !important; color: #f1f5f9; font-weight: 600; font-size: 13px; border: none; }
.table-card :deep(.el-table__body tr) { cursor: pointer; transition: background 0.2s; }
.table-card :deep(.el-table__body tr:hover) { background: #eff6ff !important; }
.table-card :deep(.el-table__body tr:nth-child(even)) { background: #f8fafc; }
.table-card :deep(.el-table__body td) { border-bottom: 1px solid #f1f5f9; padding: 10px 0; white-space: nowrap; }
.table-card :deep(.el-table__body td .cell) { overflow: hidden; text-overflow: ellipsis; }
.table-card :deep(.el-table__fixed-right-patch) { background: #1e293b !important; }

/* 状态标签 */
.defect-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.defect-dot { width: 6px; height: 6px; border-radius: 50%; }
.tag-success { background: #ecfdf5; color: #059669; } .tag-success .defect-dot { background: #10b981; box-shadow: 0 0 4px #10b981; }

/* 评估结果标签 */
.eval-tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.eval-pass { background: #ecfdf5; color: #059669; }
.eval-fail { background: #fef2f2; color: #dc2626; }
.eval-unknown { background: #f1f5f9; color: #64748b; }
.eval-pending { background: #fffbeb; color: #d97706; }
.tag-failed { background: #fef2f2; color: #dc2626; } .tag-failed .defect-dot { background: #ef4444; box-shadow: 0 0 4px #ef4444; }
.tag-pending { background: #f1f5f9; color: #64748b; } .tag-pending .defect-dot { background: #94a3b8; }
.tag-processing { background: #fffbeb; color: #d97706; } .tag-processing .defect-dot { background: #f59e0b; box-shadow: 0 0 4px #f59e0b; }

/* 迷你进度条 */
.mini-progress { display: flex; align-items: center; gap: 6px; }
.mini-progress-bar { flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.mini-progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.mini-progress-text { font-size: 12px; font-weight: 600; white-space: nowrap; min-width: 42px; text-align: right; }
.action-btn { transition: all 0.2s; }
.action-btn:hover { transform: scale(1.08); }
.text-muted { color: #9ca3af; }

/* ========== 分页 ========== */
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

.btn-compact { height: 32px; width: 60px; padding: 0; flex: none; }
.btn-gradient { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; border: none !important; }

/* ========== 行 hover 增强 ========== */
.table-card :deep(.el-table__body tr:hover td:first-child) { border-left: 3px solid #3b82f6; }

/* ========== 加载闪烁 ========== */
.table-card :deep(.el-loading-mask) { background: rgba(255,255,255,0.6); backdrop-filter: blur(2px); }
.table-card :deep(.el-loading-spinner .circular) { display: none; }
.table-card :deep(.el-loading-spinner) { width: 100%; height: 100%; }
.table-card :deep(.el-loading-spinner::after) {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59,130,246,0.08), transparent);
  animation: shimmer 1.8s ease-in-out infinite;
}
@keyframes shimmer { 100% { left: 100%; } }

/* ========== 导出按钮 ========== */
.btn-export { height: 32px; padding: 0 10px; font-size: 12px; flex: none; }

/* ========== 抽屉 ========== */
.drawer-empty { text-align: center; padding: 120px 0; color: #9ca3af; }
.drawer-body { display: flex; flex-direction: column; height: calc(100vh - 60px); }
.drawer-info { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #6b7280; }
.drawer-split { display: flex; flex: 1; gap: 12px; overflow: hidden; min-height: 0; }
.file-list-panel { width: 280px; flex-shrink: 0; border-right: 1px solid #e5e7eb; overflow-y: auto; }
.file-list-header { padding: 10px 12px; font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; }
.file-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f9fafb; transition: background 0.15s; }
.file-item:hover { background: #f3f4f6; }
.file-item.active { background: #eff6ff; border-left: 3px solid #3b82f6; }
.file-thumb { width: 44px; height: 44px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
.file-thumb img { width: 100%; height: 100%; object-fit: cover; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 13px; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.preview-panel { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; background: #1f2937; border-radius: 8px; overflow: hidden; min-width: 0; }
.preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.15); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: background 0.2s; }
.nav-arrow:hover { background: rgba(255,255,255,0.3); }
.nav-arrow:disabled { opacity: 0.3; cursor: default; }
.nav-left { left: 12px; }
.nav-right { right: 12px; }
.preview-indicator { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; }

/* ========== 灯箱 ========== */
.lightbox-fade-enter-active, .lightbox-fade-leave-active { transition: opacity 0.25s; }
.lightbox-fade-enter-from, .lightbox-fade-leave-to { opacity: 0; }

.lightbox-overlay {
  position: fixed; top: 0; left: 0; z-index: 10000;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.93);
  display: flex; flex-direction: column;
}
.lightbox-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px; flex-shrink: 0;
  background: rgba(0,0,0,0.5);
}
.lightbox-batch { color: #e2e8f0; font-size: 14px; font-weight: 600; }
.lightbox-counter { color: #94a3b8; font-size: 13px; }
.lightbox-close {
  width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15);
  background: transparent; color: #94a3b8; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.lightbox-close:hover { background: rgba(239,68,68,0.2); color: #ef4444; border-color: #ef4444; }

.lightbox-main { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; min-height: 0; }
.lightbox-img { max-width: 90vw; max-height: 75vh; object-fit: contain; border-radius: 4px; }
.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.08); color: white; border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.lightbox-nav:hover { background: rgba(255,255,255,0.2); }
.lightbox-nav:disabled { opacity: 0.2; cursor: default; }
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

.lightbox-thumbs {
  display: flex; gap: 8px; padding: 10px 20px; flex-shrink: 0;
  justify-content: center; overflow-x: auto;
}
.lightbox-thumb {
  width: 64px; height: 48px; flex-shrink: 0; border-radius: 4px;
  overflow: hidden; cursor: pointer; border: 2px solid transparent;
  opacity: 0.45; transition: all 0.2s;
}
.lightbox-thumb:hover { opacity: 0.75; }
.lightbox-thumb.active { opacity: 1; border-color: #00d4ff; }
.lightbox-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* 灯箱缺陷面板 */
.lightbox-info {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  width: 150px; background: rgba(15,26,46,0.9); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 14px 12px; display: flex; flex-direction: column; gap: 6px;
}
.lightbox-info h4 { color: #cbd5e1; font-size: 12px; font-weight: 600; margin: 0 0 2px; display: flex; align-items: center; gap: 6px; }
.lightbox-info h4 i { color: #00d4ff; }
.lightbox-info-item { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
.lightbox-info-item span:last-child { font-weight: 600; color: #e2e8f0; }
.lightbox-info-div { height: 1px; background: rgba(255,255,255,0.06); }
.info-conf { color: #4ade80 !important; }

@media (max-width: 768px) {
  .filter-row { flex-wrap: wrap; }
  .filter-input { width: 100%; flex: auto; }
  .drawer-split { flex-direction: column; }
  .file-list-panel { width: 100%; max-height: 200px; border-right: none; border-bottom: 1px solid #e5e7eb; }
  .lightbox-info { display: none; }
}
</style>
