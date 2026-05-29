'use client'

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { EvaluationResult } from '@/types'

interface Props {
  result: EvaluationResult
}

export default function RadarChart({ result }: Props) {
  const data = [
    { subject: 'Keahlian Teknis', score: result.technical_score, fullMark: 100 },
    { subject: 'Komunikasi', score: result.communication_score, fullMark: 100 },
    { subject: 'Pemecahan Masalah', score: result.problem_solving_score, fullMark: 100 },
    { subject: 'Kepemimpinan', score: result.leadership_score, fullMark: 100 },
    { subject: 'Kecocokan Posisi', score: result.position_match_score, fullMark: 100 },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="font-bold text-slate-900 mb-2">Radar Kompetensi</h3>
      <p className="text-sm text-slate-400 mb-4">Gambaran visual dari semua dimensi evaluasi</p>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
          />
          <Radar
            name="Skor"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}/100`, 'Skor']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
