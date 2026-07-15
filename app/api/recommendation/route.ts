import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendation } from '@/ai/ollama/recommendation'
import type { EnhancedCVAnalysis, HREvaluationResult, TechnicalEvaluationResult } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      position,
      cvAnalysis,
      hrResult,
      technicalResult,
    }: {
      position: string
      cvAnalysis: EnhancedCVAnalysis
      hrResult: HREvaluationResult
      technicalResult: TechnicalEvaluationResult
    } = body

    if (!position || !cvAnalysis || !hrResult || !technicalResult) {
      return NextResponse.json(
        { error: 'Missing required fields: position, cvAnalysis, hrResult, technicalResult' },
        { status: 400 }
      )
    }

    const recommendation = await generateRecommendation(
      position,
      cvAnalysis,
      hrResult,
      technicalResult
    )

    return NextResponse.json({ recommendation }, { status: 200 })
  } catch (error) {
    console.error('[Recommendation API]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
