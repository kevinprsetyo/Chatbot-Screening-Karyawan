import { Annotation } from '@langchain/langgraph'
import type { 
  InterviewMessage, 
  EnhancedCVAnalysis, 
  HRCoverage, 
  HREvaluationResult, 
  TechnicalCoverage, 
  TechnicalEvaluationResult, 
  RecommendationResult 
} from '@/types'

const defaultHRCoverage = (): HRCoverage => ({
  motivation: 'unknown',
  communication: 'unknown',
  collaboration: 'unknown',
  leadership: 'unknown',
  adaptability: 'unknown',
  career_goal: 'unknown',
})

const defaultTechnicalCoverage = (): TechnicalCoverage => ({
  technical_depth: 'unknown',
  experience_validation: 'unknown',
  problem_solving: 'unknown',
  system_understanding: 'unknown',
})

export const PipelineStateAnnotation = Annotation.Root({
  // Base Data
  candidateId: Annotation<string>({
    reducer: (curr, update) => update ?? curr,
    default: () => '',
  }),
  cvText: Annotation<string>({
    reducer: (curr, update) => update ?? curr,
    default: () => '',
  }),
  position: Annotation<string>({
    reducer: (curr, update) => update ?? curr,
    default: () => '',
  }),
  
  // Pipeline Tracker
  phase: Annotation<'cv_analysis' | 'hr_interview' | 'hr_eval' | 'decision' | 'tech_interview' | 'tech_eval' | 'recommendation' | 'finished'>({
    reducer: (curr, update) => update ?? curr,
    default: () => 'cv_analysis',
  }),

  // CV Analysis Result
  cvAnalysis: Annotation<EnhancedCVAnalysis | undefined>({
    reducer: (curr, update) => update ?? curr,
    default: () => undefined,
  }),

  // HR Phase
  hrMessages: Annotation<InterviewMessage[]>({
    reducer: (curr, update) => update,
    default: () => [],
  }),
  hrCoverage: Annotation<HRCoverage>({
    reducer: (curr, update) => update ?? curr,
    default: defaultHRCoverage,
  }),
  isHrComplete: Annotation<boolean>({
    reducer: (curr, update) => update ?? curr,
    default: () => false,
  }),
  hrResult: Annotation<HREvaluationResult | undefined>({
    reducer: (curr, update) => update ?? curr,
    default: () => undefined,
  }),
  
  // Decision Node
  proceedToTechnical: Annotation<boolean>({
    reducer: (curr, update) => update ?? curr,
    default: () => false,
  }),

  // Technical Phase
  technicalMessages: Annotation<InterviewMessage[]>({
    reducer: (curr, update) => update,
    default: () => [],
  }),
  technicalCoverage: Annotation<TechnicalCoverage>({
    reducer: (curr, update) => update ?? curr,
    default: defaultTechnicalCoverage,
  }),
  isTechnicalComplete: Annotation<boolean>({
    reducer: (curr, update) => update ?? curr,
    default: () => false,
  }),
  technicalResult: Annotation<TechnicalEvaluationResult | undefined>({
    reducer: (curr, update) => update ?? curr,
    default: () => undefined,
  }),

  // Recommendation Phase
  recommendation: Annotation<RecommendationResult | undefined>({
    reducer: (curr, update) => update ?? curr,
    default: () => undefined,
  }),
})

export type PipelineState = typeof PipelineStateAnnotation.State
