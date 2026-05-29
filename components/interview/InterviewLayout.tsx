'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

interface Props {
  candidateId: string;
  sidebar: React.ReactNode;
  chat: React.ReactNode;
}

export default function InterviewLayout({ candidateId, sidebar, chat }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top Navigation Bar ─────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 flex-shrink-0 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-7 h-7 gradient-brand rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden sm:inline">TalentMatch AI</span>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {['Lamaran', 'Analisis CV', 'Wawancara', 'Hasil'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 ${
                    i === 2 ? 'text-[#7c3aed] font-semibold' : i < 2 ? 'text-emerald-600' : ''
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      i < 2
                        ? 'bg-emerald-100 text-emerald-600'
                        : i === 2
                        ? 'gradient-brand text-white shadow-brand'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {i < 2 ? '✓' : i + 1}
                  </div>
                  <span className="hidden md:block">{step}</span>
                </div>
                {i < 3 && <div className="w-4 sm:w-6 h-px bg-slate-200 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main 2-column Layout ───────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex gap-0 lg:gap-6 px-0 lg:px-6 py-0 lg:py-6" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>

        {/* ── DESKTOP SIDEBAR ────────────────── */}
        <aside className="hidden lg:flex flex-col gap-4 w-[280px] xl:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {sidebar}
          </div>
        </aside>

        {/* ── MOBILE DRAWER SIDEBAR ────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-slate-50 shadow-2xl flex flex-col lg:hidden overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4 z-10">
                  <span className="font-bold text-slate-900">Konteks Wawancara</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {sidebar}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── RIGHT: Main interview panel ─────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 h-full lg:h-auto">
          <div
            className="bg-white flex flex-col shadow-sm lg:rounded-2xl overflow-hidden border-0 lg:border border-slate-200"
            style={{ height: 'calc(100vh - 3.5rem - (1.5rem * 2))' }}
          >
            {/* Interview header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-slate-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Recruiter avatar */}
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-brand flex-shrink-0">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-slate-900 text-sm"> HR Recruiter</h1>
                  <p className="text-xs text-slate-500">
                    TalentMatch AI · Screening Interview
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-emerald-200 shadow-sm flex-shrink-0">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">Langsung</span>
                </div>
              </div>
            </div>

            {/* Chat interface */}
            {chat}
          </div>
        </main>

      </div>
    </div>
  )
}
