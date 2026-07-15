import { ollamaChat } from './client'
import type { InterviewMessage, HREvaluationResult } from '@/types'

const HR_EVALUATION_PROMPT = `Anda adalah Senior HR Manager yang sedang mengevaluasi hasil wawancara HR awal.
Berdasarkan transkrip wawancara berikut, berikan penilaian terstruktur.

Kembalikan HANYA objek JSON valid berikut, TANPA teks tambahan:

{
  "communication": <0-100>,
  "motivation": <0-100>,
  "leadership": <0-100>,
  "adaptability": <0-100>,
  "overall_hr_score": <0-100>,
  "notes": "Catatan singkat 1-2 kalimat dalam Bahasa Indonesia tentang kesan umum kandidat"
}

Panduan Penilaian:
- communication (0-100): Kejelasan, struktur, dan cara kandidat menyampaikan ide
- motivation (0-100): Antusiasme, kejelasan tujuan, dan relevansi motivasi dengan posisi
- leadership (0-100): Inisiatif, kepemilikan, dan pengalaman memimpin (beri 60 jika tidak ada bukti)
- adaptability (0-100): Fleksibilitas, kemampuan belajar, dan respons terhadap perubahan
- overall_hr_score: Rata-rata tertimbang keempat dimensi (communication x0.3, motivation x0.3, leadership x0.2, adaptability x0.2)

Catatan: Nilai berdasarkan BUKTI dari transkrip, bukan asumsi. Jika dimensi tidak tergali, beri nilai 50.`

export async function generateHREvaluation(
  messages: InterviewMessage[],
  position: string
): Promise<HREvaluationResult> {
  const transcript = messages
    .map((m) => `${m.role === 'assistant' ? 'HR RECRUITER' : 'KANDIDAT'}: ${m.content}`)
    .join('\n\n')

  const response = await ollamaChat({
    messages: [
      { role: 'system', content: HR_EVALUATION_PROMPT },
      {
        role: 'user',
        content: `Posisi yang dilamar: ${position}\n\nTranskrip Wawancara HR:\n${transcript}\n\nBerikan evaluasi JSON sekarang.`,
      },
    ],
    temperature: 0.1,
    max_tokens: 800,
  })

  const cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    const communication = Number(parsed.communication) || 50
    const motivation = Number(parsed.motivation) || 50
    const leadership = Number(parsed.leadership) || 50
    const adaptability = Number(parsed.adaptability) || 50
    const overall =
      Number(parsed.overall_hr_score) ||
      Math.round(communication * 0.3 + motivation * 0.3 + leadership * 0.2 + adaptability * 0.2)

    return {
      communication,
      motivation,
      leadership,
      adaptability,
      overall_hr_score: overall,
      notes: parsed.notes || 'Evaluasi berdasarkan transkrip wawancara HR.',
    }
  } catch {
    return {
      communication: 50,
      motivation: 50,
      leadership: 50,
      adaptability: 50,
      overall_hr_score: 50,
      notes: 'Evaluasi tidak dapat diselesaikan sepenuhnya. Memerlukan peninjauan manual.',
    }
  }
}
