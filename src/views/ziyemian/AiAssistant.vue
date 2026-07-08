<template>
  <div class="md-app">
    <header class="md-topbar">
      <div class="md-topbar-l">
        <div class="md-avatar"><i class="fas fa-robot"></i></div>
        <div>
          <div class="md-topbar-title">智能助手</div>
          <div class="md-topbar-sub">在线</div>
        </div>
      </div>
      <div class="md-topbar-r">
        <button class="md-icon-btn" @click="clearChat" :disabled="sending" title="清除全屏">
          <i class="fas fa-broom"></i>
        </button>
      </div>
    </header>

    <div class="md-body">
      <main class="md-chat">
        <div class="md-chat-body" ref="bodyRef">
          <div class="md-empty" v-if="msgs.length === 0 && !sending">
            <div class="md-empty-icon"><i class="fas fa-robot"></i></div>
            <h3>你好，我是检测助手</h3>
            <p>可以问我关于线材检测、缺陷分析、设备状态等问题</p>
          </div>
          <div class="md-row bot" v-if="sending && msgs.length === 0">
            <div class="md-msg-av bot-av"><i class="fas fa-robot"></i></div>
            <div class="md-bubble bot-bubble"><div class="md-skeleton"><span/><span/><span/></div></div>
          </div>
          <template v-for="(m, i) in msgs" :key="m.id">
            <div class="md-row" :class="m.role">
              <div class="md-msg-av" :class="m.role === 'assistant' ? 'bot-av' : 'user-av'">
                <i :class="m.role === 'assistant' ? 'fas fa-robot' : 'fas fa-user'"></i>
              </div>
              <div class="md-msg-wrap">
                <div class="md-bubble" :class="m.role === 'assistant' ? 'bot-bubble' : 'user-bubble'">
                  <div class="md-md" v-html="fmtMd(streaming && i === msgs.length - 1 && m.role === 'assistant' ? streamText : m.content)"/>
                  <span class="md-thinking" v-if="streaming && i === msgs.length - 1 && m.role === 'assistant' && !typing">
                    <i class="fas fa-circle dot1"></i><i class="fas fa-circle dot2"></i><i class="fas fa-circle dot3"></i>
                    <span class="md-thinking-text">思考中...</span>
                  </span>
                </div>
                <div class="md-time" :class="{ r: m.role === 'user' }">{{ m.time }}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="md-quick" v-if="!sending">
          <span class="md-chip" v-for="q in quick" :key="q.text" @click="sendQuick(q)"><i :class="q.icon"/> {{ q.text }}</span>
        </div>
        <footer class="md-foot">
          <div class="md-bar">
            <el-input v-model="input" type="textarea" :rows="1" placeholder="输入问题，Enter 发送 / Shift+Enter 换行" @keydown.enter.exact="send" :disabled="sending" resize="none"/>
            <button v-if="sending" class="md-send stop" @click="abort"><i class="fas fa-stop"/></button>
            <button v-else class="md-send" :disabled="!input.trim()" @click="send"><i class="fas fa-paper-plane"/></button>
          </div>
          <p class="md-foot-hint">回答由 AI 生成，仅供参考</p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import questionApi from '@/api/question'

const msgs = ref([])
const input = ref('')
const streamText = ref('')
const streaming = ref(false)
const sending = ref(false)
const typing = ref(false)
const bodyRef = ref(null)
let abortFlag = false
// RAF 节流：每帧刷新一次，避免 1~3 字/chunk 时频繁 render
let pending = ''
let rafId = null
// 思考点：通道空闲 400ms 后显示
let typingTimer = null
const THINK_DELAY = 400

const flushStream = () => {
  if (pending) {
    streamText.value += pending
    pending = ''
    scrollBtm()
  }
  rafId = null
}

const scheduleFlush = () => {
  if (!rafId) rafId = requestAnimationFrame(flushStream)
}

