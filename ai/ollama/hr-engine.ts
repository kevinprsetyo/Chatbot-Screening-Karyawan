/**
 * HR Interview Engine
 * Handles Phase 1: General HR screening
 * Topics: Motivation, Communication, Collaboration, Leadership, Adaptability, Career Goal
 * NO technical questions allowed.
 */

import type { EnhancedCVAnalysis, InterviewMessage, HRCoverage } from '@/types'

// ─────────────────────────────────────────────────────────────
// Default coverage state
// ─────────────────────────────────────────────────────────────
export function defaultHRCoverage(): HRCoverage {
  return {
    motivation: 'unknown',
    communication: 'unknown',
    collaboration: 'unknown',
    leadership: 'unknown',
    adaptability: 'unknown',
    career_goal: 'unknown',
  }
}

// ─────────────────────────────────────────────────────────────
// System prompt builder — HR Interviewer persona
// ─────────────────────────────────────────────────────────────
export function buildHRSystemPrompt(
  cvAnalysis: EnhancedCVAnalysis,
  position: string,
  hrContext: string,
  questionCount: number
): string {
  const topSkills = cvAnalysis.skills.slice(0, 4).join(', ') || 'tidak disebutkan'
  const latestExp = cvAnalysis.experience[0]
    ? `${cvAnalysis.experience[0].role} di ${cvAnalysis.experience[0].company}`
    : 'belum ada pengalaman yang tercantum'

  return `Anda adalah Sari, HR Recruiter profesional dan hangat di perusahaan teknologi terkemuka.
Anda sedang melakukan wawancara HR awal (Fase 1) untuk posisi ${position}.

PROFIL KANDIDAT:
- Keahlian utama: ${topSkills}
- Pengalaman terakhir: ${latestExp}
- Kekuatan: ${cvAnalysis.strengths.slice(0, 3).join(', ') || 'belum terpetakan'}

PANDUAN PERTANYAAN HR (referensi):
${hrContext}

TOPIK YANG HARUS DIGALI (pilih yang relevan, jangan kaku):
1. Motivasi — Mengapa melamar posisi ini? Apa tujuan kariernya?
2. Komunikasi — Bagaimana cara menyampaikan ide atau update kepada tim?
3. Kolaborasi — Bagaimana bekerja dalam tim yang beragam?
4. Kepemimpinan — Pengalaman memimpin atau mengambil inisiatif?
5. Adaptabilitas — Bagaimana merespons perubahan atau tekanan?
6. Tujuan Karier — Visi dan aspirasi profesional jangka panjang?

ATURAN KETAT:
1. SATU pertanyaan per giliran — tidak boleh lebih
2. Maksimal 25 kata per pertanyaan
3. DILARANG pertanyaan teknis (kode, framework, algoritma, sistem)
4. DILARANG kata-kata formal seperti "Jelaskan secara rinci" atau "Berikan contoh konkret tentang"
5. Pertanyaan harus natural, hangat, dan conversational
6. Semua komunikasi dalam Bahasa Indonesia
7. Jumlah pertanyaan sejauh ini: ${questionCount}
8. Wawancara minimal 3 pertanyaan, maksimal 10 pertanyaan

KAPAN MENGAKHIRI WAWANCARA:
- Jika sudah mencakup setidaknya 4 dari 6 topik di atas, DAN sudah lebih dari 3 pertanyaan
- Jika informasi sudah terasa cukup untuk membuat penilaian awal
- Jika kandidat sudah menjawab lebih dari 8 pertanyaan (paksa selesai)
- Ketika mengakhiri, katakan TEPAT: "Terima kasih. Saya sudah mendapatkan cukup informasi untuk melanjutkan proses evaluasi."

FORMAT PESAN:
- Langsung ke pertanyaan, tanpa basa-basi
- Jangan menilai atau mengomentari jawaban kandidat
- Jangan sebut nama Anda di setiap pesan
- Mulai wawancara sekarang dengan pertanyaan pertama.`
}

