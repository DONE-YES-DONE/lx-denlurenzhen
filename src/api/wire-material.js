import { requestWire } from './requst';

// 解析文本响应，保护大整数精度
const parse = (data) => {
  if (typeof data === 'string') {
    return JSON.parse(data.replace(/:(\s*)(\d{16,})/g, ':"$2"'))
  }
  return data
}

export default {
  // 分页查询线材列表
  async selectWireList(current, pageSize) {
    try {
      const res = await requestWire.get('/list', { params: { current, pageSize } })
      return parse(res.data)
    } catch (error) {
      console.error('查询失败', error.response?.data)
      throw error
    }
  },

  // 条件分页查询
  async selectWirePage(params) {
    try {
      const res = await requestWire.get('/page', { params })
      return parse(res.data)
    } catch (error) {
      console.error('条件分页查询失败', error.response?.data)
      throw error
    }
  },

  // 条件查询
  async queryWireList(filters) {
    try {
      const res = await requestWire.post('/list-agent', filters, { params: { limit: 200 } })
      return parse(res.data)
    } catch (error) {
      console.error('条件查询失败', error.response?.data)
      throw error
    }
  },

  // 根据批次号查询线材
  async selectWireBatchNumber(batchNumber) {
    try {
      const axiosResponse = await requestWire.get(`/info/${batchNumber}`)
      return parse(axiosResponse.data)
    } catch (error) {
      console.error('查询失败', error.response?.data)
      throw error
    }
  },

  // 新增线材记录
  async createWireData(data) {
    try {
      const axiosResponse = await requestWire.post('/', data)
      return parse(axiosResponse.data)
    } catch (error) {
      console.error('创建失败', error.response?.data)
      throw error
    }
  },

  // 更新线材信息
  async updateWireData(batchNumber, data) {
    try {
      const axiosResponse = await requestWire.put(`/${batchNumber}`, data)
      return parse(axiosResponse.data)
    } catch (error) {
      console.error('修改失败', error.response?.data)
      throw error
    }
  },

  // 批次聚合分页（卡片视图）
  async selectBatchPage(params) {
    try {
      const res = await requestWire.get('/page-batch', { params })
      return parse(res.data)
    } catch (error) {
      console.error('批次聚合查询失败', error.response?.data)
      throw error
    }
  },

  // 分页查询最近记录平均数据
  async selectBatchNoAvg(current = 1, pageSize = 12) {
    try {
      const res = await requestWire.get('/list-batchNoAvg', { params: { current, pageSize } })
      return parse(res.data)
    } catch (error) {
      console.error('批次平均数据查询失败', error.response?.data)
      throw error
    }
  },

  // 查询批次物理参数（不传 batchNo 默认查最近批次）
  async selectWirePhysical(batchNo) {
    try {
      const res = await requestWire.get('/list-batchNo', { params: batchNo != null ? { batchNo } : {} })
      return parse(res.data)
    } catch (error) {
      console.error('物理参数查询失败', error.response?.data)
      throw error
    }
  },

  // 按批次+卷序查询线材及缺陷聚合信息（二维码溯源）
  async selectWireInfoWithDetection(batchNo, rollNo) {
    try {
      const res = await requestWire.get('/info-with-detection', { params: { batchNo, rollNo } })
      return parse(res.data)
    } catch (error) {
      console.error('溯源信息查询失败', error.response?.data)
      throw error
    }
  },

  // AI 预警分析：status=0 查缓存, status=1 触发新分析
  async getEarlyWarning(status = 0, hours = 24) {
    try {
      const res = await requestWire.post('/early-warning', null, { params: { status, hours }, timeout: 180000 })
      return parse(res.data)
    } catch (error) {
      console.error('预警查询失败', error.response?.data)
      throw error
    }
  },

}
