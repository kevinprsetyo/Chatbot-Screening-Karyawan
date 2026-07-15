import { PipelineState } from '../state'
import { ollamaChat } from '../../ollama/client'
import { smartSearch, COLLECTIONS } from '../../rag/vectorstore'
import {
  buildTechnicalSystemPrompt,
  updateTechnicalCoverage,
  calculateTechnicalConfidence,
  isTechnicalInterviewComplete
} from '../../ollama/technical-engine'

export async function TechnicalInterviewNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.cvAnalysis) throw new Error('No CV analysis found')

  const questionCount = state.technicalMessages.filter(m => m.role === 'assistant').length
  const MAX_QUESTIONS = 10
  const MIN_QUESTIONS = 3

  const [techContext, rubricContext] = await Promise.all([
    smartSearch(COLLECTIONS.TECH_QUESTIONS, state.position, 5, { role: state.position }),
    smartSearch(COLLECTIONS.RUBRICS, state.position, 2, { role: state.position }),
  ])

  const systemPrompt = buildTechnicalSystemPrompt(
    state.cvAnalysis,
    state.position,
    techContext,
    rubricContext,
    questionCount
  )

  const forceClose = questionCount >= MAX_QUESTIONS
  const confidence = calculateTechnicalConfidence(state.technicalCoverage)
  const shouldClose = forceClose || (confidence >= 0.9 && questionCount >= MIN_QUESTIONS)

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...state.technicalMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  ]

  if (shouldClose && questionCount >= MIN_QUESTIONS) {
    messages.push({
      role: 'system' as const,
      content: `Kandidat sudah menjawab ${questionCount} pertanyaan dan informasi teknis sudah cukup. Akhiri wawancara sekarang dengan mengatakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk menyelesaikan penilaian teknis." Jangan tanya pertanyaan lagi.`
    })
  }

  const response = await ollamaChat({
    messages,
    temperature: 0.7,
    max_tokens: 250,
  })

  const isComplete = isTechnicalInterviewComplete(response) || forceClose

  return {
    technicalMessages: [...state.technicalMessages, { role: 'assistant', content: response, timestamp: new Date().toISOString() }],
    isTechnicalComplete: isComplete,
    phase: isComplete ? 'tech_eval' : 'tech_interview'
  }
}

export async function TechnicalCoverageCheckNode(state: PipelineState): Promise<Partial<PipelineState>> {
  const newCoverage = updateTechnicalCoverage(state.technicalCoverage, state.technicalMessages)
  return {
    technicalCoverage: newCoverage
  }
}
