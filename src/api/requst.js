import axios from 'axios'

// 大整数保护：JSON.parse 前把 >=16 位数字转为字符串
const bigIntTransform = (data) => {
  if (typeof data === 'string') {
    return JSON.parse(data.replace(/:(\s*)(\d{16,})/g, ':"$2"'))
  }
  return data
}

// 用户模块
export const requestUser = axios.create({
  baseURL: '/api/user',
  timeout: 10000,
})

// 设备模块
export const requestDevice = axios.create({
  baseURL: '/api/device',
  timeout: 10000,
})

// 金属丝材料模块（transformResponse 防大整数精度丢失）
export const requestWire = axios.create({
  baseURL: '/api/wire-material',
  timeout: 10000,
  transformResponse: [bigIntTransform],
})

//应用管理模块
 export const requestScenario = axios.create({
  baseURL:'/api/scenario',
  timeout:10000,
 })

// 仪表盘模块
export const requestDashboard = axios.create({
  baseURL: '/api/dashboard',
  timeout: 10000,
})

// 智能问答模块
export const requestQuestion = axios.create({
  baseURL: '/api/question',
  timeout: 300000,
})

// 缺陷检测模块（transformResponse 防大整数精度丢失）
export const requestDefect = axios.create({
  baseURL: '/api/detection-batch',
  timeout: 10000,
  transformResponse: [bigIntTransform],
})

// 给每个都加拦截器
function addInterceptors(instance) {
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['authorization'] = token
      }
      return config
    },
    error => Promise.reject(error)
  )
}

addInterceptors(requestUser)
addInterceptors(requestDevice)
addInterceptors(requestWire)
addInterceptors(requestScenario)
addInterceptors(requestDashboard)
addInterceptors(requestQuestion)
addInterceptors(requestDefect)
