import { NextRequest, NextResponse } from 'next/server'
import { generateEvaluation } from '@/ai/ollama/scoring-engine'
import type { CVAnalysis, InterviewMessage } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages,
      cvAnalysis,
      position,
    }: {
      messages: InterviewMessage[]
      cvAnalysis: CVAnalysis
      position: string
    } = body

    if (!messages?.length || !cvAnalysis || !position) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    const result = await generateEvaluation(messages, cvAnalysis, position)
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error('Result generation error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
