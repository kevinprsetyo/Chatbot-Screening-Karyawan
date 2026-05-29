import { ollamaChat } from './client'

export interface PositionProfile {
  focus_areas: string[];
  sample_questions: string[];
  estimated_duration: string;
}

const POSITION_PROFILE_SYSTEM_PROMPT = `You are an expert HR Manager and Technical Recruiter.
Generate an evaluation profile for a given job position.

Return ONLY a valid JSON object with NO additional text, markdown, or explanation.
The JSON must follow this exact structure:

{
  "focus_areas": ["skill 1", "skill 2", "skill 3", "skill 4"],
  "sample_questions": ["question 1", "question 2"],
  "estimated_duration": "5-10 Menit"
}

Rules:
- focus_areas should contain 4 to 5 key competencies, technical skills, or soft skills relevant to the role.
- sample_questions should contain exactly 2 interview questions that assess the candidate's fit for this role.
- estimated_duration should be a string indicating the interview duration (e.g. "~ 5-10 Menit" or "~ 10-15 Menit").
- All textual output MUST be in Indonesian (Bahasa Indonesia).
- Do NOT include any text before or after the JSON.`

export async function generatePositionProfile(position: string): Promise<PositionProfile> {
  const response = await ollamaChat({
    messages: [
      { role: 'system', content: POSITION_PROFILE_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate position profile for: ${position}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  })

  // Clean response — strip markdown code blocks if present
  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      focus_areas: Array.isArray(parsed.focus_areas) ? parsed.focus_areas : [],
      sample_questions: Array.isArray(parsed.sample_questions) ? parsed.sample_questions : [],
      estimated_duration: typeof parsed.estimated_duration === 'string' ? parsed.estimated_duration : '~ 5-10 Menit',
    }
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      focus_areas: ['Kompetensi Teknis', 'Pemecahan Masalah', 'Komunikasi', 'Kerja Sama'],
      sample_questions: ['Ceritakan pengalaman kerja Anda sebelumnya.', 'Apa tantangan terbesar yang pernah Anda hadapi?'],
      estimated_duration: '~ 5-10 Menit'
    }
  }
}
