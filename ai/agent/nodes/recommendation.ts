import { PipelineState } from '../state'
import { generateRecommendation } from '../../ollama/recommendation'

export async function RecommendationNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.cvAnalysis || !state.hrResult) {
    throw new Error('RecommendationNode: Missing cvAnalysis or hrResult')
  }

  // If technical was skipped, create a zero fallback technical result
  const techResult = state.technicalResult ?? {
    technical_score: 0,
    problem_solving_score: 0,
    experience_validation_score: 0,
    notes: 'Wawancara teknis tidak dilakukan karena skor HR di bawah threshold.'
  }

  const recommendation = await generateRecommendation(
    state.position,
    state.cvAnalysis,
    state.hrResult,
    techResult
  )

  return {
    recommendation,
    phase: 'finished'
  }
}
