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
  Heart,
  MessageSquare,
  Zap,
} from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { usePipelineStore } from '@/store/pipeline-store'
import { updateHRCoverage, calculateHRConfidence, defaultHRCoverage } from '@/ai/ollama/hr-engine'
import type { InterviewMessage, HRCoverage } from '@/types'
import { HR_SCORE_THRESHOLD } from '@/types'

// ─── Constants ────────────────────────────────────────────────
const MAX_QUESTIONS = 10

// ─── Coverage Badge ───────────────────────────────────────────
const COVERAGE_LABELS: Record<keyof HRCoverage, string> = {
  motivation: 'Motivasi',
  communication: 'Komunikasi',
  collaboration: 'Kolaborasi',
  leadership: 'Kepemimpinan',
  adaptability: 'Adaptabilitas',
  career_goal: 'Tujuan Karier',
}

function CoverageBadges({ coverage }: { coverage: HRCoverage }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.entries(coverage) as [keyof HRCoverage, string][]).map(([key, val]) => (
        <span
          key={key}
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            val === 'complete'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : val === 'partial'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          {COVERAGE_LABELS[key]}
        </span>
      ))}
    </div>
  )
}

// ─── Thinking indicator ───────────────────────────────────────
const THINKING_STEPS = [
  { icon: Heart, label: 'Memahami konteks kandidat' },
  { icon: Brain, label: 'Menganalisis jawaban' },
  { icon: MessageSquare, label: 'Menyiapkan pertanyaan HR' },
]

