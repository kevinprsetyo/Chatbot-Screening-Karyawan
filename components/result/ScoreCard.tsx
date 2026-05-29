'use client'

import { motion } from 'framer-motion'
import type { EvaluationResult } from '@/types'

interface Props {
  result: EvaluationResult
}

const dimensions = [
  { key: 'technical_score',      label: 'Keahlian Teknis',    description: 'Kedalaman pengetahuan teknis dan keahlian langsung' },
  { key: 'communication_score',  label: 'Komunikasi',          description: 'Kejelasan, ketepatan, dan kepercayaan diri dalam jawaban' },
  { key: 'problem_solving_score',label: 'Pemecahan Masalah',   description: 'Kemampuan menalar melalui tantangan kompleks' },
  { key: 'leadership_score',     label: 'Kepemimpinan',        description: 'Inisiatif, kepemilikan, dan pengaruh tim' },
  { key: 'position_match_score', label: 'Kecocokan Posisi',    description: 'Penyelarasan dengan persyaratan peran' },
] as const

export default function ScoreCard({ result }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card p-6">
      <h3 className="font-bold text-slate-900 mb-5">Rincian Skor</h3>
      <div className="space-y-4">
        {dimensions.map((dim, i) => {
          const score = result[dim.key as keyof EvaluationResult] as number
          return (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-semibold text-slate-700">{dim.label}</span>
                  <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{dim.description}</span>
                </div>
                <span className="text-lg font-bold text-slate-900 min-w-[3ch] text-right">
                  {score}
                </span>
              </div>
              {/* Unified purple progress */}
              <div className="progress-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  className="progress-fill"
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
