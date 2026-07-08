import { requestDashboard, requestWire, requestDevice, requestScenario, requestDefect } from "./requst";

// ==================== 仪表盘 API 接口 ====================
// 对接真实后端接口

export default {
  // ==================== 统计卡片 ====================

  /**
   * 1. 检测总数量
   * GET /api/wire-material/count
   * 返回: { code: 200, data: 12847 }
   */
  async getChecksTotal() {
    const res = await requestWire.get('/count')
    // 适配不同返回格式：可能是 { data: 12847 } 也可能 data 直接是数字
    const count = res.data?.data ?? res.data
    return { code: 200, data: { totalChecks: count } }
  },

  /**
   * 1b. 检测总量月环比（较上月）
   * 对比本月 vs 上月 pass-param 的检测总量
   */
  async getChecksMonthlyTrend() {
    try {
      const now = new Date()
      const toYm = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

      const sumTotal = (data) => {
        if (!data) return null
        if (Array.isArray(data)) {
          const p = data.reduce((s, d) => s + (Number(d.passCount) || 0), 0)
          const f = data.reduce((s, d) => s + (Number(d.failCount) || 0), 0)
          return p + f
        }
        return (Number(data.passCount) || 0) + (Number(data.failCount) || 0)
      }

      const [thisRes, lastRes] = await Promise.all([
        requestWire.get('/pass-param', { params: { yearMonth: toYm(now) } }),
        requestWire.get('/pass-param', { params: { yearMonth: toYm(new Date(now.getFullYear(), now.getMonth() - 1, 1)) } })
      ])

      const thisTotal = sumTotal(thisRes.data?.data ?? thisRes.data)
      const lastTotal = sumTotal(lastRes.data?.data ?? lastRes.data)

      // 当月或上月无数据时不显示趋势
      if (!thisTotal || !lastTotal) {
        return { code: 200, data: { checksTrend: null, checksTrendUp: true } }
      }

      const pct = ((thisTotal - lastTotal) / lastTotal) * 100
      return {
        code: 200,
        data: {
          checksTrend: Math.abs(pct).toFixed(1) + '%',
          checksTrendUp: pct >= 0
        }
      }
    } catch {
      return { code: 200, data: { checksTrend: null, checksTrendUp: true } }
    }
  },

  /**
   * 1c. 合格率月环比（较上月）
   * 对比本月 vs 上月 passRate
   */
  async getPassRateMonthlyTrend() {
    try {
      const now = new Date()
      const toYm = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

      const getRate = (data) => {
        if (!data) return null
        if (Array.isArray(data)) {
          const p = data.reduce((s, d) => s + (Number(d.passCount) || 0), 0)
          const f = data.reduce((s, d) => s + (Number(d.failCount) || 0), 0)
          const t = p + f
          return t > 0 ? (p / t) * 100 : null
        }
        const pass = Number(data.passCount) || 0
        const fail = Number(data.failCount) || 0
        const total = pass + fail
        return total > 0 ? (pass / total) * 100 : null
      }

      const [thisRes, lastRes] = await Promise.all([
        requestWire.get('/pass-param', { params: { yearMonth: toYm(now) } }),
        requestWire.get('/pass-param', { params: { yearMonth: toYm(new Date(now.getFullYear(), now.getMonth() - 1, 1)) } })
      ])

      const thisRate = getRate(thisRes.data?.data ?? thisRes.data)
      const lastRate = getRate(lastRes.data?.data ?? lastRes.data)

      // 当月或上月无数据时不显示趋势
      if (thisRate === null || lastRate === null || lastRate === 0) {
        return { code: 200, data: { passRateTrend: null, passRateTrendUp: true } }
      }

      const diff = thisRate - lastRate
      return {
        code: 200,
        data: {
          passRateTrend: Math.abs(diff).toFixed(1) + '%',
          passRateTrendUp: diff >= 0
        }
      }
    } catch {
      return { code: 200, data: { passRateTrend: null, passRateTrendUp: true } }
    }
  },

  /**
   * 2. 合格率概览
   * GET /api/wire-material/pass-param?yearMonth=2026-06
   * 返回单个对象: { passRate, passCount, failCount }
   */
  async getPassRateOverview(year, month) {
    const ym = `${year}-${String(month).padStart(2, '0')}`
    const res = await requestWire.get('/pass-param', { params: { yearMonth: ym } })
    const arr = res.data?.data ?? res.data ?? []
    const totalPass = arr.reduce((s, d) => s + (Number(d.passCount) || 0), 0)
    const totalFail = arr.reduce((s, d) => s + (Number(d.failCount) || 0), 0)
    const total = totalPass + totalFail
    const passRate = total > 0 ? +((totalPass / total) * 100).toFixed(1) : 0
    return { code: 200, data: { passRate } }
  },

  /**
   * 3. 设备数量及启停占比
   * GET /api/device/list?current=1 获取总数
   * GET /api/device/start 获取启动数
   * 返回: { totalDevices, activeDevices, inactiveDevices }
   */
  async getDeviceStatus() {
    try {
      const [listRes, startRes] = await Promise.all([
        requestDevice.get('/list', { params: { current: 1 } }),
        requestDevice.get('/start')
      ])
      const total = listRes.data?.data?.total ?? listRes.data?.total ?? 0
      const startData = startRes.data?.data ?? startRes.data ?? {}
      const keys = Object.keys(startData)
      // /start 返回 Map<total, onCount>，如 {"10": 4}，key=总数 value=ON数量
      const active = keys.length ? (Number(startData[keys[0]]) || 0) : 0
      return { code: 200, data: { totalDevices: total, activeDevices: active, inactiveDevices: total - active } }
    } catch {
      throw new Error('获取设备状态失败')
    }
  },

  /**
   * 4. 应用场景种类数量
   * GET /api/scenario
   * 返回: { code: 200, data: 5 }
   */
  async getScenarioCount() {
    const res = await requestScenario.get('')
    const count = res.data?.data ?? res.data ?? 0
    return { code: 200, data: { scenarioTypeCount: Number(count) || 0 } }
  },

  // ==================== 图表数据 ====================

  /**
   * 每日明细（用于图表）
   * GET /api/wire-material/pass-param?yearMonth=2026-06
   * 返回数组: [{ passRate, passCount, failCount, day }, ...]
   */
  async getDailyStats(year, month) {
    const ym = `${year}-${String(month).padStart(2, '0')}`
    const res = await requestWire.get('/pass-param', { params: { yearMonth: ym } })
    const arr = res.data?.data ?? res.data ?? []
    return {
      code: 200,
      data: arr.map(d => ({
        day: d.day || '',
        passCount: Number(d.passCount) || 0,
        failCount: Number(d.failCount) || 0,
        passRate: Number(d.passRate) || 0
      }))
    }
  },

  /**
   * 合格率 + 合格/不合格数量（月度汇总）
   * GET /api/wire-material/pass-param?yearMonth=2026-06
   * 返回数组: [{ passRate, passCount, failCount, day }, ...]
   */
  async getQualityStats(year, month) {
    const ym = `${year}-${String(month).padStart(2, '0')}`
    const res = await requestWire.get('/pass-param', { params: { yearMonth: ym } })
    const arr = res.data?.data ?? res.data ?? []
    const totalPass = arr.reduce((s, d) => s + (Number(d.passCount) || 0), 0)
    const totalFail = arr.reduce((s, d) => s + (Number(d.failCount) || 0), 0)
    const total = totalPass + totalFail
    const passRate = total > 0 ? +((totalPass / total) * 100).toFixed(1) : 0
    return { code: 200, data: { passCount: totalPass, failCount: totalFail, passRate } }
  },

  // ==================== 缺陷分布 ====================

  /**
   * 近7天缺陷汇总
   * GET /api/detection-batch/recent?current=1&size=10000
   * 汇总5种缺陷类型的总数
   */
  async getDefectSummary() {
    try {
      const res = await requestDefect.get('/recent', { params: { current: 1, size: 10000 } })
      const records = res.data?.data?.records ?? []
      return {
        code: 200,
        data: {
          scratch: records.reduce((s, r) => s + (r.scratchCount || 0), 0),
          block: records.reduce((s, r) => s + (r.blockDefectCount || 0), 0),
          cluster: records.reduce((s, r) => s + (r.clusterDefectCount || 0), 0),
          burr: records.reduce((s, r) => s + (r.metalBurrCount || 0), 0),
          scuff: records.reduce((s, r) => s + (r.scuffCount || 0), 0)
        }
      }
    } catch {
      return { code: 200, data: { scratch: 0, block: 0, cluster: 0, burr: 0, scuff: 0 } }
    }
  },

  // ==================== 最近检测记录 ====================

  /**
   * 获取最近5条线材检测记录
   * GET /api/wire-material/list?current=1
   * 返回: { code: 200, data: { records: [...], total: N } }
   */
  async getRecentRecords() {
    try {
      const res = await requestWire.get('/list', { params: { current: 1 } })
      const data = res.data?.data ?? res.data ?? {}
      const records = (data.records || []).slice(0, 5)
      // 保留全量字段，仅补充表格展示所需的衍生字段
      return {
        code: 200,
        data: records.map(r => ({
          ...r,
          deviceCode: r.deviceId,
          result: modelResultToLabel(r.modelEvaluationResult),
          time: r.createTime
        }))
      }
    } catch {
      throw new Error('获取最近记录失败')
    }
  }
}

// 评估结果映射
function modelResultToLabel(result) {
  const map = { PASS: '合格', FAIL: '不合格', UNKNOWN: '未评估', PENDING_REVIEW: '待审核' }
  return map[result] || '未评估'
}
