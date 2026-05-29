'use client'

import { create } from 'zustand'
import type { CandidateProfile } from '@/types'

interface CandidateState {
  candidate: CandidateProfile | null
  isProcessing: boolean
  error: string | null
  setCandidate: (candidate: CandidateProfile) => void
  setProcessing: (processing: boolean) => void
  setError: (error: string | null) => void
  clearCandidate: () => void
}

export const useCandidateStore = create<CandidateState>()((set) => ({
  candidate: null,
  isProcessing: false,
  error: null,
  setCandidate: (candidate) => set({ candidate, error: null }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error, isProcessing: false }),
  clearCandidate: () => set({ candidate: null, error: null, isProcessing: false }),
}))
