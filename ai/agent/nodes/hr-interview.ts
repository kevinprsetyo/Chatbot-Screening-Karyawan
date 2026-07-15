import { PipelineState } from '../state'
import { ollamaChat } from '../../ollama/client'
import { smartSearch, COLLECTIONS } from '../../rag/vectorstore'
import {
  buildHRSystemPrompt,
  updateHRCoverage,
  calculateHRConfidence,
  isHRInterviewComplete
} from '../../ollama/hr-engine'

export async function HRInterviewNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.cvAnalysis) throw new Error('No CV analysis found')

  const questionCount = state.hrMessages.filter(m => m.role === 'assistant').length
  const MAX_QUESTIONS = 10
  const MIN_QUESTIONS = 3

  // Retrieve context from HR Question Bank
  const hrContext = await smartSearch(COLLECTIONS.HR_QUESTIONS, 'soft skills questions', 5)

  // System Prompt
  const systemPrompt = buildHRSystemPrompt(
    state.cvAnalysis,
    hrContext,
    questionCount
  )

  const forceClose = questionCount >= MAX_QUESTIONS
  const confidence = calculateHRConfidence(state.hrCoverage)
  const shouldClose = forceClose || (confidence >= 0.9 && questionCount >= MIN_QUESTIONS)

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...state.hrMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  ]

  if (shouldClose && questionCount >= MIN_QUESTIONS) {
    messages.push({
      role: 'system' as const,
      content: `Kandidat sudah menjawab ${questionCount} pertanyaan dan informasi dirasa cukup. Akhiri wawancara sekarang dengan mengatakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk melanjutkan proses evaluasi." Jangan tanya pertanyaan lagi.`
    })
  }

  const response = await ollamaChat({
    messages,
    temperature: 0.7,
    max_tokens: 250,
  })

  // Check if AI explicitly closed it
  const isComplete = isHRInterviewComplete(response) || forceClose

  return {
    hrMessages: [...state.hrMessages, { role: 'assistant', content: response, timestamp: new Date().toISOString() }],
    isHrComplete: isComplete,
    phase: isComplete ? 'hr_eval' : 'hr_interview'
  }
}

export async function CoverageCheckNode(state: PipelineState): Promise<Partial<PipelineState>> {
  // Update coverage based on the latest messages
  const newCoverage = updateHRCoverage(state.hrCoverage, state.hrMessages)
  return {
    hrCoverage: newCoverage
  }
}
