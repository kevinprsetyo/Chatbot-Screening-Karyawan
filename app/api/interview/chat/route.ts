import { NextRequest, NextResponse } from 'next/server'
import {
  buildInterviewSystemPrompt,
  buildContinueInterviewPrompt,
  isInterviewComplete,
} from '@/ai/ollama/interview-engine'
import { ollamaChatStream } from '@/ai/ollama/client'
import type { CVAnalysis, InterviewMessage } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      messages,
      cvAnalysis,
      position,
      questionCount,
    }: {
      messages: InterviewMessage[]
      cvAnalysis: CVAnalysis
      position: string
      questionCount: number
    } = body

    if (!cvAnalysis || !position) {
      return NextResponse.json({ error: 'Missing required context' }, { status: 400 })
    }

    const MAX_QUESTIONS = 10

    // Build the message array for Ollama
    const ollamaMessages = [
      {
        role: 'system' as const,
        content: buildInterviewSystemPrompt(cvAnalysis, position, questionCount),
      },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // If we've hit max questions, instruct to close the interview
    if (questionCount >= MAX_QUESTIONS) {
      ollamaMessages.push({
        role: 'system' as const,
        content: buildContinueInterviewPrompt('', questionCount, MAX_QUESTIONS),
      })
    }

    // Stream response from Ollama — low token limit enforces concise recruiter-style questions
    const stream = await ollamaChatStream({
      messages: ollamaMessages,
      temperature: 0.7,
      max_tokens: 200,
    })

    // We need to detect interview completion from the streamed content
    // Pipe through a transform that checks for the completion phrase
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let fullContent = ''

    const transformStream = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true })
        fullContent += text
        controller.enqueue(chunk)
      },
      flush(controller) {
        // Append a metadata chunk indicating completion status
        const complete = isInterviewComplete(fullContent)
        const meta = JSON.stringify({ __meta: { isComplete: complete } })
        controller.enqueue(encoder.encode('\n' + meta))
      },
    })

    const outputStream = stream.pipeThrough(transformStream)

    return new Response(outputStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Interview chat error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
