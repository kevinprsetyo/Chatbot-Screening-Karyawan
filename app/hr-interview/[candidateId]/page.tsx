import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Heart } from 'lucide-react'
import HRInterviewPage from '@/components/hr-interview/HRInterviewPage'

export const metadata: Metadata = {
  title: 'Wawancara HR — TalentMatch AI',
  description: 'Fase 1: Wawancara HR untuk penilaian motivasi, komunikasi, dan kesesuaian budaya perusahaan.',
}

export default async function HRInterviewRoute({
  params,
}: {
  params: Promise<{ candidateId: string }>
}) {
  const { candidateId } = await params

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:inline">TalentMatch AI</span>
          </Link>

          {/* Phase indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full">
            <Heart className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-xs font-semibold text-violet-700">Fase 1 — Wawancara HR</span>
          </div>

          {/* Pipeline stepper */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-400">Analisis CV</span>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-violet-600">Wawancara HR</span>
            <span className="text-slate-300">›</span>
            <span>Wawancara Teknis</span>
            <span className="text-slate-300">›</span>
            <span>Laporan</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Chat area */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] relative">
          <HRInterviewPage candidateId={candidateId} />
        </main>

        {/* Side info */}
        <aside className="hidden lg:block w-64 space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Fase HR
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wawancara ini menilai kemampuan komunikasi, motivasi, kolaborasi, kepemimpinan, dan kesesuaian budaya Anda.
            </p>
          </div>

          <div className="bg-violet-50 rounded-2xl border border-violet-100 p-4">
            <p className="text-xs font-semibold text-violet-700 mb-2">Tips Wawancara HR</p>
            <ul className="space-y-1.5 text-xs text-violet-600">
              <li>• Jawab dengan jujur dan spesifik</li>
              <li>• Ceritakan pengalaman nyata</li>
              <li>• Tunjukkan antusiasme Anda</li>
              <li>• Tidak ada jawaban yang salah</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
