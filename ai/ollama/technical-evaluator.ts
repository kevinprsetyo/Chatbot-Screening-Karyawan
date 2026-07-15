import { ollamaChat } from './client'
import type { InterviewMessage, TechnicalEvaluationResult } from '@/types'

const TECH_EVALUATION_PROMPT = `Anda adalah Tech Lead Senior yang mengevaluasi hasil wawancara teknis kandidat.
Berdasarkan transkrip wawancara teknis berikut, berikan penilaian terstruktur.

Kembalikan HANYA objek JSON valid berikut, TANPA teks tambahan:

{
  "technical_score": <0-100>,
  "problem_solving_score": <0-100>,
  "experience_validation_score": <0-100>,
  "notes": "Catatan 1-2 kalimat dalam Bahasa Indonesia tentang kompetensi teknis kandidat"
}

Panduan Penilaian:
- technical_score (0-100): Kedalaman pengetahuan teknis yang relevan dengan posisi
- problem_solving_score (0-100): Kemampuan mendekati dan menyelesaikan masalah teknis
- experience_validation_score (0-100): Seberapa valid dan konsisten pengalaman di CV dengan apa yang diceritakan
- notes: Observasi kritis tentang kemampuan teknis, potensi, atau area yang perlu dikembangkan

Catatan: Nilai HANYA berdasarkan apa yang didemonstrasikan dalam wawancara. Jangan beri nilai atas klaim yang tidak dibuktikan.`

export async function generateTechnicalEvaluation(
  messages: InterviewMessage[],
  position: string
): Promise<TechnicalEvaluationResult> {
  const transcript = messages
    .map((m) => `${m.role === 'assistant' ? 'TECH LEAD' : 'KANDIDAT'}: ${m.content}`)
    .join('\n\n')

  const response = await ollamaChat({
    messages: [
      { role: 'system', content: TECH_EVALUATION_PROMPT },
      {
        role: 'user',
        content: `Posisi: ${position}\n\nTranskrip Wawancara Teknis:\n${transcript}\n\nBerikan evaluasi JSON sekarang.`,
      },
    ],
    temperature: 0.1,
    max_tokens: 600,
  })

  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      technical_score: Number(parsed.technical_score) || 50,
      problem_solving_score: Number(parsed.problem_solving_score) || 50,
      experience_validation_score: Number(parsed.experience_validation_score) || 50,
      notes: parsed.notes || 'Evaluasi teknis berdasarkan transkrip wawancara.',
    }
  } catch {
    return {
      technical_score: 50,
      problem_solving_score: 50,
      experience_validation_score: 50,
      notes: 'Evaluasi teknis tidak dapat diselesaikan. Memerlukan peninjauan manual.',
    }
  }
}
