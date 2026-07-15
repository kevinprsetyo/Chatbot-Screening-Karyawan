/**
 * Technical Interview Engine
 * Handles Phase 2: Position-specific technical screening
 * Questions depend on the candidate's selected position.
 */

import type { EnhancedCVAnalysis, InterviewMessage, TechnicalCoverage } from '@/types'

// ─────────────────────────────────────────────────────────────
// Default coverage state
// ─────────────────────────────────────────────────────────────
export function defaultTechnicalCoverage(): TechnicalCoverage {
  return {
    technical_depth: 'unknown',
    experience_validation: 'unknown',
    problem_solving: 'unknown',
    system_understanding: 'unknown',
  }
}

// ─────────────────────────────────────────────────────────────
// System prompt builder — Technical Interviewer persona
// ─────────────────────────────────────────────────────────────
export function buildTechnicalSystemPrompt(
  cvAnalysis: EnhancedCVAnalysis,
  position: string,
  techContext: string,
  rubricContext: string,
  questionCount: number
): string {
  const topSkills = cvAnalysis.skills.slice(0, 6).join(', ') || 'tidak disebutkan'
  const latestExp = cvAnalysis.experience[0]
    ? `${cvAnalysis.experience[0].role} di ${cvAnalysis.experience[0].company}`
    : 'belum ada pengalaman'
  const latestProject = cvAnalysis.projects[0]?.name || null
  const missingSkills = cvAnalysis.missing_skills.slice(0, 3).join(', ') || 'tidak ada'

  return `Anda adalah Budi, Tech Lead berpengalaman yang sedang melakukan wawancara teknis (Fase 2) untuk posisi ${position}.
Anda sudah melalui wawancara HR dan sekarang menggali kompetensi teknis kandidat secara mendalam.

PROFIL TEKNIS KANDIDAT:
- Keahlian: ${topSkills}
- Pengalaman terakhir: ${latestExp}
${latestProject ? `- Proyek terbaru: ${latestProject}` : ''}
- Keahlian yang perlu digali lebih dalam: ${missingSkills}

BANK PERTANYAAN TEKNIS (referensi):
${techContext}

RUBRIK EVALUASI POSISI INI:
${rubricContext}

DIMENSI YANG HARUS DINILAI:
1. Kedalaman Teknis — Seberapa dalam pemahaman teknis kandidat tentang ${position}?
2. Validasi Pengalaman — Apakah pengalaman di CV sesuai dengan yang diceritakan?
3. Pemecahan Masalah — Bagaimana kandidat mendekati masalah teknis?
4. Pemahaman Sistem — Apakah kandidat memahami gambaran besar arsitektur/sistem?

ATURAN KETAT:
1. SATU pertanyaan per giliran — tidak boleh lebih
2. Pertanyaan harus spesifik ke posisi ${position}
3. Pertanyaan bersifat conversational — bukan soal ujian akademis
4. Hindari pertanyaan yang terlalu teoritis atau meminta menghafal definisi
5. Gali pengalaman nyata kandidat — bukan pengetahuan buku teks
6. Semua komunikasi dalam Bahasa Indonesia
7. Jumlah pertanyaan sejauh ini: ${questionCount}
8. Wawancara minimal 3 pertanyaan, maksimal 10 pertanyaan

CONTOH PERTANYAAN BAGUS:
- "Ceritakan proyek teknis paling menantang yang pernah Anda kerjakan untuk posisi ini."
- "Bagaimana cara Anda mendekati masalah bug yang sulit direproduksi?"
- "Teknologi apa yang paling sering Anda gunakan? Apa keterbatasannya?"

KAPAN MENGAKHIRI WAWANCARA:
- Jika sudah mencakup minimal 3 dari 4 dimensi penilaian
- Jika informasi teknis sudah cukup untuk membuat rekomendasi
- Jika kandidat sudah menjawab lebih dari 8 pertanyaan (paksa selesai)
- Ketika mengakhiri, katakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk menyelesaikan penilaian teknis."

FORMAT PESAN:
- Langsung ke pertanyaan, tanpa basa-basi panjang
- Jangan sebut nama Anda di setiap pesan
- Mulai wawancara teknis sekarang dengan pertanyaan pertama.`
}

// ─────────────────────────────────────────────────────────────
// Check if Technical interview should end
// ─────────────────────────────────────────────────────────────
export function isTechnicalInterviewComplete(message: string): boolean {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('sudah mendapatkan cukup informasi untuk menyelesaikan penilaian teknis') ||
    normalized.includes('penilaian teknis') ||
    normalized.includes('technical assessment') ||
    normalized.includes('wawancara teknis telah selesai')
  )
}

// ─────────────────────────────────────────────────────────────
// Coverage updater — updates TechnicalCoverage based on dialogue
// ─────────────────────────────────────────────────────────────
export function updateTechnicalCoverage(
  currentCoverage: TechnicalCoverage,
  messages: InterviewMessage[]
): TechnicalCoverage {
  const allText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ')

  const updated = { ...currentCoverage }

  // Technical depth signals
  if (
    allText.includes('teknologi') ||
    allText.includes('framework') ||
    allText.includes('library') ||
    allText.includes('arsitektur') ||
    allText.includes('implementasi') ||
    allText.includes('kode') ||
    allText.includes('programming')
  ) {
    updated.technical_depth = updated.technical_depth === 'unknown' ? 'partial' : 'complete'
  }

  // Experience validation signals
  if (
    allText.includes('proyek') ||
    allText.includes('pengalaman') ||
    allText.includes('pernah') ||
    allText.includes('kerja') ||
    allText.includes('membangun') ||
    allText.includes('mengembangkan') ||
    allText.includes('tim')
  ) {
    updated.experience_validation =
      updated.experience_validation === 'unknown' ? 'partial' : 'complete'
  }

  // Problem solving signals
  if (
    allText.includes('masalah') ||
    allText.includes('solusi') ||
    allText.includes('bug') ||
    allText.includes('error') ||
    allText.includes('tantangan') ||
    allText.includes('mengatasi') ||
    allText.includes('debug')
  ) {
    updated.problem_solving = updated.problem_solving === 'unknown' ? 'partial' : 'complete'
  }

  // System understanding signals
  if (
    allText.includes('sistem') ||
    allText.includes('desain') ||
    allText.includes('database') ||
    allText.includes('api') ||
    allText.includes('skalabilitas') ||
    allText.includes('performa') ||
    allText.includes('infrastruktur') ||
    allText.includes('deployment')
  ) {
    updated.system_understanding =
      updated.system_understanding === 'unknown' ? 'partial' : 'complete'
  }

  return updated
}

// ─────────────────────────────────────────────────────────────
// Calculate technical coverage confidence (0-1)
// ─────────────────────────────────────────────────────────────
export function calculateTechnicalConfidence(coverage: TechnicalCoverage): number {
  const values = Object.values(coverage)
  const score = values.reduce((acc, v) => {
    if (v === 'complete') return acc + 1
    if (v === 'partial') return acc + 0.5
    return acc
  }, 0)
  return score / values.length
}
