'use client'

import { motion } from 'framer-motion'
import { User, Briefcase, Clock, Star, CheckCircle2 } from 'lucide-react'
import { useCandidateStore } from '@/store/candidate-store'

export default function CandidateContextPanel() {
  const { candidate } = useCandidateStore()

  if (!candidate) return null

  const topSkills = candidate.cvAnalysis.skills.slice(0, 5)
  const yearsLabel =
    candidate.yearsOfExperience === 0
      ? 'Fresh Graduate'
      : `${candidate.yearsOfExperience} Tahun`

  const focusAreas = [
    'Technical Skills',
    'Communication',
    'Problem Solving',
    'Leadership',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Candidate Profile */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb] bg-[#faf5ff]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="section-label">Profil Kandidat</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Nama</div>
            <div className="text-sm font-semibold text-slate-900 truncate">{candidate.fullName}</div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                <Briefcase className="w-3 h-3" />
                Posisi
              </div>
              <div className="text-xs font-semibold text-[#7c3aed] leading-snug">
                {candidate.position}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                <Clock className="w-3 h-3" />
                Pengalaman
              </div>
              <div className="text-xs font-semibold text-slate-900">{yearsLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Highlights */}
      {topSkills.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span className="section-label">Sorotan CV</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {topSkills.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] flex-shrink-0" />
                <span className="text-xs text-slate-700 font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Focus */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="section-label">Fokus Wawancara</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#e9d5ff] bg-[#faf5ff] text-xs font-medium text-[#7c3aed]"
            >
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              {area}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
