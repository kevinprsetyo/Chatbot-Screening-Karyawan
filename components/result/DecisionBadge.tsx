'use client'

import { motion } from 'framer-motion'
import type { EvaluationResult } from '@/types'

interface Props {
  result: EvaluationResult
}

export default function DecisionBadge({ result }: Props) {
  const config = {
    ACCEPTED: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: '✓',
      iconBg: 'bg-emerald-500',
      label: 'Diterima',
      desc: 'Kandidat ini direkomendasikan untuk tahap selanjutnya.',
    },
    CONSIDERED: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '~',
      iconBg: 'bg-amber-500',
      label: 'Dipertimbangkan',
      desc: 'Kandidat ini menunjukkan potensi tetapi memerlukan peninjauan lebih lanjut.',
    },
    REJECTED: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✕',
      iconBg: 'bg-red-500',
      label: 'Tidak Direkomendasikan',
      desc: 'Kandidat ini tidak memenuhi persyaratan untuk peran ini.',
    },
  }

  // Normalize Indonesian decision strings from graph.ts agent to English keys
  const normalizeDecision = (decision: string): 'ACCEPTED' | 'CONSIDERED' | 'REJECTED' => {
    const map: Record<string, 'ACCEPTED' | 'CONSIDERED' | 'REJECTED'> = {
      ACCEPTED: 'ACCEPTED',
      CONSIDERED: 'CONSIDERED',
      REJECTED: 'REJECTED',
      DITERIMA: 'ACCEPTED',
      DIPERTIMBANGKAN: 'CONSIDERED',
      DITOLAK: 'REJECTED',
    }
    return map[decision?.toUpperCase()] ?? 'CONSIDERED'
  }

  const normalizedDecision = normalizeDecision(result.decision)
  const cfg = config[normalizedDecision] ?? config['CONSIDERED']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${cfg.bg} ${cfg.border} border rounded-2xl p-6`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={`w-14 h-14 ${cfg.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-white text-2xl font-bold">{cfg.icon}</span>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            Keputusan Rekrutmen
          </div>
          <div className={`text-2xl font-bold ${cfg.text}`}>{cfg.label}</div>
          <div className="text-sm text-slate-500 mt-0.5">{cfg.desc}</div>
        </div>
        <div className="ml-auto text-right">
          <div className={`text-5xl font-bold ${cfg.text}`}>{result.overall_score}</div>
          <div className="text-sm text-slate-400">Skor Keseluruhan</div>
        </div>
      </div>
    </motion.div>
  )
}
