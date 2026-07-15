import { NextRequest, NextResponse } from 'next/server'
import { pipelineGraph } from '@/ai/agent/graph'
import { PipelineState } from '@/ai/agent/state'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const state: PipelineState = await request.json()

    if (!state.candidateId) {
      return NextResponse.json({ error: 'Missing candidateId in state' }, { status: 400 })
    }

    // Invoke the LangGraph pipeline
    const finalState = await pipelineGraph.invoke(state)

    return NextResponse.json({ state: finalState }, { status: 200 })
  } catch (error) {
    console.error('[Pipeline API Error]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
