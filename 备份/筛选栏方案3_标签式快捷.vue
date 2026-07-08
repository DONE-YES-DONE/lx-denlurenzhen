<!--
  检测管理 - 筛选栏美化方案 3：标签式快捷筛选 + 关键词搜索
  替换 wirematerial.vue 中 <!-- 操作栏 --> 到下一个注释之间的内容
-->

    <!-- 操作栏 -->
    <div class="filter-tags-bar">
      <div class="filter-tags">
        <span class="filter-tag" :class="{ active: !filters.modelEvaluationResult }" @click="filters.modelEvaluationResult = ''; handleSearch()">全部</span>
        <span class="filter-tag tag-pass" :class="{ active: filters.modelEvaluationResult === 'PASS' }" @click="filters.modelEvaluationResult = 'PASS'; handleSearch()">
          <i class="fas fa-check-circle"></i> 合格
        </span>
        <span class="filter-tag tag-fail" :class="{ active: filters.modelEvaluationResult === 'FAIL' }" @click="filters.modelEvaluationResult = 'FAIL'; handleSearch()">
          <i class="fas fa-times-circle"></i> 不合格
        </span>
        <span class="filter-tag tag-unknown" :class="{ active: filters.modelEvaluationResult === 'UNKNOWN' }" @click="filters.modelEvaluationResult = 'UNKNOWN'; handleSearch()">
          <i class="fas fa-question-circle"></i> 未评估
        </span>
      </div>
      <div class="filter-search-row">
        <el-input v-model="filters.batchNumber" placeholder="搜索批次号" clearable style="width: 160px">
          <template #prefix><i class="fas fa-search"></i></template>
        </el-input>
        <el-input v-model="filters.deviceId" placeholder="搜索设备ID" clearable style="width: 160px">
          <template #prefix><i class="fas fa-microchip"></i></template>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleRefresh">刷新</el-button>
        <el-button type="success" @click="handleAdd" style="margin-left: auto;"><i class="fas fa-plus"></i> 新增记录</el-button>
      </div>
    </div>

<!-- 样式 -->
<style>
/* 方案3：标签式快捷筛选 */
.filter-tags-bar { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 16px 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
.filter-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-tag { padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; border: 1px solid #e5e7eb; color: #6b7280; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
.filter-tag:hover { border-color: #6366f1; color: #6366f1; }
.filter-tag.active { background: #6366f1; color: white; border-color: #6366f1; }
.tag-pass.active { background: #22c55e; border-color: #22c55e; }
.tag-fail.active { background: #ef4444; border-color: #ef4444; }
.tag-unknown.active { background: #6b7280; border-color: #6b7280; }
.filter-search-row { display: flex; gap: 10px; align-items: center; }
</style>
