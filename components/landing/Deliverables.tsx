'use client'

import { motion } from 'framer-motion'
import { Target, Code2, Sparkles, AlertTriangle, Briefcase } from 'lucide-react'

export default function Deliverables() {
  const items = [
    { icon: Target, label: 'Candidate Match Score' },
    { icon: Code2, label: 'Technical Evaluation' },
    { icon: Sparkles, label: 'Strengths' },
    { icon: AlertTriangle, label: 'Weaknesses' },
    { icon: Briefcase, label: 'Hiring Recommendation' },
  ]

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
          Apa yang Akan Diterima oleh Recruiter
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 text-slate-600"
            >
              <item.icon className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
