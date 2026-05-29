'use client'

import { motion } from 'framer-motion'
import { Lightbulb, CheckCircle2 } from 'lucide-react'

const TIPS = [
  'Berikan contoh nyata dari pengalaman Anda',
  'Sebutkan teknologi yang digunakan',
  'Jelaskan dampak yang berhasil dicapai',
  'Sertakan angka atau metrik jika ada',
]

export default function InterviewTipsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[#e9d5ff]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span className="section-label text-[#7c3aed]">Tips Jawaban Terbaik</span>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        {TIPS.map((tip, i) => (
          <motion.div
            key={tip}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="flex items-start gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed] flex-shrink-0 mt-0.5" />
            <span className="text-xs text-[#5b21b6] leading-snug">{tip}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
