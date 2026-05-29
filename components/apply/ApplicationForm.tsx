'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Shield, Lock, ArrowRight, Zap, CheckCircle } from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'
import { JOB_POSITIONS } from '@/types'
import AILoadingScreen from './AILoadingScreen'
import PositionPreview from './PositionPreview'

interface FormErrors {
  [key: string]: string
}

export default function ApplicationForm() {
  const router = useRouter()
  const { setCandidate, setProcessing, setError } = useCandidateStore()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    github: '',
    yearsOfExperience: '',
    position: '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  
  // Loading states
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2)
      newErrors.fullName = 'Nama lengkap harus minimal 2 karakter'
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Silakan masukkan alamat email yang valid'
    if (!formData.phone.trim() || formData.phone.trim().length < 7)
      newErrors.phone = 'Silakan masukkan nomor telepon yang valid'
    if (!formData.yearsOfExperience || Number(formData.yearsOfExperience) < 0)
      newErrors.yearsOfExperience = 'Silakan masukkan tahun pengalaman'
    if (!formData.position) newErrors.position = 'Silakan pilih posisi'
    if (!cvFile) newErrors.cv = 'Silakan unggah CV Anda (PDF)'
    return Object.keys(newErrors).length === 0 ? true : (setErrors(newErrors), false)
  }

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrors((e) => ({ ...e, cv: 'Hanya file PDF yang diterima' }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((e) => ({ ...e, cv: 'Ukuran file harus di bawah 10MB' }))
      return
    }
    setCvFile(file)
    setErrors((e) => { const { cv: _, ...rest } = e; return rest })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Show loading screen immediately
    setShowLoadingScreen(true)
    setProcessing(true)

    try {
      const data = new FormData()
      data.append('cv', cvFile!)
      data.append('fullName', formData.fullName)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('linkedIn', formData.linkedIn)
      data.append('github', formData.github)
      data.append('yearsOfExperience', formData.yearsOfExperience)
      data.append('position', formData.position)

      const res = await fetch('/api/cv/analyze', { method: 'POST', body: data })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menganalisis CV')
      }

      const result = await res.json()
      setCandidate(result.candidate)
      setAnalysisResult(result)
      
      // Note: Navigation happens after loading screen finishes its animation (via onComplete)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(message)
      setErrors({ submit: message })
      setShowLoadingScreen(false)
      setProcessing(false)
    }
  }

  const handleLoadingComplete = () => {
    if (analysisResult?.candidate?.id) {
      router.push(`/interview/${analysisResult.candidate.id}`)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/15 focus:border-[#7c3aed] ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-[#e5e7eb] hover:border-[#c084fc]'
    }`

  return (
    <>
      <AnimatePresence>
        {showLoadingScreen && <AILoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form (Span 7) */}
        <div className="lg:col-span-7 w-full min-w-0">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 sm:p-8 md:p-10 w-full min-w-0">
            {/* Job Position */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Posisi yang Dilamar
              </h3>
              <div>
                <select
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData((f) => ({ ...f, position: e.target.value }))}
                  className={`${inputClass('position')} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]`}
                >
                  <option value="">Pilih posisi pekerjaan...</option>
                  {JOB_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 mt-8">
                Informasi Pribadi
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Nama Lengkap *"
                    value={formData.fullName}
                    onChange={(e) => setFormData((f) => ({ ...f, fullName: e.target.value }))}
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Alamat Email *"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Nomor Telepon *"
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    placeholder="Tahun Pengalaman *"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData((f) => ({ ...f, yearsOfExperience: e.target.value }))}
                    className={inputClass('yearsOfExperience')}
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="url"
                id="linkedIn"
                placeholder="LinkedIn URL (opsional)"
                value={formData.linkedIn}
                onChange={(e) => setFormData((f) => ({ ...f, linkedIn: e.target.value }))}
                className={inputClass('linkedIn')}
              />
              <input
                type="url"
                id="github"
                placeholder="GitHub URL (opsional)"
                value={formData.github}
                onChange={(e) => setFormData((f) => ({ ...f, github: e.target.value }))}
                className={inputClass('github')}
              />
            </div>

            {/* CV Upload */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-8">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                  Unggah CV
                </h3>
                <span className="text-xs text-slate-400">Maksimal 10 MB (PDF)</span>
              </div>
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => !cvFile && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 min-h-[120px] transition-all duration-200 ${
                  cvFile
                    ? 'border-[#a855f7] bg-[#faf5ff] cursor-default'
                    : isDragging
                    ? 'border-[#7c3aed] bg-[#f3e8ff] cursor-copy'
                    : 'border-[#e5e7eb] hover:border-[#a855f7] hover:bg-[#faf5ff] cursor-pointer'
                } ${errors.cv ? 'border-red-300 bg-red-50' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                  {cvFile ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white shadow-sm border border-[#e9d5ff] rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#7c3aed]" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{cvFile.name}</p>
                        <p className="text-xs sm:text-sm text-slate-500">
                          File PDF · {(cvFile.size / 1024 / 1024).toFixed(2)} MB 
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCvFile(null) }}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-1"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 bg-white shadow-sm border border-[#e5e7eb] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-6 h-6 text-[#7c3aed]" />
                      </div>
                      <p className="text-slate-900 font-medium mb-1">
                        Seret & lepas CV Anda di sini, atau{' '}
                        <span className="text-[#7c3aed] font-semibold underline decoration-[#d8b4fe] underline-offset-2">telusuri</span>
                      </p>
                      <p className="text-sm text-slate-500">Mendukung format PDF Resume, CV, atau Portofolio</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.cv && <p className="text-red-500 text-sm mt-2">{errors.cv}</p>}
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={showLoadingScreen}
                className="w-full py-3 sm:py-4 px-4 sm:px-8 rounded-2xl gradient-brand text-white font-bold text-sm sm:text-base hover:opacity-90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 shadow-brand-lg"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 flex-shrink-0" />
                <span className="truncate">Analisis CV & Mulai Evaluasi</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0 hidden sm:block" />
              </button>
              
              {/* Trust icons */}
              <div className="mt-6 flex items-start gap-3 justify-center text-center">
                <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-full sm:max-w-xs leading-relaxed">
                  CV dan informasi pribadi Anda hanya digunakan untuk keperluan evaluasi kandidat dan tidak dibagikan kepada pihak ketiga. 
                  <Lock className="w-3 h-3 inline-block ml-1 text-slate-400" />
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24 w-full">
          <PositionPreview position={formData.position} />
        </div>
      </div>
    </>
  )
}
