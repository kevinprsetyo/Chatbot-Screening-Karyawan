import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Code2 } from 'lucide-react'
import TechnicalInterviewPage from '@/components/technical-interview/TechnicalInterviewPage'

export const metadata: Metadata = {
  title: 'Wawancara Teknis — TalentMatch AI',
  description: 'Fase 2: Wawancara teknis mendalam untuk menilai kompetensi dan kedalaman pengetahuan teknis kandidat.',
}

export default async function TechnicalInterviewRoute({
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
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:inline">TalentMatch AI</span>
          </Link>

          {/* Phase indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Fase 2 — Wawancara Teknis</span>
          </div>

          {/* Pipeline stepper */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-400">Analisis CV</span>
            <span className="text-slate-300">›</span>
            <span className="text-emerald-600 font-semibold">✓ Wawancara HR</span>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-blue-600">Wawancara Teknis</span>
            <span className="text-slate-300">›</span>
            <span>Laporan</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Chat area */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] relative">
          <TechnicalInterviewPage candidateId={candidateId} />
        </main>

        {/* Side info */}
        <aside className="hidden lg:block w-64 space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Fase Teknis
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wawancara ini menilai kedalaman teknis, kemampuan pemecahan masalah, dan validasi pengalaman kerja Anda.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">Tips Wawancara Teknis</p>
            <ul className="space-y-1.5 text-xs text-blue-600">
              <li>• Ceritakan proyek nyata yang pernah Anda kerjakan</li>
              <li>• Jelaskan proses berpikir Anda</li>
              <li>• Akui jika ada yang belum Anda ketahui</li>
              <li>• Fokus pada pengalaman praktis</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Anda sudah lolos</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Wawancara HR telah berhasil. Ini adalah fase final sebelum laporan rekomendasi dibuat.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
