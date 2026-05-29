'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, User, Briefcase, Clock, MessageSquare, ArrowLeft, RotateCcw } from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { useInterviewStore } from '@/store/interview-store'
import DecisionBadge from '@/components/result/DecisionBadge'
import ScoreCard from '@/components/result/ScoreCard'
import RadarChart from '@/components/result/RadarChart'
import StrengthsWeaknesses from '@/components/result/StrengthsWeaknesses'

export default function ResultPageClient({ candidateId }: { candidateId: string }) {
  const router = useRouter()
  const { candidate } = useCandidateStore()
  const { result, messages } = useInterviewStore()

  useEffect(() => {
    // If no result, redirect back
    if (!result || !candidate) {
      router.replace('/')
    }
  }, [result, candidate, router])

  if (!result || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p>Memuat hasil...</p>
        </div>
      </div>
    )
  }

  const questionCount = messages.filter((m) => m.role === 'assistant').length

  const riskColors = {
    Low:    'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    High:   'bg-red-100 text-red-700',
  }

  const potentialColors = {
    Low:         'bg-slate-100 text-slate-600',
    Medium:      'bg-[#f3e8ff] text-[#7c3aed]',
    High:        'bg-[#e9d5ff] text-[#6d28d9]',
    Exceptional: 'bg-[#7c3aed] text-white',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 flex-shrink-0">
            <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:inline">TalentMatch AI</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Kembali ke Beranda</span>
            </Link>
            <button
              onClick={() => {
                useInterviewStore.getState().resetInterview()
                useCandidateStore.getState().clearCandidate()
                router.push('/apply')
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium gradient-brand text-white shadow-brand hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Penilaian Baru</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Penilaian Selesai
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Laporan Evaluasi</h1>
        </motion.div>

        {/* Candidate info bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-brand flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 truncate">{candidate.fullName}</div>
              <div className="text-sm text-slate-400 truncate">{candidate.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Briefcase className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-medium">{candidate.position}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm">Pengalaman {candidate.yearsOfExperience} tahun</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm">{questionCount} pertanyaan dijawab</span>
          </div>
          
          {/* Risk & Potential badges */}
          <div className="sm:ml-auto flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            <div>
              <span className="text-xs text-slate-400 mr-1">Risiko:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${riskColors[result.risk_level]}`}>
                {result.risk_level === 'Low' ? 'Rendah' : result.risk_level === 'Medium' ? 'Menengah' : 'Tinggi'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 mr-1">Potensi:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${potentialColors[result.potential_level]}`}>
                {result.potential_level === 'Exceptional' ? 'Luar Biasa' : result.potential_level === 'High' ? 'Tinggi' : result.potential_level === 'Medium' ? 'Menengah' : 'Rendah'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Decision Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <DecisionBadge result={result} />
        </motion.div>

        {/* Score Card + Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <ScoreCard result={result} />
          <RadarChart result={result} />
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <StrengthsWeaknesses result={result} />
        </motion.div>

        {/* CV Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-6"
        >
          <h3 className="font-bold text-slate-900 mb-3">Ringkasan Kandidat</h3>
          <p className="text-slate-600 leading-relaxed mb-4">{candidate.cvAnalysis.summary}</p>
          
          {candidate.cvAnalysis.skills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Keterampilan Utama</div>
              <div className="flex flex-wrap gap-2">
                {candidate.cvAnalysis.skills.slice(0, 16).map((skill) => (
                  <span
                    key={skill}
                  className="px-3 py-1 bg-[#f3e8ff] border border-[#e9d5ff] text-[#7c3aed] text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Hiring Reasoning */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-10"
        >
          <h3 className="font-bold text-slate-900 mb-3">Alasan Rekrutmen</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
        </motion.div>

        {/* Footer CTA */}
        <div className="text-center pb-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold shadow-brand-lg hover:opacity-90 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Nilai Kandidat Lain
          </Link>
        </div>
      </main>
    </div>
  )
}