const quick = [
  { icon: 'fas fa-chart-line',   text: '分析最近的线材质量趋势' },
  { icon: 'fas fa-check-circle', text: '当前合格率是多少' },
  { icon: 'fas fa-microchip',    text: '哪些设备可能存在异常' },
  { icon: 'fas fa-search',       text: '如何对批次进行溯源分析' },
  { icon: 'fas fa-exclamation-triangle', text: '表面缺陷主要有哪些类型' },
  { icon: 'fas fa-layer-group',  text: '应用场景的分布情况' },
]

const uid = () => Math.random().toString(36).slice(2, 10)
const now = () => {
  const d = new Date()
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
const fmtMd = (t) => {
  if (!t) return ''
  let out = t
  out = out.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="md-pre"><code>$2</code></pre>')
  out = out.replace(/((?:.*[█▌▎▍▏▀▄▐░▒▓].*\n?)+)/g, (match) => {
    const body = match.replace(/\n$/, ''); if (!body.trim()) return match
    return `<pre class="ascii-block">${body}</pre>`
  })
  out = out.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/^- (.+)$/gm, '<li>$1</li>')
  out = out.replace(/\n/g, '<br>')
  return out
}
const nearBtm = () => { const el = bodyRef.value; return el ? el.scrollHeight - el.scrollTop - el.clientHeight < 60 : true }
const scrollBtm = () => nextTick(() => { if (nearBtm()) { const el = bodyRef.value; if (el) el.scrollTop = el.scrollHeight } })
const forceBtm = () => nextTick(() => { const el = bodyRef.value; if (el) el.scrollTop = el.scrollHeight })
const getDevId = () => { try { return String(JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId||'unknown') } catch { return 'unknown' } }

const sendQuick = (q) => { input.value=q.text; send() }
const send = async () => {
  const text = input.value.trim()
  if (!text || sending.value) return
  if (!localStorage.getItem('token')) { ElMessage.warning('请先登录'); return }
  const devId = getDevId()
  if (!devId) { ElMessage.error('无法获取用户信息'); return }
  msgs.value.push({ id:uid(), role:'user', content:text, time:now() })
  input.value=''; forceBtm()
  const ai = { id:uid(), role:'assistant', content:'', time:now() }
  msgs.value.push(ai)
  sending.value=true; streaming.value=true; streamText.value=''
  abortFlag=false; forceBtm()
  try {
    await questionApi.askStream(devId, text, {
      onToken(chunk) {
        if (abortFlag) return
        typing.value = true
        if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }
        pending += chunk
        scheduleFlush()
        // 通道空闲 400ms 后显示思考点
        typingTimer = setTimeout(() => { typing.value = false; typingTimer = null }, THINK_DELAY)
      },
      onDone() {
        if (abortFlag) return
        if (rafId) { cancelAnimationFrame(rafId); rafId = null }
        if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }
        flushStream()
        finish(ai)
      },
      onError() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null }
        if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }
        flushStream()
        finish(ai, '抱歉，AI 服务暂不可用')
      }
    })
  } catch {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }
    flushStream()
    finish(ai, '网络异常，请检查连接后重试')
  }
}

function finish(msg, fb) {
  msg.content = (fb && !streamText.value) ? fb : streamText.value
  msg.time = now()
  streamText.value=''; streaming.value=false; sending.value=false; typing.value=false; forceBtm()
}

const abort = () => { abortFlag=true; if (rafId) { cancelAnimationFrame(rafId); rafId = null }; if (typingTimer) { clearTimeout(typingTimer); typingTimer = null }; flushStream(); const m=msgs.value[msgs.value.length-1]; if (m?.role==='assistant') finish(m) }
const clearChat = () => { msgs.value = [] }

onMounted(() => { scrollBtm() })
</script>

<style>
:root {
  --md-surface: #ffffff;
  --md-surface-variant: #f5f5f5;
  --md-surface-container: #fafafa;
  --md-primary: #757575;
  --md-primary-container: #eeeeee;
  --md-on-surface: #212121;
  --md-on-surface-variant: #757575;
  --md-outline: #bdbdbd;
  --md-outline-variant: #e0e0e0;
  --md-inverse-surface: #424242;
  --md-inverse-on-surface: #fafafa;
  --md-bot-bubble: #f5f5f5;
  --md-user-bubble: #616161;
  --md-hover: rgba(0,0,0,.04);
  --md-press: rgba(0,0,0,.08);
  --md-elevation-1: 0 1px 3px 1px rgba(0,0,0,.08);
  --md-elevation-2: 0 2px 6px 2px rgba(0,0,0,.10);
}

