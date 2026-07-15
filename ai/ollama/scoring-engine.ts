import { ollamaChat } from './client'
import type { CVAnalysis, EvaluationResult, InterviewMessage } from '@/types'

const SCORING_SYSTEM_PROMPT = `You are a Senior HR Evaluation Specialist. 
Analyze the complete interview transcript and CV to produce a structured hiring assessment.

Return ONLY a valid JSON object with NO additional text, markdown, or explanation.

JSON structure:
{
  "overall_score": <0-100>,
  "technical_score": <0-100>,
  "communication_score": <0-100>,
  "problem_solving_score": <0-100>,
  "leadership_score": <0-100>,
  "position_match_score": <0-100>,
  "decision": "<ACCEPTED|CONSIDERED|REJECTED>",
  "strengths": ["specific strength 1", "specific strength 2", "..."],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "..."],
  "risk_level": "<Low|Medium|High>",
  "potential_level": "<Low|Medium|High|Exceptional>",
  "reasoning": "2-3 paragraph detailed reasoning for the hiring decision"
}

Scoring rubric:
- 85-100: Exceptional, strong hire
- 70-84: Good candidate, recommended
- 55-69: Average, needs consideration
- 40-54: Below average, significant gaps
- 0-39: Poor fit, not recommended

Decision rules:
- ACCEPTED: overall_score >= 65 AND technical_score >= 60
- CONSIDERED: overall_score >= 45 OR (technical_score >= 50 AND strong potential)
- REJECTED: overall_score < 45 AND technical_score < 50

Risk level:
- Low: Consistent answers, specific examples, verifiable claims
- Medium: Some vague answers, mixed evidence quality
- High: Mostly vague, unsubstantiated claims, red flags

Be objective and evidence-based. Score ONLY what was demonstrated in the interview.
Do NOT give credit for claims not substantiated during the interview.
- All textual descriptions (strengths, weaknesses, reasoning) MUST be written in Indonesian (Bahasa Indonesia).`

export async function generateEvaluation(
  messages: InterviewMessage[],
  cvAnalysis: CVAnalysis,
  position: string
): Promise<EvaluationResult> {
  const transcript = messages
    .map((m) => `${m.role === 'assistant' ? 'INTERVIEWER' : 'CANDIDATE'}: ${m.content}`)
    .join('\n\n')

  const userPrompt = `
POSITION: ${position}

CV ANALYSIS:
${JSON.stringify(cvAnalysis, null, 2)}

INTERVIEW TRANSCRIPT:
${transcript}

Evaluate this candidate and return the JSON assessment.`

  const response = await ollamaChat({
    messages: [
      { role: 'system', content: SCORING_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  })

  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      overall_score: Number(parsed.overall_score) || 50,
      technical_score: Number(parsed.technical_score) || 50,
      communication_score: Number(parsed.communication_score) || 50,
      problem_solving_score: Number(parsed.problem_solving_score) || 50,
      leadership_score: Number(parsed.leadership_score) || 50,
      position_match_score: Number(parsed.position_match_score) || 50,
      decision: ['ACCEPTED', 'CONSIDERED', 'REJECTED'].includes(parsed.decision)
        ? parsed.decision
        : 'CONSIDERED',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      risk_level: ['Low', 'Medium', 'High'].includes(parsed.risk_level)
        ? parsed.risk_level
        : 'Medium',
      potential_level: ['Low', 'Medium', 'High', 'Exceptional'].includes(parsed.potential_level)
        ? parsed.potential_level
        : 'Medium',
      reasoning: parsed.reasoning || 'Evaluasi berdasarkan kinerja wawancara.',
    }
  } catch {
    // Fallback result
    return {
      overall_score: 50,
      technical_score: 50,
      communication_score: 50,
      problem_solving_score: 50,
      leadership_score: 50,
      position_match_score: 50,
      decision: 'CONSIDERED',
      strengths: ['Menyelesaikan proses wawancara'],
      weaknesses: ['Tidak dapat mengevaluasi sepenuhnya dari data yang tersedia'],
      risk_level: 'Medium',
      potential_level: 'Medium',
      reasoning: 'Evaluasi tidak dapat diselesaikan sepenuhnya. Direkomendasikan peninjauan manual.',
    }
  }
}
