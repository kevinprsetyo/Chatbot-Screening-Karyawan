'use client'

import { create } from 'zustand'
import type {
  PipelinePhase,
  HRCoverage,
  HREvaluationResult,
  TechnicalCoverage,
  TechnicalEvaluationResult,
  RecommendationResult,
  InterviewMessage,
} from '@/types'

interface PipelineState {
  // Phase tracking
  currentPhase: PipelinePhase
  candidateId: string | null

  // HR Phase
  hrMessages: InterviewMessage[]
  hrCoverage: HRCoverage
  hrResult: HREvaluationResult | null
  isHRComplete: boolean
  isHRThinking: boolean

  // Decision
  proceedToTechnical: boolean

  // Technical Phase
  technicalMessages: InterviewMessage[]
  technicalCoverage: TechnicalCoverage
  technicalResult: TechnicalEvaluationResult | null
  isTechnicalComplete: boolean
  isTechnicalThinking: boolean

  // Final
  recommendation: RecommendationResult | null

  // Error
  error: string | null

  // ─── Actions ───────────────────────────────────────────────
  setPhase: (phase: PipelinePhase) => void
  setCandidateId: (id: string) => void

  // HR
  addHRMessage: (msg: InterviewMessage) => void
  setHRCoverage: (coverage: HRCoverage) => void
  setHRResult: (result: HREvaluationResult) => void
  setHRComplete: (complete: boolean) => void
  setHRThinking: (thinking: boolean) => void
  setProceedToTechnical: (proceed: boolean) => void

  // Technical
  addTechnicalMessage: (msg: InterviewMessage) => void
  setTechnicalCoverage: (coverage: TechnicalCoverage) => void
  setTechnicalResult: (result: TechnicalEvaluationResult) => void
  setTechnicalComplete: (complete: boolean) => void
  setTechnicalThinking: (thinking: boolean) => void

  // Final
  setRecommendation: (rec: RecommendationResult) => void
  setError: (err: string | null) => void

  // Reset
  resetPipeline: () => void
}

const defaultHRCoverage: HRCoverage = {
  motivation: 'unknown',
  communication: 'unknown',
  collaboration: 'unknown',
  leadership: 'unknown',
  adaptability: 'unknown',
  career_goal: 'unknown',
}

const defaultTechnicalCoverage: TechnicalCoverage = {
  technical_depth: 'unknown',
  experience_validation: 'unknown',
  problem_solving: 'unknown',
  system_understanding: 'unknown',
}

const initialState = {
  currentPhase: 'apply' as PipelinePhase,
  candidateId: null,
  hrMessages: [],
  hrCoverage: defaultHRCoverage,
  hrResult: null,
  isHRComplete: false,
  isHRThinking: false,
  proceedToTechnical: false,
  technicalMessages: [],
  technicalCoverage: defaultTechnicalCoverage,
  technicalResult: null,
  isTechnicalComplete: false,
  isTechnicalThinking: false,
  recommendation: null,
  error: null,
}

export const usePipelineStore = create<PipelineState>()((set) => ({
  ...initialState,

  setPhase: (currentPhase) => set({ currentPhase }),
  setCandidateId: (candidateId) => set({ candidateId }),

  // HR actions
  addHRMessage: (msg) =>
    set((state) => ({ hrMessages: [...state.hrMessages, msg] })),
  setHRCoverage: (hrCoverage) => set({ hrCoverage }),
  setHRResult: (hrResult) => set({ hrResult }),
  setHRComplete: (isHRComplete) => set({ isHRComplete }),
  setHRThinking: (isHRThinking) => set({ isHRThinking }),
  setProceedToTechnical: (proceedToTechnical) => set({ proceedToTechnical }),

  // Technical actions
  addTechnicalMessage: (msg) =>
    set((state) => ({ technicalMessages: [...state.technicalMessages, msg] })),
  setTechnicalCoverage: (technicalCoverage) => set({ technicalCoverage }),
  setTechnicalResult: (technicalResult) => set({ technicalResult }),
  setTechnicalComplete: (isTechnicalComplete) => set({ isTechnicalComplete }),
  setTechnicalThinking: (isTechnicalThinking) => set({ isTechnicalThinking }),

  // Final
  setRecommendation: (recommendation) => set({ recommendation }),
  setError: (error) => set({ error }),

  resetPipeline: () => set({ ...initialState }),
}))
