'use client'

import { motion } from 'framer-motion'
import { Zap, Scale, Eye, Ruler } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Kecepatan',
    description: 'Screening kandidat secara menyeluruh dalam hitungan menit, bukan minggu.',
  },
  {
    icon: Scale,
    title: 'Objektivitas',
    description: 'Semua kandidat dinilai dengan standar yang sama tanpa terpengaruh bias.',
  },
  {
    icon: Eye,
    title: 'Transparansi',
    description: 'Keputusan selalu didukung oleh alasan dan insight data yang jelas.',
  },
  {
    icon: Ruler,
    title: 'Presisi',
    description: 'Skor kuantitatif untuk dimensi teknis, komunikasi, dan kecocokan.',
  },
]

export default function Benefits() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Dibangun untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">objektivitas dan kecepatan.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                
                <div className="w-14 h-14 rounded-2xl bg-slate-700 border border-slate-600 flex items-center justify-center mb-6 shadow-sm group-hover:border-purple-500/50 group-hover:shadow-purple-500/20 transition-all">
                  <benefit.icon className="w-6 h-6 text-slate-300 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