/* Layout */
.md-app { height: calc(100vh - 64px); display: flex; flex-direction: column; background: var(--md-surface); color: var(--md-on-surface); transition: background-color .3s, color .3s; overflow: hidden; }
.md-topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: var(--md-surface-container); border-bottom: 1px solid var(--md-outline-variant); flex-shrink: 0; height: 56px; box-sizing: border-box; transition: background-color .3s; }
.md-topbar-l { display: flex; align-items: center; gap: 12px; }
.md-topbar-r { display: flex; gap: 4px; }
.md-avatar { width: 40px; height: 40px; border-radius: 16px; background: var(--md-primary-container); color: var(--md-primary); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.md-topbar-title { font-size: 16px; font-weight: 600; }
.md-topbar-sub { font-size: 12px; color: var(--md-on-surface-variant); }

/* Icon Button */
.md-icon-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: transparent; color: var(--md-on-surface-variant); cursor: pointer; font-size: 18px; transition: background .2s cubic-bezier(0.2,0,0,1); display: flex; align-items: center; justify-content: center; }
.md-icon-btn:hover { background: var(--md-hover); }
.md-icon-btn:active { background: var(--md-press); }
.md-icon-btn:disabled { opacity: .38; pointer-events: none; }

/* Body */
.md-body { flex: 1; display: flex; overflow: hidden; min-height: 0; }

.md-chat { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--md-surface); transition: background-color .3s; }
.md-chat-body { flex: 1; overflow-y: auto; padding: 20px 24px; scroll-behavior: smooth; }
.md-chat-body::-webkit-scrollbar { width: 6px; }
.md-chat-body::-webkit-scrollbar-track { background: transparent; }
.md-chat-body::-webkit-scrollbar-thumb { background: var(--md-outline-variant); border-radius: 3px; }

/* Empty State */
.md-empty { text-align: center; padding: 60px 20px 40px; }
.md-empty-icon { width: 72px; height: 72px; border-radius: 16px; margin: 0 auto 16px; background: var(--md-primary-container); color: var(--md-primary); display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: var(--md-elevation-1); }
.md-empty h3 { font-size: 20px; font-weight: 600; margin: 0 0 8px; color: var(--md-on-surface); }
.md-empty p { font-size: 14px; color: var(--md-on-surface-variant); margin: 0; }

/* Messages */
.md-row { display: flex; gap: 10px; margin-bottom: 22px; animation: md-slide-up .3s ease; }
.md-row.user { flex-direction: row-reverse; }
@keyframes md-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.md-msg-av { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.bot-av { background: var(--md-surface-variant); color: var(--md-primary); }
.user-av { background: var(--md-primary); color: #fff; }
.md-msg-wrap { max-width: 80%; min-width: 0; }
.md-bubble { padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.65; word-break: break-word; }
.bot-bubble { background: var(--md-bot-bubble); color: var(--md-on-surface); border-bottom-left-radius: 4px; box-shadow: var(--md-elevation-1); transition: background-color .3s; }
.user-bubble { background: var(--md-user-bubble); color: #fff; border-bottom-right-radius: 4px; box-shadow: var(--md-elevation-1); }
.md-time { font-size: 11px; color: var(--md-on-surface-variant); margin-top: 4px; padding: 0 4px; }
.md-time.r { text-align: right; }

/* Thinking Dots */
.md-thinking { display: inline-flex; gap: 3px; margin-left: 6px; align-items: center; }
.md-thinking i { font-size: 5px; color: var(--md-on-surface-variant); animation: md-bounce 1.4s ease-in-out infinite; }
.dot1 { animation-delay: 0s; } .dot2 { animation-delay: .16s; } .dot3 { animation-delay: .32s; }
.md-thinking-text { font-size: 12px; color: var(--md-on-surface-variant); margin-left: 6px; animation: md-pulse-text 1.8s ease-in-out infinite; }
@keyframes md-bounce { 0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)} }
@keyframes md-pulse-text { 0%,100%{opacity:.4}50%{opacity:1} }

/* Skeleton Loading */
.md-skeleton { display: flex; flex-direction: column; gap: 6px; padding: 4px 0; }
.md-skeleton span { height: 11px; background: var(--md-outline-variant); border-radius: 6px; animation: md-shim 2s infinite; }
.md-skeleton span:nth-child(1){width:90%} .md-skeleton span:nth-child(2){width:65%} .md-skeleton span:nth-child(3){width:40%}
@keyframes md-shim { 0%,100%{opacity:.4}50%{opacity:1} }

/* Quick Chips */
.md-quick { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 10px; flex-shrink: 0; }
.md-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12.5px; color: var(--md-primary); background: var(--md-primary-container); cursor: pointer; transition: box-shadow .2s cubic-bezier(0.2,0,0,1), transform .2s cubic-bezier(0.2,0,0,1); white-space: nowrap; font-weight: 500; }
.md-chip:hover { box-shadow: var(--md-elevation-1); transform: translateY(-1px); }
.md-chip i { font-size: 12px; }

