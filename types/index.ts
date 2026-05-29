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
