'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Code2, Database, BrainCircuit, Users, FileText, CheckCircle2, Clock, Loader2 } from 'lucide-react'

interface PositionPreviewProps {
  position: string;
}

interface ProfileData {
  focus_areas: string[];
  sample_questions: string[];
  estimated_duration: string;
}

export default function PositionPreview({ position }: PositionPreviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  
  const cache = useRef<Record<string, ProfileData>>({})

  useEffect(() => {
    if (!position) {
      setProfileData(null)
      return
    }

    if (cache.current[position]) {
      setProfileData(cache.current[position])
      return
    }

    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/position-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position })
        })
        
        if (response.ok) {
          const data = await response.json()
          cache.current[position] = data
          setProfileData(data)
        } else {
          throw new Error('Failed to fetch')
        }
      } catch (error) {
        const fallback = {
          focus_areas: ['Kompetensi Teknis', 'Pemecahan Masalah', 'Komunikasi', 'Kerja Sama'],
          sample_questions: ['Ceritakan pengalaman kerja Anda sebelumnya.', 'Apa tantangan terbesar yang pernah Anda hadapi?'],
          estimated_duration: '~ 5-10 Menit'
        }
        cache.current[position] = fallback
        setProfileData(fallback)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce slightly to avoid aggressive fetching if typing quickly
    const timeoutId = setTimeout(() => {
      fetchProfile()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [position])

  // All positions use brand purple icon — unified design system
  const getStyle = (pos: string) => {
    if (!pos) return { icon: Briefcase, color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    const lowerPos = pos.toLowerCase()
    if (lowerPos.includes('frontend')) return { icon: Code2,        color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    if (lowerPos.includes('backend')) return  { icon: Database,     color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    if (lowerPos.includes('data'))    return  { icon: FileText,     color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    if (lowerPos.includes('machine learning') || lowerPos.includes('ai')) return { icon: BrainCircuit, color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    if (lowerPos.includes('manager') || lowerPos.includes('lead')) return { icon: Users, color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
    return { icon: Briefcase, color: 'text-[#7c3aed]', bg: 'bg-[#faf5ff]', border: 'border-[#e9d5ff]' }
  }

  const style = getStyle(position || '')
  const Icon = style.icon

  // default view when no position
  const defaultSkills = ['Relevansi Posisi', 'Kompetensi Teknis', 'Keahlian Komunikasi', 'Pemecahan Masalah', 'Potensi Kepemimpinan']
  const defaultQuestions = ['Pilih posisi di formulir sebelah kiri untuk melihat detail kriteria evaluasi dan contoh pertanyaan wawancara.']

  const displaySkills = profileData?.focus_areas || defaultSkills
  const displayQuestions = profileData?.sample_questions || defaultQuestions
  const displayDuration = profileData?.estimated_duration || '~ 5-10 Menit'

  return (
    <div className="space-y-6">
      
      {/* Position Context Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e7eb] bg-[#faf5ff]">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Apa yang Akan Dievaluasi?</h3>
          <p className="text-sm text-slate-500">AI kami akan menyesuaikan pertanyaan secara spesifik berdasarkan peran yang Anda pilih.</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${style.bg} ${style.border} ${style.color} transition-colors duration-300`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Posisi Target</div>
              <div className="text-lg font-bold text-slate-900">{position || 'Belum Dipilih'}</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kriteria Evaluasi Posisi</div>
            <div className="relative min-h-[140px]">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading-skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 w-full"
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`skills-${position}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 w-full"
                  >
                    {displaySkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{skill}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {position && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                <Clock className="w-4 h-4 text-indigo-500" />
                Estimasi Waktu Wawancara
              </div>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading-duration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`duration-${position}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-slate-600 text-sm font-medium"
                  >
                    {displayDuration}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Example Questions Card */}
      {position && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Contoh Pertanyaan Wawancara</h3>
              <p className="text-sm text-slate-500">Pertanyaan akan beradaptasi berdasarkan jawaban Anda dan CV yang diunggah.</p>
            </div>
            {isLoading && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
          </div>
          <div className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading-questions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
                      <div className="space-y-2 flex-1 mt-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`questions-${position}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {displayQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-indigo-600">{idx + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 italic leading-relaxed">"{q.replace(/^"|"$/g, '')}"</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Process Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Ringkasan Proses</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">1. Analisis CV</span>
            <span className="font-medium text-slate-900">~ 30 detik</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">2. Wawancara AI</span>
            <span className="font-medium text-slate-900">
              {isLoading ? (
                 <div className="h-4 bg-slate-200 rounded animate-pulse w-16 inline-block align-middle" />
              ) : (
                displayDuration
              )}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">3. Laporan Evaluasi</span>
            <span className="font-medium text-slate-900">Instan</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-900">Total Waktu</span>
            <span className="font-bold text-indigo-600">~ 15 menit</span>
          </div>
        </div>
      </div>

    </div>
  )
}
