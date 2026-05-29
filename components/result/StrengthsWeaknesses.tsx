'use client'

import { motion } from 'framer-motion'
import type { EvaluationResult } from '@/types'

interface Props {
  result: EvaluationResult
}

export default function StrengthsWeaknesses({ result }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            ↑
          </div>
          <h3 className="font-bold text-emerald-800">Kekuatan</h3>
        </div>
        {result.strengths.length > 0 ? (
          <ul className="space-y-2">
            {result.strengths.map((strength, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-start gap-2 text-sm text-emerald-800"
              >
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                {strength}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-600 italic">Tidak ada kekuatan spesifik yang teridentifikasi.</p>
        )}
      </motion.div>

      {/* Weaknesses */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-amber-50 border border-amber-100 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            ↓
          </div>
          <h3 className="font-bold text-amber-800">Area Pengembangan</h3>
        </div>
        {result.weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {result.weaknesses.map((weakness, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-start gap-2 text-sm text-amber-800"
              >
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                {weakness}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-amber-600 italic">Tidak ada kelemahan spesifik yang teridentifikasi.</p>
        )}
      </motion.div>
    </div>
  )
}
