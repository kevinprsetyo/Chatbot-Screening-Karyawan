'use client'

import { motion } from 'framer-motion'

export default function EvaluationPreview() {
  const scores = [
    { label: 'Keahlian Teknis', score: 88, color: '#6366f1' },
    { label: 'Komunikasi', score: 76, color: '#7c3aed' },
    { label: 'Pemecahan Masalah', score: 91, color: '#8b5cf6' },
    { label: 'Kepemimpinan', score: 68, color: '#a855f7' },
    { label: 'Kecocokan Posisi', score: 94, color: '#c026d3' },
  ]

  const overall = Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)

  return (
    <section className="py-16 lg:py-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            Pratinjau Evaluasi
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Setiap kandidat, dievaluasi sepenuhnya.
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Gambaran lengkap dari setiap kandidat — dinilai, terstruktur, dan siap ditindaklanjuti.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-brand p-8 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-indigo-200 text-sm font-medium mb-1">Laporan Penilaian Kandidat</div>
                <h3 className="text-2xl font-bold mb-1">Sean</h3>
                <p className="text-indigo-200">Full Stack Developer · Pengalaman 5 tahun</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold">{overall}</div>
                <div className="text-indigo-200 text-sm">Skor Keseluruhan</div>
                <div className="mt-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold">
                  ✓ DITERIMA
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
              {scores.map((score, i) => (
                <motion.div
                  key={score.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-slate-900 mb-2">{score.score}</div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${score.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: score.color }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{score.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="text-sm font-semibold text-emerald-700 mb-3 uppercase tracking-wide">
                  ↑ Kekuatan
                </div>
                {[
                  'Keahlian mendalam React & TypeScript',
                  'Komunikasi teknis yang jelas dan ringkas',
                  'Pengalaman desain sistem dalam skala besar',
                ].map((s) => (
                  <div key={s} className="flex items-start gap-2 text-sm text-emerald-800 py-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {s}
                  </div>
                ))}
              </div>

              {/* Weaknesses */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <div className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
                  ↓ Area Pengembangan
                </div>
                {[
                  'Kepemimpinan lintas fungsi yang terbatas',
                  'Paparan DevOps hanya di tingkat permukaan',
                  'Bisa mengukur dampak masa lalu dengan lebih jelas',
                ].map((s) => (
                  <div key={s} className="flex items-start gap-2 text-sm text-amber-800 py-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {s}
                  </div>
                ))}
              </div>

              {/* Risk & Potential */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                  Penilaian
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tingkat Risiko</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">Rendah</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Potensi Pertumbuhan</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">Tinggi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Pertanyaan yang Diajukan</span>
                    <span className="text-sm font-semibold text-slate-900">7 / 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Keputusan</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">DITERIMA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
