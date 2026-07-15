export interface CandidateProfile {
  id: string
  fullName: string
  email: string
  phone: string
  linkedIn?: string
  github?: string
  yearsOfExperience: number
  position: string
  cvText: string
  cvAnalysis: CVAnalysis
}

export interface CVAnalysis {
  summary: string
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
}

export interface ExperienceItem {
  company: string
  role: string
  duration: string
  description: string
}

export interface EducationItem {
  institution: string
  degree: string
  year: string
}

export interface ProjectItem {
  name: string
  description: string
  technologies: string[]
}

export type QuestionCategory =
  | 'TEKNIS'
  | 'KOMUNIKASI'
  | 'PEMECAHAN_MASALAH'
  | 'KEPEMIMPINAN'
  | 'PENGALAMAN'
  | 'PENUTUP'
  | 'UMUM'

export interface InterviewMessage {
  role: 'assistant' | 'user'
  content: string
  category?: QuestionCategory
  questionNumber?: number
  timestamp: string
}

export interface EvaluationResult {
  overall_score: number
  technical_score: number
  communication_score: number
  problem_solving_score: number
  leadership_score: number
  position_match_score: number
  decision: 'ACCEPTED' | 'CONSIDERED' | 'REJECTED'
  strengths: string[]
  weaknesses: string[]
  risk_level: 'Low' | 'Medium' | 'High'
  potential_level: 'Low' | 'Medium' | 'High' | 'Exceptional'
  reasoning: string
}

export type JobPosition =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Fullstack Developer'
  | 'Mobile Developer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'Machine Learning Engineer'
  | 'DevOps Engineer'
  | 'Cyber Security Analyst'
  | 'UI UX Designer'
  | 'QA Engineer'

export const JOB_POSITIONS: JobPosition[] = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Mobile Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cyber Security Analyst',
  'UI UX Designer',
  'QA Engineer',
]

// ─────────────────────────────────────────────────────────────
// TWO-PHASE PIPELINE — New Interfaces
// ─────────────────────────────────────────────────────────────

/** Extended CV Analysis with match scoring (replaces CVAnalysis for new pipeline) */
export interface EnhancedCVAnalysis extends CVAnalysis {
  strengths: string[]
  missing_skills: string[]
  match_score: number // 0–100
}

/** Extended CandidateProfile for new pipeline */
export interface EnhancedCandidateProfile extends CandidateProfile {
  cvAnalysis: EnhancedCVAnalysis
}

// ─── HR Phase ────────────────────────────────────────────────

export type CoverageDimension = 'unknown' | 'partial' | 'complete'

export interface HRCoverage {
  motivation: CoverageDimension
  communication: CoverageDimension
  collaboration: CoverageDimension
  leadership: CoverageDimension
  adaptability: CoverageDimension
  career_goal: CoverageDimension
}

export interface HREvaluationResult {
  communication: number
  motivation: number
  leadership: number
  adaptability: number
  overall_hr_score: number
  notes: string
}

// ─── Technical Phase ──────────────────────────────────────────

export interface TechnicalCoverage {
  technical_depth: CoverageDimension
  experience_validation: CoverageDimension
  problem_solving: CoverageDimension
  system_understanding: CoverageDimension
}

export interface TechnicalEvaluationResult {
  technical_score: number
  problem_solving_score: number
  experience_validation_score: number
  notes: string
}

// ─── Final Recommendation ─────────────────────────────────────

export type RecommendationDecision =
  | 'Proceed to Human Interview'
  | 'Need Further Review'
  | 'Not Recommended'

export interface RecommendationResult {
  overall_score: number
  cv_match_score: number
  hr_score: number
  technical_score: number
  recommendation: RecommendationDecision
  strengths: string[]
  areas_for_development: string[]
  red_flags: string[]
  ai_notes: string
  suggested_focus_for_interviewer: string[]
}

// ─── Pipeline Phase Tracking ──────────────────────────────────

export type PipelinePhase =
  | 'apply'
  | 'cv_analysis'
  | 'hr_interview'
  | 'hr_evaluation'
  | 'decision'
  | 'technical_interview'
  | 'technical_evaluation'
  | 'recommendation'
  | 'complete'

export const HR_SCORE_THRESHOLD = 75
