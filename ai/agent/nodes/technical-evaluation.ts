import { PipelineState } from '../state'
import { generateTechnicalEvaluation } from '../../ollama/technical-evaluator'

export async function TechnicalEvaluationNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (state.technicalMessages.length === 0) {
    throw new Error('TechnicalEvaluationNode: No messages to evaluate')
  }

  const result = await generateTechnicalEvaluation(state.technicalMessages, state.position)

  return {
    technicalResult: result,
    phase: 'recommendation'
  }
}
