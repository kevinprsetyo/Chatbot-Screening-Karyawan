import { ollamaChat } from './client'
import type { EnhancedCVAnalysis } from '@/types'

const CV_ANALYSIS_SYSTEM_PROMPT = `Anda adalah analis HR dan rekruter teknis berpengalaman.
Analisis teks CV/resume yang diberikan dan ekstrak informasi terstruktur.

Kembalikan HANYA objek JSON valid TANPA teks tambahan, markdown, atau penjelasan.
JSON harus mengikuti struktur ini:

{
  "summary": "Ringkasan profesional 2-3 kalimat tentang kandidat",
  "skills": ["keahlian1", "keahlian2", "..."],
  "experience": [
    {
      "company": "Nama Perusahaan",
      "role": "Jabatan",
      "duration": "Jan 2020 - Des 2022",
      "description": "Tanggung jawab dan pencapaian utama"
    }
  ],
  "education": [
    {
      "institution": "Nama Universitas",
      "degree": "Gelar dan Jurusan",
      "year": "2020"
    }
  ],
  "projects": [
    {
      "name": "Nama Proyek",
      "description": "Deskripsi singkat proyek",
      "technologies": ["teknologi1", "teknologi2"]
    }
  ],
  "strengths": ["kekuatan nyata 1", "kekuatan nyata 2", "kekuatan nyata 3"],
  "missing_skills": ["keahlian yang kurang atau tidak ada di CV"],
  "match_score": 75
}

Aturan:
- skills harus berupa array string datar (teknologi, alat, bahasa)
- experience diurutkan dari yang terbaru
- strengths: 3-5 kekuatan spesifik yang terlihat jelas dari CV
- missing_skills: keahlian umum untuk posisi ini yang TIDAK ditemukan di CV
- match_score: 0-100, nilai seberapa cocok CV dengan posisi yang dilamar
- Jika informasi tidak ada, gunakan array kosong atau string kosong
- JANGAN sertakan teks apapun sebelum atau sesudah JSON
- Semua deskripsi tekstual HARUS dalam Bahasa Indonesia`

export async function analyzeCV(
  cvText: string,
  position?: string
): Promise<EnhancedCVAnalysis> {
  const positionContext = position
    ? `Kandidat melamar untuk posisi: ${position}.`
    : ''

  const response = await ollamaChat({
    messages: [
      { role: 'system', content: CV_ANALYSIS_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `${positionContext}\n\nAnalisis CV ini dan kembalikan JSON terstruktur:\n\n${cvText}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 3000,
  })

  // Strip markdown code blocks if present
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
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      missing_skills: Array.isArray(parsed.missing_skills) ? parsed.missing_skills : [],
      match_score: typeof parsed.match_score === 'number' ? parsed.match_score : 50,
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      summary: 'Analisis CV selesai. Lihat teks mentah untuk detailnya.',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      strengths: [],
      missing_skills: [],
      match_score: 50,
    }
  }
}
