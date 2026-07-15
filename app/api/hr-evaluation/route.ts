import { NextRequest, NextResponse } from 'next/server'
import { generateHREvaluation } from '@/ai/ollama/hr-evaluator'
import type { InterviewMessage } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, position }: { messages: InterviewMessage[]; position: string } = body

    if (!messages?.length || !position) {
      return NextResponse.json({ error: 'Missing messages or position' }, { status: 400 })
    }

    const result = await generateHREvaluation(messages, position)
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error('[HR Evaluation API]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
