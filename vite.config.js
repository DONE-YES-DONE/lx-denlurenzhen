import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server:{
    host:'0.0.0.0', // 监听所有 IPv4 地址
    port:5173,      // 指定端口（默认 5173）
    strictPort:true,// 如果端口被占用，直接退出
    proxy:{
      '/api':{
        // target:'http://localhost:8080',
        target:'http://121.40.160.220:8080',
        changeOrigin:true,
        secure:false,//
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.url && req.url.includes('/ask/stream')) {
              // 告诉后端我们要流式传输
              proxyReq.setHeader('Accept', 'text/event-stream')
              proxyReq.setHeader('Cache-Control', 'no-cache')
            }
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            if (req.url && req.url.includes('/ask/stream')) {
              // SSE 流式传输：禁用所有代理缓冲
              proxyRes.headers['cache-control'] = 'no-cache, no-transform'
              proxyRes.headers['x-accel-buffering'] = 'no'
              proxyRes.headers['content-type'] = proxyRes.headers['content-type'] || 'text/event-stream'
              // 关键：Node.js http-proxy 默认就是流式 pipe，但有些中间件会缓冲
              // 强制设置 Connection 头
              delete proxyRes.headers['content-length']
            }
          })
        }
      }
    }
  }
})
