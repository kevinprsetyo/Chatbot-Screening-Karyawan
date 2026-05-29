'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, FileSearch, Brain, Target, ShieldCheck } from 'lucide-react'

const pipelineSteps = [
  { id: 1, name: 'CV Extraction', icon: FileSearch },
  { id: 2, name: 'Semantic Analysis', icon: Brain },
  { id: 3, name: 'Competency Mapping', icon: Target },
  { id: 4, name: 'Final Verdict', icon: ShieldCheck },
]

export default function ExplainableDecision() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= 4 ? 1 : prev + 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full opacity-50 mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Text & Pipeline Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-purple-400 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Transparansi Total
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Keputusan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Explainable AI.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-xl">
            Sistem kami tidak sekadar memberikan skor "black-box". Setiap metrik diekstrak, dianalisis, dan dijelaskan dengan data pendukung yang solid.
          </p>

          {/* Pipeline Visualization */}
          <div className="relative border-l-2 border-slate-800 ml-6 space-y-8">
            {pipelineSteps.map((step) => {
              const isActive = activeStep >= step.id
              const isCurrent = activeStep === step.id
              return (
                <div key={step.id} className="relative pl-8">
                  {/* Node */}
                  <motion.div 
                    animate={{ 
                      backgroundColor: isActive ? '#9333ea' : '#1e293b',
                      borderColor: isActive ? '#a855f7' : '#334155'
                    }}
                    className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors duration-500`}
                  >
                    {isActive && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2 h-2 bg-white rounded-full" />}
                  </motion.div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border transition-all duration-500 ${isCurrent ? 'bg-purple-900/30 border-purple-500/50 text-purple-400' : isActive ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-transparent border-transparent text-slate-600'}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-semibold text-lg transition-colors duration-500 ${isCurrent ? 'text-white' : isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step.name}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Right: Interactive Report */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative perspective-1000"
        >
          <motion.div 
            style={{ rotateX: 2, rotateY: -5 }}
            className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-700">
              <div>
                <div className="text-slate-400 text-sm font-medium mb-1">Rekomendasi Sistem</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                  <h3 className="text-3xl font-bold text-white tracking-tight">STRONG HIRE</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-sm font-medium mb-1">Confidence</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={activeStep}
                  >
                    {activeStep === 1 ? '45' : activeStep === 2 ? '78' : activeStep === 3 ? '89' : '96'}%
                  </motion.span>
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="space-y-6">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">AI Reasoning</div>
              
              <div className="group bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:bg-slate-700/50 hover:border-slate-600 transition-all cursor-default">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                      Kandidat mendemonstrasikan arsitektur sistem <span className="text-purple-400 font-semibold bg-purple-500/10 px-1 rounded">event-driven</span> yang sangat baik. Ini sejalan dengan inisiatif refactoring perusahaan saat ini.
                    </p>
                    <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Sourced from: Wawancara Menit 14:20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:bg-slate-700/50 hover:border-slate-600 transition-all cursor-default">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                      Track record kepemimpinan terbukti dari <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1 rounded">mentorship tim</span> yang konsisten di 2 peran sebelumnya.
                    </p>
                    <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Sourced from: CV Section: Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
