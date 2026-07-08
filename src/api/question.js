import { requestQuestion } from "./requst"

const BASE = '/api/question'

export default {
  // 同步提问（现有接口）
  async ask(deviceId, questionContent) {
    const res = await requestQuestion.post('/ask', { deviceId, questionContent })
    return res.data
  },

  // 流式 SSE 提问
  async askStream(deviceId, questionContent, callbacks) {
    const { onToken, onDone, onError } = callbacks
    const token = localStorage.getItem('token')

    try {
      console.log('[SSE] 发起流式请求:', `${BASE}/ask/stream`)
      const response = await fetch(`${BASE}/ask/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token || ''
        },
        body: JSON.stringify({ deviceId, questionContent })
      })

      console.log('[SSE] 响应状态:', response.status, 'Content-Type:', response.headers.get('Content-Type'))
      if (!response.ok) {
        console.log('[SSE] 响应非 200，触发 fallback')
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        console.log('[SSE] 无 reader，整段解析')
        const text = await response.text()
        console.log('[SSE] 整段原始文本:\n', text)
        this._parseSse(text, callbacks)
        return
      }

      console.log('[SSE] 开始流式读取...')
      const decoder = new TextDecoder()
      let buffer = ''
      let chunkIdx = 0
      const t0 = performance.now()

      while (true) {
        const { done, value } = await reader.read()
        const elapsed = (performance.now() - t0).toFixed(0)
        if (done) {
          console.log(`[SSE] 流结束 [${elapsed}ms], 共 ${chunkIdx} 个 chunk, 剩余 buffer:`, JSON.stringify(buffer))
          if (buffer.trim()) this._parseSse(buffer, callbacks)
          if (callbacks.onDone) callbacks.onDone('')
          break
        }
        chunkIdx++
        const chunk = decoder.decode(value, { stream: true })
        console.log(`[SSE] chunk #${chunkIdx} [${elapsed}ms], 长度=${chunk.length}:`, JSON.stringify(chunk.slice(0, 120)))
        buffer += chunk
        // 按完整 SSE 事件分割（\n\n 结尾）
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          if (part.trim()) {
            console.log(`[SSE] 解析片段 [${elapsed}ms]:`, JSON.stringify(part.slice(0, 200)))
            this._parseSse(part, callbacks)
          }
        }
      }
    } catch (err) {
      console.log('[SSE] 出错，触发 fallback:', err.message)
      try {
        return await this._fallbackSync(deviceId, questionContent, callbacks)
      } catch {
        if (onError) onError(err)
      }
    }
  },

  // 解析 SSE 片段
  _parseSse(text, callbacks) {
    if (!this._sseBuffer) this._sseBuffer = ''
    const lines = text.split('\n')
    let currentData = ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith(':')) continue
      if (trimmed.startsWith('event:')) continue
      if (trimmed.startsWith('id:')) continue
      if (trimmed.startsWith('retry:')) continue
      if (trimmed.startsWith('data:')) {
        currentData += trimmed.slice(5).trim()
      } else {
        // 没有前缀的行也当作 data 处理
        currentData += trimmed
      }
    }
    if (currentData) {
      if (currentData === '[DONE]') {
        console.log('[SSE] DONE, 完整返回:\n', this._sseBuffer)
        this._sseBuffer = ''
        return
      }
      // 尝试 JSON 解析
      try {
        const json = JSON.parse(currentData)
        const chunk = json.content || json.text || json.delta || json.result || json.message || ''
        if (chunk) {
          this._sseBuffer += chunk
          if (callbacks.onToken) callbacks.onToken(chunk)
        } else {
          console.log('[SSE] JSON 无 content, 字段:', Object.keys(json))
        }
      } catch {
        // 不是 JSON，直接当纯文本
        this._sseBuffer += currentData
        if (callbacks.onToken) callbacks.onToken(currentData)
      }
    }
  },

  // 同步回落
  async _fallbackSync(deviceId, questionContent, callbacks) {
    const res = await requestQuestion.post('/ask', { deviceId, questionContent })
    const content = res.data?.data?.aiResponseContent ?? res.data?.data ?? res.data ?? ''
    const text = typeof content === 'string' ? content : JSON.stringify(content)
    // 模拟流式逐字输出
    for (let i = 0; i < text.length; i++) {
      if (callbacks.onToken) callbacks.onToken(text[i])
      await new Promise(r => setTimeout(r, 20 + Math.random() * 20))
    }
    if (callbacks.onDone) callbacks.onDone(text)
    return text
  }
}
