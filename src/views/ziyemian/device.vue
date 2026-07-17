<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">设备管理</h2>
      <p class="page-desc">管理检测设备，查看运行状态</p>
    </div>

    <!-- 操作栏 -->
    <div class="filter-card">
      <div class="filter-row">
        <el-select v-model="searchId" placeholder="选择设备ID" clearable filterable class="filter-input" @change="handleSearch">
          <el-option v-for="d in deviceList" :key="d.deviceId" :label="d.deviceId" :value="d.deviceId" />
        </el-select>
        <span style="flex: 1;"></span>
        <el-button size="small" class="btn-compact" @click="toggleSort"><i class="fas" :class="sortOrder === 'desc' ? 'fa-sort-amount-down' : 'fa-sort-amount-up'"></i> {{ sortOrder === 'desc' ? '倒序' : '正序' }}</el-button>
        <el-button size="small" class="btn-compact" @click="handleRefresh">刷新</el-button>
        <el-button type="primary" size="small" class="btn-compact btn-gradient" @click="handleSearch"><i class="fas fa-search"></i> 查询</el-button>
        <el-button type="success" size="small" class="btn-compact" @click="handleAdd"><i class="fas fa-plus"></i> 新增</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="44" fixed="left" align="center" :selectable="row => !!row.deviceId" />
        <el-table-column prop="deviceId" label="设备ID" width="210" align="center" show-overflow-tooltip />
        <el-table-column prop="deviceCode" label="设备代码" width="180" align="center" />
        <el-table-column label="创建时间" width="170" align="center">
          <template #default="{ row }">{{ row.deviceId ? formatTime(row.createTime) : '' }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="170" align="center">
          <template #default="{ row }">{{ row.deviceId ? formatTime(row.updateTime) : '' }}</template>
        </el-table-column>
        <el-table-column align="center" />
        <el-table-column label="状态" width="190" align="center">
          <template #default="{ row }">
            <template v-if="row.deviceId">
              <span class="device-tag" :class="row.status === 'ON' ? 'tag-on' : 'tag-off'">
                <span class="device-dot"></span>
                {{ row.status === 'ON' ? '运行中' : '已停止' }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right" align="center">
          <template #default="{ row }">
            <template v-if="row.deviceId">
              <el-button type="primary" link size="small" class="action-btn" @click="handleView(row)"><i class="fas fa-eye"></i> 查看</el-button>
              <el-button type="danger" link size="small" class="action-btn" @click="handleDelete(row)"><i class="fas fa-trash-alt"></i> 删除</el-button>
            </template>
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
        @size-change="loadList" @current-change="loadList"
      />
    </div>

    <!-- 新增弹窗 -->
    <el-dialog v-model="formVisible" title="新增设备" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="设备ID">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备代码">
          <el-input v-model="form.deviceCode" placeholder="请输入设备代码" />
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="form.status" style="width: 100%;">
            <el-option label="运行中" value="ON" />
            <el-option label="已停止" value="OFF" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog v-model="viewVisible" title="设备详情" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="设备ID">{{ currentRow.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="设备代码">{{ currentRow.deviceCode }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <span class="device-tag" :class="currentRow.status === 'ON' ? 'tag-on' : 'tag-off'">
            <span class="device-dot"></span>
            {{ currentRow.status === 'ON' ? '运行中' : '已停止' }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentRow.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button type="primary" @click="viewVisible = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import deviceApi from '@/api/device'

const tableData = ref([])
const deviceList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchId = ref('')
const selectedRows = ref([])
const tableRef = ref(null)

const headerCellStyle = {
  background: '#1e293b',
  color: '#f1f5f9',
  fontWeight: 600,
  fontSize: '13px',
  border: 'none',
  padding: '12px 0'
}

const formVisible = ref(false)
const viewVisible = ref(false)
const submitLoading = ref(false)
const currentRow = ref({})
const form = ref({ deviceId: '', deviceCode: '', status: 'ON' })

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const loadDeviceList = async () => {
  try {
    // 加载全部设备用于查重
    const first = await deviceApi.selectDeviceList(1)
    if (!first || first.code !== 200) return
    const all = [...(first.data.records || [])]
    const total = first.data.total || 0
    const totalPages = Math.ceil(total / 10)
    if (totalPages > 1) {
      const reqs = []
      for (let p = 2; p <= totalPages; p++) reqs.push(deviceApi.selectDeviceList(p))
      const results = await Promise.all(reqs)
      results.forEach(r => { if (r && r.code === 200) all.push(...(r.data.records || [])) })
    }
    deviceList.value = all
  } catch {}
}

const loadList = async () => {
  loading.value = true
  try {
    const res = await deviceApi.selectDeviceList(currentPage.value)
    if (res.code === 200) { const rows = res.data.records || []; while (rows.length < pageSize.value) rows.push({}); tableData.value = rows; total.value = res.data.total || 0; sortData() }
    else ElMessage.error(res.message || '查询失败')
  } catch { ElMessage.error('网络请求失败') }
  loading.value = false
}

const handleSearch = () => {
  if (!searchId.value) { loadList(); return }
  deviceApi.selectDeviceId(searchId.value).then(res => {
    if (res.code === 200 && res.data) { tableData.value = [res.data]; total.value = 1 }
    else { ElMessage.warning('未找到该设备'); tableData.value = []; total.value = 0 }
  }).catch(() => { tableData.value = []; total.value = 0 })
}

const handleRefresh = () => { searchId.value = ''; currentPage.value = 1; loadList(); loadDeviceList() }
const handleAdd = () => { form.value = { deviceId: '', deviceCode: '', status: 'ON' }; formVisible.value = true }

const formatTime = (t) => t ? t.replace('T', ' ') : ''
const sortOrder = ref('desc')
const toggleSort = () => { sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'; sortData() }
const sortData = () => {
  const rows = tableData.value.filter(r => r.deviceId)
  const empty = tableData.value.filter(r => !r.deviceId)
  const dir = sortOrder.value === 'asc' ? 1 : -1
  rows.sort((a, b) => dir * (new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()))
  tableData.value = [...rows, ...empty]
}

const handleExport = () => {
  const rows = tableData.value.filter(r => r.deviceId)
  if (!rows.length) { ElMessage.warning('没有可导出的数据'); return }
  const cols = ['deviceId','deviceCode','createTime','updateTime','status']
  const labels = ['设备ID','设备代码','创建时间','更新时间','状态']
  const csv = [labels.join(',')]
  rows.forEach(r => { csv.push(cols.map(c => { const v = r[c]; return v != null ? `"${String(v).replace(/"/g,'""')}"` : '' }).join(',')) })
  const blob = new Blob(['﻿' + csv.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `设备管理_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  ElMessage.success('导出成功')
}
const handleView = (row) => { currentRow.value = { ...row }; viewVisible.value = true }

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除设备 "${row.deviceId}" 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      try {
        const res = await deviceApi.deleteDeviceId(row.deviceId)
        if (res.code === 200) { ElMessage.success('删除成功'); loadList(); loadDeviceList() }
        else ElMessage.error(res.message || '删除失败')
      } catch { ElMessage.error('删除失败，可能权限不足') }
    }).catch(() => {})
}

const handleSubmit = async () => {
  if (!form.value.deviceId) { ElMessage.warning('请输入设备ID'); return }
  if (!form.value.deviceCode) { ElMessage.warning('请输入设备代码'); return }
  const dup = deviceList.value.find(d => String(d.deviceId) === String(form.value.deviceId))
  if (dup) { ElMessage.warning(`设备ID "${form.value.deviceId}" 已存在，请更换`); return }
  submitLoading.value = true
  try {
    const res = await deviceApi.createDevice(form.value)
    if (res.code === 200) { ElMessage.success('创建成功'); formVisible.value = false; loadList(); loadDeviceList() }
    else ElMessage.error(res.message || '操作失败')
  } catch { ElMessage.error('操作失败') }
  submitLoading.value = false
}

onMounted(() => { loadList(); loadDeviceList() })
</script>

<style scoped>
.page-container { padding: 24px; background: #f5f7fa; min-height: calc(100vh - 64px); }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #6b7280; margin: 0; }

/* 操作栏 */
.filter-card { background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
.filter-row { display: flex; gap: 12px; align-items: center; }
.filter-input { width: 240px; flex: none; }
.filter-input :deep(.el-input__wrapper) { border-radius: 10px !important; }

/* 表格 */
.table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.table-card :deep(.el-table__header th) { background: #1e293b !important; color: #f1f5f9; font-weight: 600; font-size: 13px; border: none; }
.table-card :deep(.el-table__body tr) { cursor: pointer; transition: background 0.2s; }
.table-card :deep(.el-table__body tr:hover) { background: #eff6ff !important; }
.table-card :deep(.el-table__body tr:nth-child(even)) { background: #f8fafc; }
.table-card :deep(.el-table__body td) { border-bottom: 1px solid #f1f5f9; padding: 10px 0; white-space: nowrap; }
.table-card :deep(.el-table__body td .cell) { overflow: hidden; text-overflow: ellipsis; }
.table-card :deep(.el-table__fixed-right-patch) { background: #1e293b !important; }
.table-card :deep(.el-table__header th:empty) { border-right: none !important; }

/* 状态标签 */
.device-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.device-dot { width: 6px; height: 6px; border-radius: 50%; }
.tag-on { background: #ecfdf5; color: #059669; } .tag-on .device-dot { background: #10b981; box-shadow: 0 0 4px #10b981; }
.tag-off { background: #f1f5f9; color: #64748b; } .tag-off .device-dot { background: #94a3b8; }

.action-btn { transition: all 0.2s; }
.action-btn:hover { transform: scale(1.08); }

/* 分页 */
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
.btn-export { height: 32px; padding: 0 10px; font-size: 12px; flex: none; }

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

@media (max-width: 768px) {
  .filter-row { flex-wrap: wrap; }
  .filter-input { width: 100%; flex: auto; }
}
</style>
