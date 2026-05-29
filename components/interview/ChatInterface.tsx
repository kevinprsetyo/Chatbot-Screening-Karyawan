'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, User, CheckCircle2, Brain, Search, MessageSquare } from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { useInterviewStore } from '@/store/interview-store'
import { parseCategory } from '@/lib/ollama/interview-engine'
import type { InterviewMessage, QuestionCategory } from '@/types'

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const MAX_QUESTIONS = 10
const MIN_QUESTIONS = 5

// ─────────────────────────────────────────────────────────────
// Category badge config — unified purple palette
// ─────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<QuestionCategory, { label: string; className: string }> = {
  TEKNIS:           { label: 'Teknis',            className: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]' },
  KOMUNIKASI:       { label: 'Komunikasi',         className: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]' },
  PEMECAHAN_MASALAH:{ label: 'Pemecahan Masalah', className: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]' },
  KEPEMIMPINAN:     { label: 'Kepemimpinan',       className: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]' },
  PENGALAMAN:       { label: 'Pengalaman',         className: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]' },
  PENUTUP:          { label: 'Penutup',            className: 'bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]' },
  UMUM:             { label: 'Umum',               className: 'bg-slate-100 text-slate-500 border-slate-200' },
}

// ─────────────────────────────────────────────────────────────
// AI Thinking overlay sub-component
// ─────────────────────────────────────────────────────────────
const THINKING_STEPS = [
  { icon: Search,        label: 'Meninjau Pengalaman' },
  { icon: Brain,         label: 'Mengidentifikasi Bukti' },
  { icon: MessageSquare, label: 'Menyiapkan Pertanyaan Lanjutan' },
]

