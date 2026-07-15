import type { Metadata } from 'next'
import NewResultPageClient from '@/components/result/NewResultPageClient'

export const metadata: Metadata = {
  title: 'Hasil Evaluasi — TalentMatch AI',
  description: 'Lihat hasil lengkap penilaian kandidat termasuk skor, kekuatan, kelemahan, dan rekomendasi rekrutmen.',
}

interface Props {
  params: Promise<{ candidateId: string }>
}

export default async function ResultPage({ params }: Props) {
  const { candidateId } = await params
  return <NewResultPageClient candidateId={candidateId} />
}
