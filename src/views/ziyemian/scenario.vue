<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">应用场景管理</h2>
      <p class="page-desc">管理线材检测应用场景与检测标准</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-card">
      <div class="filter-row">
        <el-select v-model="wireType" class="filter-select">
          <el-option label="所有类型" value="" />
          <el-option label="铜丝(Cu)" value="Cu" />
          <el-option label="铝丝(Al)" value="Al" />
          <el-option label="镍丝(Ni)" value="Ni" />
          <el-option label="钛丝(Ti)" value="Ti" />
          <el-option label="锌丝(Zn)" value="Zn" />
        </el-select>
        <el-input v-model="scenarioName" placeholder="输入场景名称搜索" class="filter-input" @keyup.enter="handleSearch" />
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
        <el-table-column type="selection" width="44" fixed="left" align="center" :selectable="row => !!row.scenarioCode" />
        <el-table-column prop="scenarioCode" label="场景编号" width="100" align="center" />
        <el-table-column prop="scenarioName" label="场景名称" min-width="160" align="center" />
        <el-table-column label="线材类型" width="100" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">
              <span class="scenario-tag tag-wire">{{ row.wireType }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="电导率范围" min-width="130" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">{{ row.conductivityMin }} ~ {{ row.conductivityMax }}</template>
          </template>
        </el-table-column>
        <el-table-column label="延展率范围(%)" min-width="130" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">{{ row.extensibilityMin }} ~ {{ row.extensibilityMax }}</template>
          </template>
        </el-table-column>
        <el-table-column label="重量范围(g)" min-width="120" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">{{ row.weightMin }} ~ {{ row.weightMax }}</template>
          </template>
        </el-table-column>
        <el-table-column label="直径范围(mm)" min-width="130" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">{{ row.diameterMin }} ~ {{ row.diameterMax }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <template v-if="row.scenarioCode">
              <el-button type="primary" link size="small" class="action-btn" @click="handleView(row)"><i class="fas fa-eye"></i> 查看</el-button>
              <el-button type="warning" link size="small" class="action-btn" @click="handleEdit(row)"><i class="fas fa-edit"></i> 编辑</el-button>
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
        @size-change="handleSizeChange" @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="场景编号" v-if="isEdit">
          <el-input v-model="form.scenarioCode" disabled />
        </el-form-item>
        <el-form-item label="场景名称">
          <el-input v-model="form.scenarioName" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="线材类型">
          <el-select v-model="form.wireType" style="width: 100%;">
            <el-option label="铜丝(Cu)" value="Cu" />
            <el-option label="铝丝(Al)" value="Al" />
            <el-option label="镍丝(Ni)" value="Ni" />
            <el-option label="钛丝(Ti)" value="Ti" />
            <el-option label="锌丝(Zn)" value="Zn" />
          </el-select>
        </el-form-item>
        <el-divider content-position="left">检测标准</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="电导率下限"><el-input-number v-model="form.conductivityMin" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="电导率上限"><el-input-number v-model="form.conductivityMax" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="延展率下限(%)"><el-input-number v-model="form.extensibilityMin" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="延展率上限(%)"><el-input-number v-model="form.extensibilityMax" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="重量下限(g)"><el-input-number v-model="form.weightMin" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="重量上限(g)"><el-input-number v-model="form.weightMax" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="直径下限(mm)"><el-input-number v-model="form.diameterMin" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="直径上限(mm)"><el-input-number v-model="form.diameterMax" :precision="2" :step="0.1" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog v-model="viewVisible" title="场景详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="场景编号">{{ currentRow.scenarioCode }}</el-descriptions-item>
        <el-descriptions-item label="场景名称">{{ currentRow.scenarioName }}</el-descriptions-item>
        <el-descriptions-item label="线材类型"><span class="scenario-tag tag-wire">{{ currentRow.wireType }}</span></el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="电导率">{{ currentRow.conductivityMin }} ~ {{ currentRow.conductivityMax }}</el-descriptions-item>
        <el-descriptions-item label="延展率(%)">{{ currentRow.extensibilityMin }} ~ {{ currentRow.extensibilityMax }}</el-descriptions-item>
        <el-descriptions-item label="重量(g)">{{ currentRow.weightMin }} ~ {{ currentRow.weightMax }}</el-descriptions-item>
        <el-descriptions-item label="直径(mm)">{{ currentRow.diameterMin }} ~ {{ currentRow.diameterMax }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ currentRow.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button type="primary" @click="viewVisible = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import scenarioApi from '@/api/scenario'

const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
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

const wireType = ref('')
const scenarioName = ref('')

const dialogVisible = ref(false)
const viewVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const currentRow = ref({})

const form = ref({
  scenarioCode: null, scenarioName: '', wireType: 'Cu',
  conductivityMin: null, conductivityMax: null,
  extensibilityMin: null, extensibilityMax: null,
  weightMin: null, weightMax: null,
  diameterMin: null, diameterMax: null
})

const dialogTitle = computed(() => isEdit.value ? '编辑应用场景' : '新增应用场景')

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const loadData = async () => {
  loading.value = true
  try {
    const params = { current: currentPage.value }
    if (wireType.value) params.wireType = wireType.value
    if (scenarioName.value) params.scenarioName = scenarioName.value
    const res = await scenarioApi.selectScenarioList(params)
    if (res.code === 200) {
      const rows = res.data.records || []
      while (rows.length < pageSize.value) rows.push({})
      tableData.value = rows
      total.value = res.data.total || 0
      sortData()
    } else ElMessage.error(res.message || '查询失败')
  } catch { ElMessage.error('网络请求失败') }
  loading.value = false
}

const handleSearch = () => { currentPage.value = 1; loadData() }
const handleRefresh = () => { wireType.value = ''; scenarioName.value = ''; currentPage.value = 1; loadData() }
const handlePageChange = (page) => { currentPage.value = page; loadData().then(() => sortData()) }

const sortOrder = ref('desc')
const toggleSort = () => { sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'; sortData() }
const sortData = () => {
  const rows = tableData.value.filter(r => r.scenarioCode)
  const empty = tableData.value.filter(r => !r.scenarioCode)
  const dir = sortOrder.value === 'asc' ? 1 : -1
  rows.sort((a, b) => dir * (new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()))
  tableData.value = [...rows, ...empty]
}

const handleExport = () => {
  const rows = tableData.value.filter(r => r.scenarioCode)
  if (!rows.length) { ElMessage.warning('没有可导出的数据'); return }
  const cols = ['scenarioCode','scenarioName','wireType','conductivityMin','conductivityMax','extensibilityMin','extensibilityMax','weightMin','weightMax','diameterMin','diameterMax','createTime']
  const labels = ['场景编号','场景名称','线材类型','电导率下限','电导率上限','延展率下限','延展率上限','重量下限','重量上限','直径下限','直径上限','创建时间']
  const csv = [labels.join(',')]
  rows.forEach(r => { csv.push(cols.map(c => { const v = r[c]; return v != null ? `"${String(v).replace(/"/g,'""')}"` : '' }).join(',')) })
  const blob = new Blob(['﻿' + csv.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `应用场景_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  ElMessage.success('导出成功')
}
const handleSizeChange = (size) => { pageSize.value = size; currentPage.value = 1; loadData() }

const handleAdd = () => { isEdit.value = false; resetForm(); dialogVisible.value = true }
const handleView = (row) => { currentRow.value = { ...row }; viewVisible.value = true }
const handleEdit = (row) => { isEdit.value = true; currentRow.value = { ...row }; form.value = { ...row }; dialogVisible.value = true }

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除场景 "${row.scenarioName}" 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      try {
        const res = await scenarioApi.deleteScenario(row.scenarioCode)
        if (res.code === 200) { ElMessage.success('删除成功'); loadData() }
        else ElMessage.error(res.message || '删除失败')
      } catch { ElMessage.error('删除失败，可能权限不足') }
    }).catch(() => {})
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    const res = isEdit.value
      ? await scenarioApi.updateScenario(form.value.scenarioCode, form.value)
      : await scenarioApi.createScenario(form.value)
    if (res.code === 200) { ElMessage.success(isEdit.value ? '更新成功' : '创建成功'); dialogVisible.value = false; loadData() }
    else ElMessage.error(res.message || '操作失败')
  } catch { ElMessage.error('操作失败，可能权限不足') }
  submitLoading.value = false
}

const resetForm = () => {
  form.value = { scenarioCode: null, scenarioName: '', wireType: 'Cu', conductivityMin: null, conductivityMax: null, extensibilityMin: null, extensibilityMax: null, weightMin: null, weightMax: null, diameterMin: null, diameterMax: null }
}

onMounted(() => loadData())
</script>

<style scoped>
.page-container { padding: 24px; background: #f5f7fa; min-height: calc(100vh - 64px); }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #6b7280; margin: 0; }

/* 筛选栏 */
.filter-card { background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
.filter-row { display: flex; gap: 12px; align-items: center; }
.filter-select { width: 150px; flex: none; }
.filter-select :deep(.el-input__wrapper) { border-radius: 10px !important; }
.filter-input { width: 250px; flex: none; }
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

/* 标签 */
.scenario-tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.tag-wire { background: #eff6ff; color: #3b82f6; }

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
</style>
