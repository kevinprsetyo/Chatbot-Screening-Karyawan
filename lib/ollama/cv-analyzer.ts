import { ollamaChat } from './client'
import type { CVAnalysis } from '@/types'

const CV_ANALYSIS_SYSTEM_PROMPT = `You are an expert HR analyst and technical recruiter. 
Analyze the provided CV/resume text and extract structured information.

Return ONLY a valid JSON object with NO additional text, markdown, or explanation.
The JSON must follow this exact structure:

{
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": ["skill1", "skill2", "..."],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Dec 2022",
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree and Major",
      "year": "2020"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

Rules:
- skills must be a flat array of strings (technologies, tools, languages)
- experience entries must be sorted newest first
- If information is missing, use empty arrays or empty strings
- Do NOT include any text before or after the JSON
- All textual descriptions (summary, role, description, skills, etc) MUST be in Indonesian (Bahasa Indonesia).`

export async function analyzeCV(cvText: string): Promise<CVAnalysis> {
  const response = await ollamaChat({
    messages: [
      { role: 'system', content: CV_ANALYSIS_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this CV and return structured JSON:\n\n${cvText}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 3000,
  })

  // Clean response — strip markdown code blocks if present
  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      summary: parsed.summary || '',
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      summary: 'Analisis CV selesai. Lihat teks mentah untuk detailnya.',
      skills: [],
      experience: [],
      education: [],
      projects: [],
    }
  }
}