function AIThinkingIndicator() {
  const [visibleSteps, setVisibleSteps] = useState(0)

  useEffect(() => {
    const timers = THINKING_STEPS.map((_, i) =>
      setTimeout(() => setVisibleSteps(i + 1), 400 + i * 500)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full gradient-brand flex items-center justify-center shadow-brand">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 min-w-[200px]">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Menganalisis Respons...
        </div>
        {THINKING_STEPS.map((step, i) => {
          const Icon = step.icon
          const visible = i < visibleSteps
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -6 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 text-xs transition-colors ${
                visible ? 'text-emerald-600' : 'text-slate-300'
              }`}
            >
              {visible ? (
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-30" />
              )}
              <span className={visible ? 'font-medium' : ''}>{step.label}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Interview completion screen
// ─────────────────────────────────────────────────────────────
function CompletionOverlay({ isGenerating }: { isGenerating: boolean }) {
  const completionItems = [
    'Semua pertanyaan telah dijawab',
    'Keahlian telah dievaluasi',
    'CV telah ditinjau',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-center px-6 sm:px-8 max-w-sm w-full"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full gradient-brand mx-auto mb-6 flex items-center justify-center shadow-brand-lg">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Wawancara Selesai</h2>
        <p className="text-slate-500 text-sm mb-8">Terima kasih atas waktu Anda. Kami sedang memproses hasil wawancara.</p>

        {/* Checklist */}
        <div className="space-y-3 mb-8 text-left">
          {completionItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Generating state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 text-indigo-600"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">
            {isGenerating ? 'Membuat Laporan Kandidat...' : 'Mempersiapkan laporan...'}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Message bubble
// ─────────────────────────────────────────────────────────────
function MessageBubble({ message, isStreaming = false }: { message: InterviewMessage; isStreaming?: boolean }) {
  const isAssistant = message.role === 'assistant'
  const catConfig = message.category ? CATEGORY_CONFIG[message.category] : CATEGORY_CONFIG['UMUM']

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
          isAssistant ? 'gradient-brand shadow-brand text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {isAssistant ? 'R' : <User className="w-4 h-4" />}
      </div>

      <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-2xl space-y-1.5 ${isAssistant ? '' : 'items-end flex flex-col'}`}>
        {/* Category badge — only for assistant */}
        {isAssistant && message.category && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${catConfig.className}`}>
            {catConfig.label}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-white border border-slate-200 shadow-sm text-slate-800 rounded-tl-sm'
              : 'gradient-brand text-white rounded-tr-sm shadow-brand'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-1 align-middle animate-pulse" />
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-400 px-1 ${isAssistant ? '' : 'text-right'}`}>
          {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function InterviewInterface({ candidateId }: { candidateId: string }) {
  const router = useRouter()
  const { candidate } = useCandidateStore()
  const {
    messages,
    questionCount,
    isComplete,
    isThinking,
    addMessage,
    incrementQuestionCount,
    setComplete,
    setThinking,
    setResult,
    setError,
  } = useInterviewStore()

  const [input, setInput] = useState('')
  const [isGeneratingResult, setIsGeneratingResult] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<InterviewMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasStarted = useRef(false)
  const completionTriggered = useRef(false)

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => { scrollToBottom() }, [messages, streamingMessage])

  // Start interview on mount
  useEffect(() => {
    if (!candidate || hasStarted.current || messages.length > 0) return
    hasStarted.current = true
    generateNextQuestion([])
  }, [candidate])

  // Auto-trigger result generation when complete
  useEffect(() => {
    if (isComplete && !completionTriggered.current && !isGeneratingResult) {
      completionTriggered.current = true
      // Small delay so completion overlay renders first
      setTimeout(() => handleGenerateResult(), 1800)
    }
  }, [isComplete])

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  // ── Generate next question ──────────────────────────────────
  const generateNextQuestion = async (currentMessages: InterviewMessage[]) => {
    if (!candidate) return
    setThinking(true)
    setStreamingMessage(null)

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          cvAnalysis: candidate.cvAnalysis,
          position: candidate.position,
          questionCount: currentMessages.filter((m) => m.role === 'assistant').length,
        }),
      })

      if (!res.ok) throw new Error('Failed to get interview question')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let rawContent = ''

      // Wait for thinking indicator to show for at least 1.5 seconds
      const thinkingStart = Date.now()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('{"__meta"')) {
            try {
              const meta = JSON.parse(line)
              if (meta.__meta?.isComplete) setComplete(true)
            } catch { /* ignore */ }
          } else {
            rawContent += line
          }
        }
      }

      // Enforce minimum thinking duration of 1.5s
      const elapsed = Date.now() - thinkingStart
      if (elapsed < 1500) {
        await new Promise((r) => setTimeout(r, 1500 - elapsed))
      }

      const finalRaw = rawContent.trim()
      if (finalRaw) {
        const isInterviewDone =
          finalRaw.toLowerCase().includes('wawancara sekarang telah selesai') ||
          finalRaw.toLowerCase().includes('the interview is now complete')

        // Parse category prefix from the raw response
        const { category, content } = parseCategory(finalRaw)

        const newMsg: InterviewMessage = {
          role: 'assistant',
          content: isInterviewDone ? finalRaw : content,
          category: isInterviewDone ? 'PENUTUP' : category,
          questionNumber: currentMessages.filter((m) => m.role === 'assistant').length + 1,
          timestamp: new Date().toISOString(),
        }

        // Animate the final message appearing
        setStreamingMessage(newMsg)
        await new Promise((r) => setTimeout(r, 80))
        addMessage(newMsg)
        setStreamingMessage(null)

        if (isInterviewDone || questionCount >= MAX_QUESTIONS) {
          setComplete(true)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate question'
      setError(msg)
    } finally {
      setThinking(false)
    }
  }

  // ── Send answer ─────────────────────────────────────────────
  const handleSendAnswer = async () => {
    if (!input.trim() || isThinking || isComplete || !candidate) return

    const userMessage: InterviewMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    addMessage(userMessage)
    incrementQuestionCount()
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await generateNextQuestion(updatedMessages)
  }

  // ── Generate result ──────────────────────────────────────────
  const handleGenerateResult = async () => {
    if (!candidate) return
    setIsGeneratingResult(true)

    try {
      const res = await fetch('/api/result/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          cvAnalysis: candidate.cvAnalysis,
          position: candidate.position,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate result')
      const data = await res.json()
      setResult(data.result)
      router.push(`/result/${candidateId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate result'
      setError(msg)
    } finally {
      setIsGeneratingResult(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendAnswer()
    }
  }

  // ── No candidate guard ───────────────────────────────────────
  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-500">Memuat data kandidat...</p>
        </div>
      </div>
    )
  }

  const assistantCount = messages.filter((m) => m.role === 'assistant').length

  return (
    <div className="flex flex-col h-full relative">
      {/* Completion overlay — shows above everything */}
      <AnimatePresence>
        {isComplete && (
          <CompletionOverlay isGenerating={isGeneratingResult} />
        )}
      </AnimatePresence>

      {/* Question counter strip */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <span className="text-xs text-slate-500 font-medium">
          {assistantCount > 0
            ? `Pertanyaan ${assistantCount} dari maks. ${MAX_QUESTIONS}`
            : 'Memulai wawancara...'}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Langsung</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">
        <AnimatePresence>
          {messages.map((message, i) => (
            <MessageBubble key={i} message={message} />
          ))}
        </AnimatePresence>

        {/* Streaming (immediate echo before confirmed) */}
        {streamingMessage && !messages.includes(streamingMessage) && (
          <MessageBubble message={streamingMessage} isStreaming />
        )}

        {/* AI thinking state */}
        <AnimatePresence>
          {isThinking && !streamingMessage && (
            <AIThinkingIndicator key="thinking" />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-100 bg-white px-4 md:px-6 py-4 flex-shrink-0">
        {!isComplete && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Respons Anda
            </label>
            <div className="flex gap-2 sm:gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ceritakan pengalaman Anda... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                disabled={isThinking || isComplete}
                rows={2}
                className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                onClick={handleSendAnswer}
                disabled={!input.trim() || isThinking || isComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shadow-brand hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400">
                Jawab secara alami — tidak perlu format khusus
              </p>
              {input.length > 0 && (
                <span className="text-[10px] text-slate-400">{input.length} karakter</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