/* Input Area */
.md-foot { padding: 10px 20px 14px; background: var(--md-surface); border-top: 1px solid var(--md-outline-variant); flex-shrink: 0; transition: background-color .3s; }
.md-bar { display: flex; gap: 10px; align-items: flex-end; }
.md-bar :deep(.el-textarea__inner) { border-radius: 12px; border: 1px solid var(--md-outline); font-size: 14px; padding: 12px 16px; line-height: 1.5; resize: none; background: var(--md-surface-variant); color: var(--md-on-surface); transition: border-color .2s cubic-bezier(0.2,0,0,1), box-shadow .2s cubic-bezier(0.2,0,0,1), background-color .3s; }
.md-bar :deep(.el-textarea__inner):focus { border-color: var(--md-primary); box-shadow: 0 0 0 3px rgba(0,0,0,.12); background: var(--md-surface); }
.md-bar :deep(.el-textarea__inner)::placeholder { color: var(--md-on-surface-variant); }
.md-send { width: 44px; height: 44px; border-radius: 50%; border: none; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; background: var(--md-primary-container); color: var(--md-primary); transition: box-shadow .2s cubic-bezier(0.2,0,0,1), transform .2s cubic-bezier(0.2,0,0,1); box-shadow: var(--md-elevation-1); }
.md-send:hover:not(:disabled) { box-shadow: var(--md-elevation-2); transform: scale(1.05); }
.md-send:disabled { background: var(--md-surface-variant); color: var(--md-outline); box-shadow: none; cursor: not-allowed; }
.md-send.stop { background: #BA1A1A; color: #fff; }
.md-send.stop:hover { box-shadow: var(--md-elevation-2); }
.md-foot-hint { font-size: 11px; color: var(--md-on-surface-variant); text-align: center; margin: 6px 0 0; }

/* Markdown */
.md-md :deep(.md-pre) { display: block; background: var(--md-inverse-surface); color: var(--md-inverse-on-surface); padding: 12px 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5; margin: 8px 0; }
.md-md :deep(.md-code) { background: var(--md-surface-variant); color: #e11d48; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; }
.md-md :deep(.ascii-block) { display: block; background: var(--md-surface-variant); color: var(--md-on-surface-variant); padding: 12px 16px; border-radius: 8px; font-size: 12px; line-height: 1.25; font-family: monospace; white-space: pre; overflow-x: auto; margin: 8px 0; }
.md-md :deep(strong) { font-weight: 600; }
.md-md :deep(li) { margin: 2px 0; }
.user-bubble .md-md :deep(.md-pre) { background: rgba(0,0,0,.25); }
.user-bubble .md-md :deep(.md-code) { background: rgba(0,0,0,.2); color: #ffccd5; }
</style>
