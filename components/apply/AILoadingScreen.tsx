'use client'

import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, FileSearch, Fingerprint, Brain, Database, LayoutTemplate } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AILoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, text: 'Ekstraksi Informasi CV', icon: FileSearch, delay: 0 },
  { id: 2, text: 'Identifikasi Keahlian & Pengalaman', icon: Fingerprint, delay: 1000 },
  { id: 3, text: 'Pencocokan dengan Kebutuhan Posisi', icon: Database, delay: 2000 },
  { id: 4, text: 'Persiapan Pertanyaan Wawancara', icon: LayoutTemplate, delay: 3000 },
  { id: 5, text: 'Penyusunan Profil Kandidat', icon: Brain, delay: 4000 },
]

export default function AILoadingScreen({ onComplete }: AILoadingScreenProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = steps.map((step, index) => {
      return setTimeout(() => {
        setActiveStep(index + 1)
      }, step.delay)
    })

    const finalTimer = setTimeout(() => {
      onComplete()
    }, 5500) // Call onComplete after all steps finish

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finalTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-indigo-500 border-t-transparent"
            />
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">AI Sedang Menganalisis Profil Kandidat</h2>
          <p className="text-sm text-slate-500">Mempersiapkan lingkungan wawancara kustom Anda...</p>
        </div>

        <div className="p-8 space-y-5">
          {steps.map((step, index) => {
            const isCompleted = activeStep > index
            const isCurrent = activeStep === index
            const isWaiting = activeStep < index

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isWaiting ? 0.4 : 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <span className={`font-medium text-sm ${isCompleted ? 'text-slate-900' : isCurrent ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                  {step.text}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
