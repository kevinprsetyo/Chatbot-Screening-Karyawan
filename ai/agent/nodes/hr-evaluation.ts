import { PipelineState } from '../state'
import { generateHREvaluation } from '../../ollama/hr-evaluator'
import { HR_SCORE_THRESHOLD } from '@/types'

export async function HREvaluationNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (state.hrMessages.length === 0) {
    throw new Error('HREvaluationNode: No messages to evaluate')
  }

  const result = await generateHREvaluation(state.hrMessages, state.position)

  return {
    hrResult: result,
    phase: 'decision'
  }
}

export async function DecisionNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.hrResult) {
    throw new Error('DecisionNode: Missing hrResult')
  }

  const passed = state.hrResult.overall_hr_score >= HR_SCORE_THRESHOLD

  return {
    proceedToTechnical: passed,
    phase: passed ? 'tech_interview' : 'recommendation'
  }
}
