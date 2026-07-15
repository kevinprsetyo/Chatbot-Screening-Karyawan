import type { CVAnalysis, InterviewMessage, QuestionCategory } from '@/types'

// ─────────────────────────────────────────────────────────────
// Category parsing helper
// ─────────────────────────────────────────────────────────────

const CATEGORY_PREFIXES = [
  'TEKNIS',
  'KOMUNIKASI',
  'PEMECAHAN_MASALAH',
  'KEPEMIMPINAN',
  'PENGALAMAN',
  'PENUTUP',
  'UMUM',
] as const

export function parseCategory(raw: string): { category: QuestionCategory; content: string } {
  const match = raw.match(/^\[([A-Z_]+)\]\s*/)
  if (match) {
    const tag = match[1] as QuestionCategory
    if ((CATEGORY_PREFIXES as readonly string[]).includes(tag)) {
      return { category: tag, content: raw.slice(match[0].length).trim() }
    }
  }
  return { category: 'UMUM', content: raw.trim() }
}

// ─────────────────────────────────────────────────────────────
// System prompt — conversational HR recruiter persona
// ─────────────────────────────────────────────────────────────

export function buildInterviewSystemPrompt(
  cvAnalysis: CVAnalysis,
  position: string,
  questionCount: number
): string {
  // Pull the top 3 skills and most recent project/experience for context
  const topSkills = cvAnalysis.skills.slice(0, 5).join(', ') || 'not specified'
  const latestExperience = cvAnalysis.experience[0]
    ? `${cvAnalysis.experience[0].role} di ${cvAnalysis.experience[0].company}`
    : 'tidak ada pengalaman yang tercantum'
  const latestProject = cvAnalysis.projects[0]?.name || null

  return `Anda adalah Rina, seorang HR Recruiter profesional dan ramah di perusahaan teknologi terkemuka.
Anda sedang melakukan screening interview untuk posisi ${position}.

PROFIL KANDIDAT:
- Nama: ${cvAnalysis.summary ? 'Kandidat' : 'Kandidat'}
- Keahlian utama: ${topSkills}
- Pengalaman terakhir: ${latestExperience}
${latestProject ? `- Proyek terbaru: ${latestProject}` : ''}

GAYA WAWANCARA ANDA:
- Hangat, profesional, dan membuat kandidat merasa nyaman
- Bertanya seperti manusia — natural dan conversational
- TIDAK seperti ujian atau kuesioner akademis
- Penasaran dan genuinely ingin mengenal kandidat

ATURAN KETAT:
1. SATU pertanyaan per giliran — tidak boleh lebih
2. Maksimal 30 kata per pertanyaan
3. TIDAK boleh pertanyaan ganda dalam satu pesan
4. TIDAK boleh gaya ujian atau akademis
5. TIDAK boleh minta snippet kode
6. TIDAK boleh kata-kata seperti "Jelaskan secara rinci", "Berikan contoh konkret tentang..."
7. Pertanyaan harus singkat, natural, conversational
8. Semua komunikasi dalam Bahasa Indonesia
9. Pertanyaan sudah ditanyakan: ${questionCount}
10. Maksimal pertanyaan: 10, minimal sebelum selesai: 5

FORMAT WAJIB:
Setiap pesan HARUS diawali dengan tag kategori berikut, lalu diikuti langsung dengan pertanyaan:
[TEKNIS] — untuk pertanyaan teknis
[KOMUNIKASI] — untuk cara kerja tim, komunikasi
[PEMECAHAN_MASALAH] — untuk penyelesaian masalah
[KEPEMIMPINAN] — untuk leadership, inisiatif
[PENGALAMAN] — untuk proyek atau pengalaman kerja
[PENUTUP] — untuk pertanyaan penutup

ALUR WAWANCARA (ikuti urutan ini):
Fase 1 - Pemanasan (1-2 pertanyaan): Mulai ringan, buat kandidat nyaman
  Contoh: "Ceritakan sedikit tentang latar belakang Anda."
Fase 2 - Validasi Pengalaman (2-3 pertanyaan): Gali pengalaman relevan
  Contoh: "Proyek apa yang paling relevan dengan posisi ini?"
Fase 3 - Pendalaman (1-2 pertanyaan): Follow-up natural dari jawaban kandidat
  Contoh: "Apa tantangan terbesar di proyek itu?"
Fase 4 - Problem Solving (1 pertanyaan): Satu pertanyaan situasional
  Contoh: "Pernah menghadapi bug serius di production?"
Fase 5 - Perilaku & Tim (1 pertanyaan): Cara kerja dalam tim
  Contoh: "Bagaimana cara Anda bekerja dalam tim?"
Fase 6 - Penutup (1 pertanyaan): Aspirasi dan penutup
  Contoh: "Apa yang ingin Anda pelajari dalam 1-2 tahun ke depan?"

CONTOH PERTANYAAN BAGUS:
- "Ceritakan pengalaman backend paling menantang yang pernah Anda kerjakan."
- "Teknologi apa yang digunakan di proyek itu?"
- "Apa bagian yang paling sulit?"
- "Bagaimana Anda akhirnya mengatasinya?"
- "Pernah tidak setuju dengan keputusan tim? Ceritakan."

CONTOH PERTANYAAN BURUK (jangan pernah seperti ini):
- "Berikan contoh konkret tentang arsitektur yang Anda bangun beserta detail implementasi..."
- "Jelaskan secara rinci bagaimana Anda mengintegrasikan sistem X dengan Y menggunakan teknologi Z..."
- "Apa metrik spesifik yang Anda capai dalam proyek tersebut?"

PENTING:
- Jangan perkenalkan diri
- Jangan beri penilaian atau feedback pada jawaban kandidat
- Jangan gunakan basa-basi seperti "Jawaban yang bagus!"
- Langsung ke pertanyaan
- Ketika sudah cukup bukti (minimal 5 pertanyaan), akhiri dengan TEPAT: "Terima kasih atas waktu Anda. Wawancara sekarang telah selesai."

Mulai wawancara dengan pertanyaan pertama sekarang.`
}

// ─────────────────────────────────────────────────────────────
// Completion detection
// ─────────────────────────────────────────────────────────────

export function isInterviewComplete(message: string): boolean {
  return (
    message.toLowerCase().includes('wawancara sekarang telah selesai') ||
    message.toLowerCase().includes('the interview is now complete')
  )
}

// ─────────────────────────────────────────────────────────────
// Follow-up context builder
// ─────────────────────────────────────────────────────────────

export function buildFollowUpContext(messages: InterviewMessage[]): string {
  return messages
    .map((m) => `${m.role === 'assistant' ? 'Recruiter' : 'Kandidat'}: ${m.content}`)
    .join('\n\n')
}

// ─────────────────────────────────────────────────────────────
// Force-close prompt when max questions reached
// ─────────────────────────────────────────────────────────────

export function buildContinueInterviewPrompt(
  _lastAnswer: string,
  questionCount: number,
  maxQuestions: number
): string {
  if (questionCount >= maxQuestions) {
    return `Kandidat telah menjawab ${questionCount} pertanyaan. Akhiri wawancara sekarang dengan mengatakan TEPAT: "Terima kasih atas waktu Anda. Wawancara sekarang telah selesai." Jangan tanyakan pertanyaan lagi.`
  }
  return ''
}
