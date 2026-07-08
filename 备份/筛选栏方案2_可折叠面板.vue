<!--
  检测管理 - 筛选栏美化方案 2：可折叠面板
  替换 wirematerial.vue 中 <!-- 操作栏 --> 到下一个注释之间的内容
-->

    <!-- 操作栏 -->
    <div class="filter-panel">
      <div class="filter-panel-header" @click="expanded = !expanded">
        <span><i class="fas fa-filter"></i> 筛选条件</span>
        <span class="filter-panel-toggle">
          <i :class="expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </span>
      </div>
      <div v-show="expanded" class="filter-panel-body">
        <div class="filter-row">
          <el-input v-model="filters.batchNumber" placeholder="批次号" clearable>
            <template #prefix><i class="fas fa-hashtag"></i></template>
          </el-input>
          <el-input v-model="filters.deviceId" placeholder="设备ID" clearable>
            <template #prefix><i class="fas fa-microchip"></i></template>
          </el-input>
          <el-input v-model="filters.scenarioCode" placeholder="场景编号" clearable>
            <template #prefix><i class="fas fa-tag"></i></template>
          </el-input>
        </div>
        <div class="filter-row">
          <el-input v-model="filters.manufacturer" placeholder="生产商" clearable>
            <template #prefix><i class="fas fa-industry"></i></template>
          </el-input>
          <el-input v-model="filters.responsiblePerson" placeholder="负责人" clearable>
            <template #prefix><i class="fas fa-user"></i></template>
          </el-input>
          <el-select v-model="filters.modelEvaluationResult" placeholder="评估结果" clearable>
            <el-option label="合格" value="PASS" />
            <el-option label="不合格" value="FAIL" />
            <el-option label="未评估" value="UNKNOWN" />
          </el-select>
        </div>
      </div>
      <div class="filter-panel-footer">
        <div class="filter-actions">
          <el-button type="primary" @click="handleSearch"><i class="fas fa-search"></i> 查询</el-button>
          <el-button @click="handleRefresh">刷新</el-button>
        </div>
        <el-button type="success" @click="handleAdd"><i class="fas fa-plus"></i> 新增记录</el-button>
      </div>
    </div>

<!-- 脚本中新增：const expanded = ref(false) -->

<!-- 样式： -->
<style>
/* 方案2：可折叠面板 */
.filter-panel { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; overflow: hidden; }
.filter-panel-header { padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 14px; font-weight: 600; color: #1f2937; user-select: none; }
.filter-panel-header:hover { background: #f9fafb; }
.filter-panel-toggle { color: #9ca3af; transition: transform 0.2s; }
.filter-panel-body { padding: 16px 20px 8px; display: flex; flex-direction: column; gap: 12px; border-top: 1px solid #f3f4f6; }
.filter-row { display: flex; gap: 12px; }
.filter-row > * { flex: 1; min-width: 0; }
.filter-panel-footer { padding: 8px 20px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; }
.filter-actions { display: flex; gap: 10px; }
</style>
