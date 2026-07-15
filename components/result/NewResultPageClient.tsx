'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Zap,
  User,
  Briefcase,
  Clock,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Target,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { usePipelineStore } from '@/store/pipeline-store'
import { useInterviewStore } from '@/store/interview-store'
import RecommendationBadge from '@/components/result/RecommendationBadge'
import type { RecommendationResult } from '@/types'

// ─── Score bar ────────────────────────────────────────────────
function ScoreBar({ label, score, color = 'bg-violet-500' }: { label: string; score: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-bold text-slate-900">{score}<span className="text-slate-400 text-xs">/100</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function NewResultPageClient({ candidateId }: { candidateId: string }) {
  const router = useRouter()
  const { candidate } = useCandidateStore()
  const { recommendation, hrResult, technicalResult } = usePipelineStore()

  useEffect(() => {
    if (!recommendation || !candidate) {
      router.replace('/')
    }
  }, [recommendation, candidate, router])

  if (!recommendation || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p>Memuat laporan rekomendasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 flex-shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:inline">TalentMatch AI</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Kembali</span>
            </Link>
            <button
              onClick={() => {
                usePipelineStore.getState().resetPipeline()
                useCandidateStore.getState().clearCandidate()
                useInterviewStore.getState().resetInterview()
                router.push('/apply')
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Penilaian Baru</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Proses Screening Selesai
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Laporan Rekomendasi AI</h1>
        </motion.div>

        {/* Candidate info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 truncate">{candidate.fullName}</div>
              <div className="text-sm text-slate-400 truncate">{candidate.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Briefcase className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium">{candidate.position}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-violet-500" />
            <span className="text-sm">{candidate.yearsOfExperience} tahun pengalaman</span>
          </div>
        </motion.div>

        {/* Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <RecommendationBadge result={recommendation} />
        </motion.div>

        {/* Score breakdown grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* HR Scores */}
          {hrResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Evaluasi Wawancara HR</h3>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Komunikasi" score={hrResult.communication} color="bg-violet-400" />
                <ScoreBar label="Motivasi" score={hrResult.motivation} color="bg-violet-500" />
                <ScoreBar label="Kepemimpinan" score={hrResult.leadership} color="bg-purple-500" />
                <ScoreBar label="Adaptabilitas" score={hrResult.adaptability} color="bg-fuchsia-500" />
              </div>
              {hrResult.notes && (
                <p className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 leading-relaxed">
                  {hrResult.notes}
                </p>
              )}
            </motion.div>
          )}

          {/* Technical Scores */}
          {technicalResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-slate-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Evaluasi Wawancara Teknis</h3>
              </div>
              <div className="space-y-3">
                <ScoreBar label="Skor Teknis" score={technicalResult.technical_score} color="bg-blue-500" />
                <ScoreBar label="Pemecahan Masalah" score={technicalResult.problem_solving_score} color="bg-indigo-500" />
                <ScoreBar label="Validasi Pengalaman" score={technicalResult.experience_validation_score} color="bg-cyan-500" />
              </div>
              {technicalResult.notes && (
                <p className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 leading-relaxed">
                  {technicalResult.notes}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Strengths & Areas for Development */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          {/* Strengths */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900">Kekuatan</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Development */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Area Pengembangan</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.areas_for_development.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Red Flags */}
        {recommendation.red_flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-800">Potensi Kekhawatiran</h3>
            </div>
            <ul className="space-y-2">
              {recommendation.red_flags.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* AI Notes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-violet-500" />
            <h3 className="font-bold text-slate-900">Catatan AI</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
            {recommendation.ai_notes}
          </p>
        </motion.div>

        {/* Suggested Focus for Interviewer */}
        {recommendation.suggested_focus_for_interviewer.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-6 mb-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-violet-900">Saran untuk Pewawancara Manusia</h3>
            </div>
            <p className="text-xs text-violet-600 mb-3">
              Topik-topik berikut disarankan untuk digali lebih dalam saat wawancara dengan tim HR manusia:
            </p>
            <ul className="space-y-2">
              {recommendation.suggested_focus_for_interviewer.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-violet-800">
                  <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-violet-700">
                    {i + 1}
                  </div>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center pb-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold shadow-xl hover:opacity-90 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Nilai Kandidat Lain
          </Link>
        </div>
      </main>
    </div>
  )
}
