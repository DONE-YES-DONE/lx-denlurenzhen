import { requestDefect } from './requst';

const parse = (d) => {
  if (typeof d === 'string') {
    const result = JSON.parse(d.replace(/:(\s*)(\d{16,})/g, ':"$2"'))
    console.log('🔍 defect parse 第一个batchNumber:', typeof result?.data?.records?.[0]?.batchNumber, result?.data?.records?.[0]?.batchNumber)
    return result
  }
  return d
}

export default {
  // 分页查询缺陷数据
  async selectDefectList(current, size = 10) {
    const res = await requestDefect.get('/list', { params: { current, size } })
    return parse(res.data)
  },

  // 根据批次号查询缺陷数据
  async selectDefectByBatch(batchNumber) {
    try {
      const res = await requestDefect.get(`/info/${batchNumber}`)
      return parse(res.data)
    } catch (error) {
      console.error('查询失败', error.response?.data)
      throw error
    }
  },

  // 【后端待实现】新增检测批次
  async createDefect(data) {
    try {
      const res = await requestDefect.post('/', data)
      return parse(res.data)
    } catch (error) {
      console.error('创建失败（后端暂未实现该接口）', error.response?.data)
      throw error
    }
  },

  // 【后端待实现】更新检测批次
  async updateDefect(id, data) {
    try {
      const res = await requestDefect.put(`/${id}`, data)
      return parse(res.data)
    } catch (error) {
      console.error('修改失败（后端暂未实现该接口）', error.response?.data)
      throw error
    }
  },

  // 【后端待实现】删除检测批次
  async deleteDefect(id) {
    try {
      const res = await requestDefect.delete(`/${id}`)
      return parse(res.data)
    } catch (error) {
      console.error('删除失败（后端暂未实现该接口）', error.response?.data)
      throw error
    }
  }
}
