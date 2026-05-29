import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TalentMatch AI — Penilaian Kandidat Cerdas',
  description:
    'Identifikasi kandidat terbaik lebih cepat dengan analisis CV berbasis AI, wawancara adaptif, dan wawasan perekrutan terstruktur. Dibangun untuk tim HR modern.',
  keywords: 'teknologi HR, penilaian kandidat, wawancara AI, otomatisasi rekrutmen, pencocokan bakat',
  openGraph: {
    title: 'TalentMatch AI — Penilaian Kandidat Cerdas',
    description: 'Analisis CV berbasis AI, wawancara adaptif, dan keputusan perekrutan terstruktur.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
