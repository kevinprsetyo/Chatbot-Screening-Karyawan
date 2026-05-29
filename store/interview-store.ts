'use client'

import { create } from 'zustand'
import type { InterviewMessage, EvaluationResult } from '@/types'

interface InterviewState {
  messages: InterviewMessage[]
  questionCount: number
  isComplete: boolean
  isThinking: boolean
  result: EvaluationResult | null
  error: string | null
  addMessage: (message: InterviewMessage) => void
  incrementQuestionCount: () => void
  setComplete: (complete: boolean) => void
  setThinking: (thinking: boolean) => void
  setResult: (result: EvaluationResult) => void
  setError: (error: string | null) => void
  resetInterview: () => void
}

export const useInterviewStore = create<InterviewState>()((set) => ({
  messages: [],
  questionCount: 0,
  isComplete: false,
  isThinking: false,
  result: null,
  error: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  incrementQuestionCount: () =>
    set((state) => ({ questionCount: state.questionCount + 1 })),
  setComplete: (isComplete) => set({ isComplete }),
  setThinking: (isThinking) => set({ isThinking }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  resetInterview: () =>
    set({
      messages: [],
      questionCount: 0,
      isComplete: false,
      isThinking: false,
      result: null,
      error: null,
    }),
}))