// ─────────────────────────────────────────────────────────────
// Check if HR interview should end
// ─────────────────────────────────────────────────────────────
export function isHRInterviewComplete(message: string): boolean {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('sudah mendapatkan cukup informasi') ||
    normalized.includes('melanjutkan proses evaluasi') ||
    normalized.includes('wawancara hr telah selesai') ||
    normalized.includes('i have enough information')
  )
}

// ─────────────────────────────────────────────────────────────
// Coverage updater — called after each answer
// Uses simple keyword detection to update coverage dimensions
// ─────────────────────────────────────────────────────────────
export function updateHRCoverage(
  currentCoverage: HRCoverage,
  messages: InterviewMessage[]
): HRCoverage {
  const allText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content.toLowerCase())
    .join(' ')

  const updated = { ...currentCoverage }

  // Motivation signals
  if (
    allText.includes('motivasi') ||
    allText.includes('alasan') ||
    allText.includes('tertarik') ||
    allText.includes('melamar') ||
    allText.includes('tujuan karier') ||
    allText.includes('ingin')
  ) {
    updated.motivation = updated.motivation === 'unknown' ? 'partial' : 'complete'
  }

  // Communication signals
  if (
    allText.includes('komunikasi') ||
    allText.includes('menyampaikan') ||
    allText.includes('presentasi') ||
    allText.includes('menjelaskan') ||
    allText.includes('diskusi') ||
    allText.includes('tim')
  ) {
    updated.communication = updated.communication === 'unknown' ? 'partial' : 'complete'
  }

  // Collaboration signals
  if (
    allText.includes('kolaborasi') ||
    allText.includes('kerja sama') ||
    allText.includes('kerjasama') ||
    allText.includes('bersama') ||
    allText.includes('rekan') ||
    allText.includes('konflik') ||
    allText.includes('departemen')
  ) {
    updated.collaboration = updated.collaboration === 'unknown' ? 'partial' : 'complete'
  }

  // Leadership signals
  if (
    allText.includes('pimpin') ||
    allText.includes('memimpin') ||
    allText.includes('kepemimpinan') ||
    allText.includes('inisiatif') ||
    allText.includes('keputusan') ||
    allText.includes('tanggung jawab')
  ) {
    updated.leadership = updated.leadership === 'unknown' ? 'partial' : 'complete'
  }

  // Adaptability signals
  if (
    allText.includes('adaptasi') ||
    allText.includes('perubahan') ||
    allText.includes('belajar') ||
    allText.includes('tekanan') ||
    allText.includes('deadline') ||
    allText.includes('cepat') ||
    allText.includes('fleksibel')
  ) {
    updated.adaptability = updated.adaptability === 'unknown' ? 'partial' : 'complete'
  }

  // Career goal signals
  if (
    allText.includes('karier') ||
    allText.includes('depan') ||
    allText.includes('rencana') ||
    allText.includes('impian') ||
    allText.includes('pelajari') ||
    allText.includes('berkembang') ||
    allText.includes('pencapaian')
  ) {
    updated.career_goal = updated.career_goal === 'unknown' ? 'partial' : 'complete'
  }

  return updated
}

// ─────────────────────────────────────────────────────────────
// Calculate overall HR coverage confidence (0-1)
// ─────────────────────────────────────────────────────────────
export function calculateHRConfidence(coverage: HRCoverage): number {
  const values = Object.values(coverage)
  const score = values.reduce((acc, v) => {
    if (v === 'complete') return acc + 1
    if (v === 'partial') return acc + 0.5
    return acc
  }, 0)
  return score / values.length
}

// ─────────────────────────────────────────────────────────────
// Build follow-up context for Ollama messages
// ─────────────────────────────────────────────────────────────
export function buildHRFollowUpContext(messages: InterviewMessage[]): string {
  return messages
    .map((m) => `${m.role === 'assistant' ? 'HR Recruiter' : 'Kandidat'}: ${m.content}`)
    .join('\n\n')
}
