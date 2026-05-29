'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Upload, Bot, BarChart } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload CV',
    description: 'Sistem langsung mengekstrak data relevan tanpa input manual dari kandidat.',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI Interview',
    description: 'Wawancara adaptif yang merespon jawaban kandidat untuk menggali lebih dalam pengalaman mereka.',
  },
  {
    number: '03',
    icon: BarChart,
    title: 'Hiring Insight',
    description: 'Laporan komprehensif lengkap dengan skor objektif dan rekomendasi final Hire/No Hire.',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // We want the progress bar to fill from 0 to 100%
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="how-it-works" className="py-32 bg-white" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Proses evaluasi yang <span className="gradient-text">mulus.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Hanya butuh 3 langkah untuk beralih dari kandidat baru menjadi keputusan rekrutmen yang meyakinkan.
          </p>
        </div>

        <div className="relative">
          {/* Timeline background line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
          
          {/* Animated fill line */}
          <motion.div 
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-purple-600 rounded-full z-0"
          />

          <div className="space-y-24 relative z-10">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 w-full pl-24 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4">
                      Langkah {step.number}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-lg">{step.description}</p>
                  </div>

                  {/* Icon Node */}
                  <div className="absolute left-8 md:static md:left-auto md:w-24 md:flex-shrink-0 flex justify-center -translate-x-1/2 md:translate-x-0">
                    <div className="w-16 h-16 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-lg relative group transition-colors hover:border-purple-200 z-10">
                      {/* Pulse effect behind icon */}
                      <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <step.icon className="w-7 h-7 text-purple-600 relative z-10" />
                    </div>
                  </div>

                  {/* Empty Spacer for alignment */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
