import { ollamaChat } from './client'
import type {
  EnhancedCVAnalysis,
  HREvaluationResult,
  TechnicalEvaluationResult,
  RecommendationResult,
  RecommendationDecision,
} from '@/types'

const RECOMMENDATION_PROMPT = `Anda adalah sistem AI Rekrutmen yang menggabungkan semua data dari proses seleksi.
Tugas Anda: menghasilkan rekomendasi AKHIR yang objektif untuk tim HR manusia.

PENTING: Anda BUKAN pengambil keputusan final. Anda hanya memberikan REKOMENDASI.
Nilai rekomendasi yang boleh dikeluarkan:
- "Proceed to Human Interview" — Kandidat layak lanjut ke wawancara dengan pewawancara manusia
- "Need Further Review" — Kandidat menunjukkan potensi tetapi ada area yang perlu diclarifikasi lebih lanjut
- "Not Recommended" — Kandidat tidak memenuhi kriteria minimum untuk posisi ini

JANGAN gunakan kata "Diterima", "Ditolak", "Accepted", "Rejected".

Kembalikan HANYA objek JSON berikut, TANPA teks lain:

{
  "overall_score": <0-100>,
  "recommendation": "<Proceed to Human Interview|Need Further Review|Not Recommended>",
  "strengths": ["kekuatan spesifik 1", "kekuatan spesifik 2", "kekuatan spesifik 3"],
  "areas_for_development": ["area pengembangan 1", "area pengembangan 2"],
  "red_flags": ["potensi masalah atau kekhawatiran jika ada, atau array kosong []"],
  "ai_notes": "Catatan observasi AI dalam 2-3 kalimat Bahasa Indonesia yang merangkum kesan keseluruhan",
  "suggested_focus_for_interviewer": ["topik yang disarankan untuk digali lebih dalam oleh pewawancara manusia 1", "topik 2"]
}

Formula overall_score:
- cv_match (20%): Skor kesesuaian CV dengan posisi
- hr_score (35%): Nilai wawancara HR
- technical_score (45%): Nilai wawancara teknis

Panduan Rekomendasi:
- overall_score >= 70: "Proceed to Human Interview"
- overall_score 50-69: "Need Further Review"
- overall_score < 50: "Not Recommended"

Semua teks harus dalam Bahasa Indonesia.`

export async function generateRecommendation(
  position: string,
  cvAnalysis: EnhancedCVAnalysis,
  hrResult: HREvaluationResult,
  technicalResult: TechnicalEvaluationResult
): Promise<RecommendationResult> {
  const overallScore = Math.round(
    cvAnalysis.match_score * 0.2 +
      hrResult.overall_hr_score * 0.35 +
      technicalResult.technical_score * 0.45
  )

  const prompt = `Posisi: ${position}

DATA KANDIDAT:
CV Match Score: ${cvAnalysis.match_score}/100
Keahlian: ${cvAnalysis.skills.slice(0, 6).join(', ')}
Kekuatan dari CV: ${cvAnalysis.strengths.join(', ')}
Keahlian yang kurang: ${cvAnalysis.missing_skills.join(', ') || 'tidak ada'}

HASIL WAWANCARA HR:
- Komunikasi: ${hrResult.communication}/100
- Motivasi: ${hrResult.motivation}/100
- Kepemimpinan: ${hrResult.leadership}/100
- Adaptabilitas: ${hrResult.adaptability}/100
- Total HR Score: ${hrResult.overall_hr_score}/100
- Catatan HR: ${hrResult.notes}

HASIL WAWANCARA TEKNIS:
- Skor Teknis: ${technicalResult.technical_score}/100
- Pemecahan Masalah: ${technicalResult.problem_solving_score}/100
- Validasi Pengalaman: ${technicalResult.experience_validation_score}/100
- Catatan Teknis: ${technicalResult.notes}

Overall Score Kalkulasi: ${overallScore}/100

Hasilkan rekomendasi JSON sekarang.`

  const response = await ollamaChat({
    messages: [
      { role: 'system', content: RECOMMENDATION_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 1500,
  })

  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const validDecisions: RecommendationDecision[] = [
    'Proceed to Human Interview',
    'Need Further Review',
    'Not Recommended',
  ]

  const fallback: RecommendationResult = {
    overall_score: overallScore,
    cv_match_score: cvAnalysis.match_score,
    hr_score: hrResult.overall_hr_score,
    technical_score: technicalResult.technical_score,
    recommendation: overallScore >= 70
      ? 'Proceed to Human Interview'
      : overallScore >= 50
      ? 'Need Further Review'
      : 'Not Recommended',
    strengths: cvAnalysis.strengths,
    areas_for_development: cvAnalysis.missing_skills,
    red_flags: [],
    ai_notes: `Kandidat mendapatkan skor keseluruhan ${overallScore}/100 berdasarkan analisis CV, wawancara HR, dan wawancara teknis.`,
    suggested_focus_for_interviewer: ['Validasi pengalaman teknis secara mendalam', 'Eksplorasi motivasi jangka panjang'],
  }

  try {
    const parsed = JSON.parse(cleaned)
    const rec = validDecisions.includes(parsed.recommendation)
      ? parsed.recommendation
      : fallback.recommendation

    return {
      overall_score: Number(parsed.overall_score) || overallScore,
      cv_match_score: cvAnalysis.match_score,
      hr_score: hrResult.overall_hr_score,
      technical_score: technicalResult.technical_score,
      recommendation: rec,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : fallback.strengths,
      areas_for_development: Array.isArray(parsed.areas_for_development)
        ? parsed.areas_for_development
        : fallback.areas_for_development,
      red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
      ai_notes: parsed.ai_notes || fallback.ai_notes,
      suggested_focus_for_interviewer: Array.isArray(parsed.suggested_focus_for_interviewer)
        ? parsed.suggested_focus_for_interviewer
        : fallback.suggested_focus_for_interviewer,
    }
  } catch {
    return fallback
  }
}
