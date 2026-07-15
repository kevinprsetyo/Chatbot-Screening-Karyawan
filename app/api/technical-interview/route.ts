import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/ai/ollama/client'
import {
  buildTechnicalSystemPrompt,
  isTechnicalInterviewComplete,
  updateTechnicalCoverage,
  calculateTechnicalConfidence,
  defaultTechnicalCoverage,
} from '@/ai/ollama/technical-engine'
import { smartSearch, COLLECTIONS } from '@/ai/rag/vectorstore'
import type { InterviewMessage, EnhancedCVAnalysis, TechnicalCoverage } from '@/types'

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
      coverage?: TechnicalCoverage
    } = body

    if (!cvAnalysis || !position) {
      return NextResponse.json({ error: 'Missing required fields: cvAnalysis, position' }, { status: 400 })
    }

    const currentCoverage = coverage ?? defaultTechnicalCoverage()
    const questionCount = messages.filter((m) => m.role === 'assistant').length
    const MAX_QUESTIONS = 10
    const MIN_QUESTIONS = 3

    // Retrieve context from RAG
    const [techContext, rubricContext] = await Promise.all([
      smartSearch(COLLECTIONS.TECH_QUESTIONS, position, 5, { role: position }),
      smartSearch(COLLECTIONS.RUBRICS, position, 2, { role: position }),
    ])

    const systemPrompt = buildTechnicalSystemPrompt(
      cvAnalysis,
      position,
      techContext,
      rubricContext,
      questionCount
    )

    const forceClose = questionCount >= MAX_QUESTIONS
    const confidence = calculateTechnicalConfidence(currentCoverage)
    const shouldClose = forceClose || (confidence >= 0.8 && questionCount >= MIN_QUESTIONS)

    const ollamaMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ]

    if (shouldClose && questionCount >= MIN_QUESTIONS) {
      ollamaMessages.push({
        role: 'system' as const,
        content: `Kandidat sudah menjawab ${questionCount} pertanyaan dan informasi teknis sudah cukup. Akhiri wawancara sekarang dengan mengatakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk menyelesaikan penilaian teknis." Jangan tanya pertanyaan lagi.`,
      })
    }

    const response = await ollamaChat({
      messages: ollamaMessages,
      temperature: 0.7,
      max_tokens: 250,
    })

    const updatedCoverage = updateTechnicalCoverage(currentCoverage, messages)
    const isComplete = isTechnicalInterviewComplete(response) || forceClose

    return NextResponse.json({
      message: response,
      coverage: updatedCoverage,
      confidence: calculateTechnicalConfidence(updatedCoverage),
      isComplete,
      questionCount: questionCount + 1,
    })
  } catch (error) {
    console.error('[Technical Interview API]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
