import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Zap, Check } from 'lucide-react'
import ApplicationForm from '@/components/apply/ApplicationForm'

export const metadata: Metadata = {
  title: 'Lamar — TalentMatch AI',
  description: 'Kirim aplikasi Anda dan mulai proses penilaian kandidat berbasis AI.',
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm flex-shrink-0" title="Kembali ke Beranda">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 font-bold text-slate-900 flex-shrink-0">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:inline">TalentMatch AI</span>
          </div>
          <div className="w-6 sm:w-32 flex-shrink-0" /> {/* spacer to balance the flex between */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Mulai Penilaian Kandidat
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-8">
            Unggah CV dan lengkapi profil kandidat. Sistem akan menganalisis pengalaman, menyesuaikan pertanyaan dengan posisi yang dipilih, dan menghasilkan insight rekrutmen yang terstruktur.
          </p>
          
          {/* Progress Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2 overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-4 flex-shrink-0">Langkah 1 dari 4</span>
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold text-slate-900">Application</span>
              </div>
              <div className="w-4 h-px bg-slate-300 flex-shrink-0" />
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-400 hidden sm:inline">CV Analysis</span>
              </div>
              <div className="w-4 h-px bg-slate-300 flex-shrink-0 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-400">AI Interview</span>
              </div>
              <div className="w-4 h-px bg-slate-300 flex-shrink-0 hidden md:block" />
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-400">Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout Wrapper handled by ApplicationForm */}
        <ApplicationForm />
      </main>
    </div>
  )
}