function AIThinkingIndicator() {
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
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
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
              className={`flex items-center gap-2 text-xs transition-colors ${vis ? 'text-emerald-600' : 'text-slate-300'}`}
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
function MessageBubble({ message }: { message: InterviewMessage }) {
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
            ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg text-white'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {isAssistant ? 'S' : <User className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] space-y-1.5 ${isAssistant ? '' : 'items-end flex flex-col'}`}>
        {isAssistant && (
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wide">
            HR Recruiter — Sari
          </span>
        )}
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-white border border-slate-200 shadow-sm text-slate-800 rounded-tl-sm'
              : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-tr-sm shadow-lg'
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
function CompletionOverlay({ isProcessing }: { isProcessing: boolean }) {
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
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mx-auto mb-6 flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Wawancara HR Selesai</h2>
        <p className="text-slate-500 text-sm mb-8">
          Terima kasih. Kami sedang memproses evaluasi HR Anda.
        </p>
        <div className="flex items-center justify-center gap-3 text-violet-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">
            {isProcessing ? 'Mengevaluasi hasil wawancara HR...' : 'Mempersiapkan...'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function HRInterviewPage({ candidateId }: { candidateId: string }) {
  const router = useRouter()
  const { candidate } = useCandidateStore()
  const {
    hrMessages,
    hrCoverage,
    isHRComplete,
    isHRThinking,
    addHRMessage,
    setHRCoverage,
    setHRResult,
    setHRComplete,
    setHRThinking,
    setProceedToTechnical,
    setPhase,
    setRecommendation,
  } = usePipelineStore()

  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [coverage, setCoverage] = useState<HRCoverage>(defaultHRCoverage())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasStarted = useRef(false)
  const completionTriggered = useRef(false)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [hrMessages, scrollToBottom])

  // Start HR interview on mount
  useEffect(() => {
    if (!candidate || hasStarted.current || hrMessages.length > 0) return
    hasStarted.current = true
    generateNextHRQuestion([])
  }, [candidate])

  // Trigger evaluation when complete
  useEffect(() => {
    if (isHRComplete && !completionTriggered.current && !isProcessing) {
      completionTriggered.current = true
      setTimeout(() => handleHREvaluation(), 1800)
    }
  }, [isHRComplete])

  const generateNextHRQuestion = async (currentMessages: InterviewMessage[]) => {
    if (!candidate) return
    setHRThinking(true)

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
          hrMessages: currentMessages,
          phase: 'hr_interview',
        }),
      }).then((r) => {
        if (!r.ok) throw new Error('Pipeline API failed')
        return r.json()
      })

      const [_, data] = await Promise.all([thinkingDelay, fetchResult])
      const { state } = data

      // Update coverage from LangGraph state
      setCoverage(state.hrCoverage)
      setHRCoverage(state.hrCoverage)

      // The pipeline returns the updated messages array
      const latestMessages = state.hrMessages
      const newAssistantMsg = latestMessages[latestMessages.length - 1]
      
      if (newAssistantMsg && newAssistantMsg.role === 'assistant') {
        // If we previously had messages, don't duplicate. 
        // Our store adds message by message, but pipeline returns the full array.
        // It's safer to just let the store add the last message or reset.
        // For now, since the store uses addHRMessage, we just add the newest one.
        addHRMessage(newAssistantMsg)
      }

      if (state.isHrComplete || state.phase === 'hr_eval' || state.phase === 'decision' || state.phase === 'tech_interview' || state.phase === 'recommendation') {
        setHRComplete(true)
        // If it jumped phases automatically, trigger the evaluation phase
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghasilkan pertanyaan'
      console.error('[Pipeline]', msg)
    } finally {
      setHRThinking(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isHRThinking || isHRComplete || !candidate) return

    const userMsg: InterviewMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    const updated = [...hrMessages, userMsg]
    addHRMessage(userMsg)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Update coverage locally
    const newCoverage = updateHRCoverage(coverage, updated)
    setCoverage(newCoverage)

    // Check if max reached
    const qCount = updated.filter((m) => m.role === 'assistant').length
    if (qCount >= MAX_QUESTIONS) {
      setHRComplete(true)
      return
    }

    await generateNextHRQuestion(updated)
  }

  const handleHREvaluation = async () => {
    if (!candidate) return
    setIsProcessing(true)

    try {
      // Call Pipeline for HR Evaluation (LangGraph handles the rest up to Technical or Recommendation)
      const evalRes = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          cvText: candidate.cvText,
          position: candidate.position,
          cvAnalysis: candidate.cvAnalysis,
          hrMessages,
          hrCoverage: coverage,
          isHrComplete: true,
          phase: 'hr_eval',
        }),
      })
      const { state } = await evalRes.json()
      
      const hrResult = state.hrResult
      if (hrResult) setHRResult(hrResult)

      if (state.proceedToTechnical) {
        // Proceed to Technical Interview
        setProceedToTechnical(true)
        setPhase('technical_interview')
        router.push(`/technical-interview/${candidateId}`)
      } else {
        // Skip technical — LangGraph already ran RecommendationNode for us!
        setProceedToTechnical(false)
        if (state.recommendation) {
          setRecommendation(state.recommendation)
        }
        setPhase('complete')
        router.push(`/result/${candidateId}`)
      }
    } catch (err) {
      console.error('[Pipeline Evaluation]', err)
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
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  const assistantCount = hrMessages.filter((m) => m.role === 'assistant').length
  const confidence = calculateHRConfidence(coverage)

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {isHRComplete && <CompletionOverlay isProcessing={isProcessing} />}
      </AnimatePresence>

      {/* Header strip */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">
            {assistantCount > 0
              ? `Pertanyaan HR ke-${assistantCount} dari maks. ${MAX_QUESTIONS}`
              : 'Memulai wawancara HR...'}
          </span>
          <CoverageBadges coverage={coverage} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Confidence meter */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">Kelengkapan:</span>
            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-semibold text-violet-600">
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
          {hrMessages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isHRThinking && <AIThinkingIndicator key="thinking" />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 md:px-6 py-4 flex-shrink-0">
        {!isHRComplete && (
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
                placeholder="Ceritakan pengalaman atau pandangan Anda... (Enter untuk kirim)"
                disabled={isHRThinking || isHRComplete}
                rows={2}
                className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isHRThinking || isHRComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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
