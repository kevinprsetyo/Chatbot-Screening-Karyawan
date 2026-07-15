'use client'

import { motion } from 'framer-motion'
import type { RecommendationResult } from '@/types'
import { CheckCircle2, Users, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  result: RecommendationResult
}

const RECOMMENDATION_CONFIG = {
  'Proceed to Human Interview': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500',
    label: 'Lanjut ke Wawancara Manusia',
    desc: 'Kandidat direkomendasikan untuk bertemu langsung dengan tim rekrutmen manusia.',
  },
  'Need Further Review': {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: Users,
    iconBg: 'bg-amber-500',
    label: 'Perlu Peninjauan Lebih Lanjut',
    desc: 'Kandidat menunjukkan potensi tetapi memerlukan klarifikasi dari pewawancara manusia.',
  },
  'Not Recommended': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: XCircle,
    iconBg: 'bg-red-500',
    label: 'Tidak Direkomendasikan',
    desc: 'Kandidat belum memenuhi kriteria minimum untuk posisi ini saat ini.',
  },
}

export default function RecommendationBadge({ result }: Props) {
  const config =
    RECOMMENDATION_CONFIG[result.recommendation] ??
    RECOMMENDATION_CONFIG['Need Further Review']

  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${config.bg} ${config.border} border rounded-2xl p-6`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={`w-14 h-14 ${config.iconBg} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            Rekomendasi AI Screening
          </div>
          <div className={`text-xl font-bold ${config.text}`}>{config.label}</div>
          <div className="text-sm text-slate-500 mt-0.5">{config.desc}</div>
        </div>
        <div className="ml-auto text-right flex-shrink-0">
          <div className={`text-5xl font-bold ${config.text}`}>{result.overall_score}</div>
          <div className="text-sm text-slate-400">Skor Keseluruhan</div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-5 pt-4 border-t border-current/10 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-700">{result.cv_match_score}</div>
          <div className="text-[11px] text-slate-500">Kecocokan CV</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-700">{result.hr_score}</div>
          <div className="text-[11px] text-slate-500">Skor HR</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-700">{result.technical_score}</div>
          <div className="text-[11px] text-slate-500">Skor Teknis</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 px-3 py-2 bg-white/60 rounded-xl">
        <AlertTriangle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Ini adalah rekomendasi sistem AI, bukan keputusan final. Keputusan rekrutmen tetap berada di tangan tim HR manusia.
        </p>
      </div>
    </motion.div>
  )
}
