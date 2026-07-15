import { PipelineState } from '../state'
import { analyzeCV } from '../../ollama/cv-analyzer'

export async function CVAnalyzerNode(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.cvText || !state.position) {
    throw new Error('CVAnalyzerNode: Missing cvText or position in state')
  }

  // Already analyzed?
  if (state.cvAnalysis) {
    return { phase: 'hr_interview' }
  }

  const analysis = await analyzeCV(state.cvText, state.position)
  
  return {
    cvAnalysis: analysis,
    phase: 'hr_interview'
  }
}
