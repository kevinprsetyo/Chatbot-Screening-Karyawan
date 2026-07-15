import { StateGraph } from '@langchain/langgraph'
import { PipelineStateAnnotation, PipelineState } from './state'
import { CVAnalyzerNode } from './nodes/cv-analyzer'
import { HRInterviewNode, CoverageCheckNode } from './nodes/hr-interview'
import { HREvaluationNode, DecisionNode } from './nodes/hr-evaluation'
import { TechnicalInterviewNode, TechnicalCoverageCheckNode } from './nodes/technical-interview'
import { TechnicalEvaluationNode } from './nodes/technical-evaluation'
import { RecommendationNode } from './nodes/recommendation'

const workflow = new StateGraph(PipelineStateAnnotation)
  // Register Nodes
  .addNode('CVAnalyzerNode', CVAnalyzerNode)
  .addNode('HRInterviewNode', HRInterviewNode)
  .addNode('CoverageCheckNode', CoverageCheckNode)
  .addNode('HREvaluationNode', HREvaluationNode)
  .addNode('DecisionNode', DecisionNode)
  .addNode('TechnicalInterviewNode', TechnicalInterviewNode)
  .addNode('TechnicalCoverageCheckNode', TechnicalCoverageCheckNode)
  .addNode('TechnicalEvaluationNode', TechnicalEvaluationNode)
  .addNode('RecommendationNode', RecommendationNode)

  // Edge from START based on current phase
  .addConditionalEdges(
    '__start__',
    (state: PipelineState) => state.phase,
    {
      cv_analysis: 'CVAnalyzerNode',
      hr_interview: 'HRInterviewNode',
      hr_eval: 'HREvaluationNode',
      decision: 'DecisionNode',
      tech_interview: 'TechnicalInterviewNode',
      tech_eval: 'TechnicalEvaluationNode',
      recommendation: 'RecommendationNode',
      finished: '__end__'
    }
  )

  // Phase 1: HR Interview
  .addEdge('CVAnalyzerNode', 'HRInterviewNode')
  .addEdge('HRInterviewNode', 'CoverageCheckNode')
  
  // Conditional routing after HR Coverage Check
  .addConditionalEdges(
    'CoverageCheckNode',
    (state: PipelineState) => state.isHrComplete ? 'evaluate' : 'continue_hr',
    {
      evaluate: 'HREvaluationNode',
      continue_hr: '__end__' // End graph run so UI can render assistant message and wait for user input
    }
  )

  .addEdge('HREvaluationNode', 'DecisionNode')

  // Decision Routing
  .addConditionalEdges(
    'DecisionNode',
    (state: PipelineState) => state.proceedToTechnical ? 'tech_phase' : 'skip_to_rec',
    {
      tech_phase: 'TechnicalInterviewNode',
      skip_to_rec: 'RecommendationNode'
    }
  )

  // Phase 2: Technical Interview
  .addEdge('TechnicalInterviewNode', 'TechnicalCoverageCheckNode')

  // Conditional routing after Technical Coverage Check
  .addConditionalEdges(
    'TechnicalCoverageCheckNode',
    (state: PipelineState) => state.isTechnicalComplete ? 'evaluate_tech' : 'continue_tech',
    {
      evaluate_tech: 'TechnicalEvaluationNode',
      continue_tech: '__end__' // Pause for user input
    }
  )

  .addEdge('TechnicalEvaluationNode', 'RecommendationNode')

  // Final End
  .addEdge('RecommendationNode', '__end__')

export const pipelineGraph = workflow.compile()
