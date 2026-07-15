import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/ai/ollama/client'
import {
  buildHRSystemPrompt,
  isHRInterviewComplete,
  updateHRCoverage,
  calculateHRConfidence,
  defaultHRCoverage,
} from '@/ai/ollama/hr-engine'
import { smartSearch, COLLECTIONS } from '@/ai/rag/vectorstore'
import type { InterviewMessage, EnhancedCVAnalysis, HRCoverage } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages,
      cvAnalysis,
      position,
      coverage,
    }: {
      messages: InterviewMessage[]
      cvAnalysis: EnhancedCVAnalysis
      position: string
      coverage?: HRCoverage
    } = body

    if (!cvAnalysis || !position) {
      return NextResponse.json({ error: 'Missing required fields: cvAnalysis, position' }, { status: 400 })
    }

    const currentCoverage = coverage ?? defaultHRCoverage()
    const questionCount = messages.filter((m) => m.role === 'assistant').length
    const MAX_QUESTIONS = 10
    const MIN_QUESTIONS = 3

    // Retrieve HR context from RAG
    const hrContext = await smartSearch(COLLECTIONS.HR_QUESTIONS, position, 5)

    // Build system prompt
    const systemPrompt = buildHRSystemPrompt(cvAnalysis, position, hrContext, questionCount)

    // If max questions reached, force close
    const forceClose = questionCount >= MAX_QUESTIONS
    const confidence = calculateHRConfidence(currentCoverage)
    const shouldClose = forceClose || (confidence >= 0.8 && questionCount >= MIN_QUESTIONS)

    const ollamaMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ]

    if (shouldClose && questionCount >= MIN_QUESTIONS) {
      ollamaMessages.push({
        role: 'system' as const,
        content: `Kandidat sudah menjawab ${questionCount} pertanyaan dan informasi sudah cukup. Akhiri wawancara sekarang dengan mengatakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk melanjutkan proses evaluasi." Jangan tanya pertanyaan lagi.`,
      })
    }

    const response = await ollamaChat({
      messages: ollamaMessages,
      temperature: 0.7,
      max_tokens: 200,
    })

    // Update coverage based on dialogue
    const updatedCoverage = updateHRCoverage(currentCoverage, messages)
    const isComplete = isHRInterviewComplete(response) || forceClose

    return NextResponse.json({
      message: response,
      coverage: updatedCoverage,
      confidence: calculateHRConfidence(updatedCoverage),
      isComplete,
      questionCount: questionCount + 1,
    })
  } catch (error) {
    console.error('[HR Interview API]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
