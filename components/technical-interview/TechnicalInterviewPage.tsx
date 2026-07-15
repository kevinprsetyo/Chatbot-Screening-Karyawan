'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Loader2,
  User,
  CheckCircle2,
  Brain,
  Code2,
  MessageSquare,
} from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { usePipelineStore } from '@/store/pipeline-store'
import { updateTechnicalCoverage, calculateTechnicalConfidence, defaultTechnicalCoverage } from '@/ai/ollama/technical-engine'
import type { InterviewMessage, TechnicalCoverage } from '@/types'

const MAX_QUESTIONS = 10

// ─── Coverage badges ──────────────────────────────────────────
const TECH_COVERAGE_LABELS: Record<keyof TechnicalCoverage, string> = {
  technical_depth: 'Kedalaman Teknis',
  experience_validation: 'Validasi Pengalaman',
  problem_solving: 'Pemecahan Masalah',
  system_understanding: 'Pemahaman Sistem',
}

function TechCoverageBadges({ coverage }: { coverage: TechnicalCoverage }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.entries(coverage) as [keyof TechnicalCoverage, string][]).map(([key, val]) => (
        <span
          key={key}
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            val === 'complete'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : val === 'partial'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {TECH_COVERAGE_LABELS[key]}
        </span>
      ))}
    </div>
  )
}

// ─── Thinking indicator ───────────────────────────────────────
const THINKING_STEPS = [
  { icon: Code2, label: 'Menganalisis kompetensi teknis' },
  { icon: Brain, label: 'Menyusun pertanyaan teknis' },
  { icon: MessageSquare, label: 'Memverifikasi relevansi' },
]

