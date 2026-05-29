'use client'

import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { useInterviewStore } from '@/store/interview-store'

const CATEGORIES = [
  {
    key: 'technical',
    label: 'Teknis',
    // Weighted progression curve
    questionWeights: [0, 30, 55, 65, 70, 75, 80, 85, 88, 90, 95],
  },
  {
    key: 'communication',
    label: 'Komunikasi',
    questionWeights: [0, 15, 30, 45, 55, 65, 72, 78, 83, 88, 92],
  },
  {
    key: 'problemSolving',
    label: 'Pemecahan Masalah',
    questionWeights: [0, 10, 20, 40, 58, 68, 75, 80, 84, 88, 91],
  },
  {
    key: 'leadership',
    label: 'Kepemimpinan',
    questionWeights: [0, 5, 10, 20, 35, 50, 62, 72, 78, 84, 90],
  },
]

export default function AssessmentProgress() {
  const { questionCount } = useInterviewStore()

  const idx = Math.min(questionCount, 10)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span className="section-label">Progres Penilaian</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {CATEGORIES.map((cat, i) => {
          const pct = cat.questionWeights[idx]
          return (
            <div key={cat.key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-600">{cat.label}</span>
                <motion.span
                  key={`${cat.key}-${pct}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-bold text-slate-800"
                >
                  {pct > 0 ? `${pct}%` : '—'}
                </motion.span>
              </div>
              {/* Purple-only progress track */}
              <div className="progress-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                  className="progress-fill"
                />
              </div>
            </div>
          )
        })}

        {questionCount === 0 && (
          <p className="text-xs text-slate-400 text-center pt-1">
            Memulai penilaian...
          </p>
        )}
      </div>
    </motion.div>
  )
}