function TechThinkingIndicator() {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    const timers = THINKING_STEPS.map((_, i) =>
      setTimeout(() => setVisible(i + 1), 400 + i * 500)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 min-w-[220px]">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Menganalisis Respons...
        </div>
        {THINKING_STEPS.map((step, i) => {
          const Icon = step.icon
          const vis = i < visible
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -6 }}
              animate={vis ? { opacity: 1, x: 0 } : {}}
              className={`flex items-center gap-2 text-xs ${vis ? 'text-emerald-600' : 'text-slate-300'}`}
            >
              {vis ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-30" />}
              <span className={vis ? 'font-medium' : ''}>{step.label}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Message bubble ───────────────────────────────────────────
function TechMessageBubble({ message }: { message: InterviewMessage }) {
  const isAssistant = message.role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
          isAssistant
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {isAssistant ? 'B' : <User className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] space-y-1.5 ${isAssistant ? '' : 'items-end flex flex-col'}`}>
        {isAssistant && (
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
            Tech Lead — Budi
          </span>
        )}
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-white border border-slate-200 shadow-sm text-slate-800 rounded-tl-sm'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm shadow-lg'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-[10px] text-slate-400 px-1 ${isAssistant ? '' : 'text-right'}`}>
          {new Date(message.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Completion overlay ───────────────────────────────────────
function TechCompletionOverlay({ isProcessing }: { isProcessing: boolean }) {
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
        className="text-center px-6 max-w-sm w-full"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-6 flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Wawancara Teknis Selesai</h2>
        <p className="text-slate-500 text-sm mb-8">
          Terima kasih. Kami sedang menyusun laporan akhir rekomendasi Anda.
        </p>
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">
            {isProcessing ? 'Membuat laporan rekomendasi...' : 'Mempersiapkan...'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function TechnicalInterviewPage({ candidateId }: { candidateId: string }) {
  const router = useRouter()
  const { candidate } = useCandidateStore()
  const {
    technicalMessages,
    technicalCoverage,
    hrResult,
    isTechnicalComplete,
    isTechnicalThinking,
    addTechnicalMessage,
    setTechnicalCoverage,
    setTechnicalResult,
    setTechnicalComplete,
    setTechnicalThinking,
    setRecommendation,
    setPhase,
  } = usePipelineStore()

  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [coverage, setCoverage] = useState<TechnicalCoverage>(defaultTechnicalCoverage())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasStarted = useRef(false)
  const completionTriggered = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [technicalMessages, scrollToBottom])

  useEffect(() => {
    if (!candidate || hasStarted.current || technicalMessages.length > 0) return
    hasStarted.current = true
    generateNextTechQuestion([])
  }, [candidate])

  useEffect(() => {
    if (isTechnicalComplete && !completionTriggered.current && !isProcessing) {
      completionTriggered.current = true
      setTimeout(() => handleTechnicalEvaluation(), 1800)
    }
  }, [isTechnicalComplete])

  const generateNextTechQuestion = async (currentMessages: InterviewMessage[]) => {
    if (!candidate) return
    setTechnicalThinking(true)

    try {
      const thinkingDelay = new Promise((r) => setTimeout(r, 1500))
      const fetchResult = fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          cvText: candidate.cvText,
          position: candidate.position,
          cvAnalysis: candidate.cvAnalysis,
          technicalMessages: currentMessages,
          phase: 'tech_interview',
        }),
      }).then((r) => {
        if (!r.ok) throw new Error('Pipeline API failed')
        return r.json()
      })

      const [_, data] = await Promise.all([thinkingDelay, fetchResult])
      const { state } = data

      // Update coverage from LangGraph state
      setCoverage(state.technicalCoverage)
      setTechnicalCoverage(state.technicalCoverage)

      // The pipeline returns the updated messages array
      const latestMessages = state.technicalMessages
      const newAssistantMsg = latestMessages[latestMessages.length - 1]
      
      if (newAssistantMsg && newAssistantMsg.role === 'assistant') {
        addTechnicalMessage(newAssistantMsg)
      }

      if (state.isTechnicalComplete || state.phase === 'tech_eval' || state.phase === 'recommendation' || state.phase === 'finished') {
        setTechnicalComplete(true)
      }
    } catch (err) {
      console.error('[Pipeline Tech]', err)
    } finally {
      setTechnicalThinking(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTechnicalThinking || isTechnicalComplete || !candidate) return

    const userMsg: InterviewMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    const updated = [...technicalMessages, userMsg]
    addTechnicalMessage(userMsg)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const newCoverage = updateTechnicalCoverage(coverage, updated)
    setCoverage(newCoverage)

    const qCount = updated.filter((m) => m.role === 'assistant').length
    if (qCount >= MAX_QUESTIONS) {
      setTechnicalComplete(true)
      return
    }

    await generateNextTechQuestion(updated)
  }

  const handleTechnicalEvaluation = async () => {
    if (!candidate || !hrResult) return
    setIsProcessing(true)

    try {
      // Call Pipeline for Technical Evaluation and Recommendation
      const evalRes = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          cvText: candidate.cvText,
          position: candidate.position,
          cvAnalysis: candidate.cvAnalysis,
          hrResult,
          technicalMessages,
          technicalCoverage: coverage,
          isTechnicalComplete: true,
          phase: 'tech_eval',
        }),
      })
      const { state } = await evalRes.json()
      
      if (state.technicalResult) setTechnicalResult(state.technicalResult)
      if (state.recommendation) setRecommendation(state.recommendation)

      setPhase('complete')
      router.push(`/result/${candidateId}`)
    } catch (err) {
      console.error('[Pipeline Tech Eval]', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const assistantCount = technicalMessages.filter((m) => m.role === 'assistant').length
  const confidence = calculateTechnicalConfidence(coverage)

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {isTechnicalComplete && <TechCompletionOverlay isProcessing={isProcessing} />}
      </AnimatePresence>

      {/* Header strip */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">
            {assistantCount > 0
              ? `Pertanyaan Teknis ke-${assistantCount} dari maks. ${MAX_QUESTIONS}`
              : 'Memulai wawancara teknis...'}
          </span>
          <TechCoverageBadges coverage={coverage} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">Kelengkapan:</span>
            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-semibold text-blue-600">
              {Math.round(confidence * 100)}%
            </span>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">
        <AnimatePresence>
          {technicalMessages.map((msg, i) => (
            <TechMessageBubble key={i} message={msg} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isTechnicalThinking && <TechThinkingIndicator key="thinking" />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 md:px-6 py-4 flex-shrink-0">
        {!isTechnicalComplete && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Respons Anda
            </label>
            <div className="flex gap-2 sm:gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  const el = e.target
                  el.style.height = 'auto'
                  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
                }}
                onKeyDown={handleKeyDown}
                placeholder="Jelaskan pendekatan teknis Anda... (Enter untuk kirim)"
                disabled={isTechnicalThinking || isTechnicalComplete}
                rows={2}
                className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isTechnicalThinking || isTechnicalComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
