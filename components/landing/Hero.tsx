'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronRight, LayoutDashboard, Users, FileText, Settings, XCircle, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFAFA]">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 border border-purple-200/50 text-purple-700 text-sm font-semibold mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-purple-600"></span>
            Platform Rekrutmen AI Generasi Baru
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl xl:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.1] mb-6"
          >
            Temukan Kandidat Terbaik dengan Evaluasi <span className="gradient-text">Berbasis AI</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl"
          >
            Analisis CV mendalam, wawancara adaptif, dan insight rekrutmen komprehensif. Persempit pencarian Anda dari ratusan ke kandidat terbaik dalam hitungan menit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/apply"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base"
            >
              Mulai Penilaian Gratis
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-purple-600" />
              Lihat Demo
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#FAFAFA] bg-slate-200 flex items-center justify-center overflow-hidden z-[${4-i}]`}>
                   <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <span className="text-slate-900 font-bold">10,000+</span> evaluasi selesai minggu ini
            </div>
          </motion.div>
        </div>

        {/* Right Column: Realistic SaaS Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative lg:ml-auto w-full max-w-[600px] perspective-1000"
        >
          {/* Subtle drop shadow */}
          <div className="absolute inset-10 bg-purple-600/20 blur-[80px] -z-10 rounded-full" />
          
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-left h-[500px]"
          >
            {/* Header */}
            <div className="h-14 border-b border-slate-100 flex items-center justify-between px-5 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <span className="text-xs font-semibold text-slate-500">Sarah Chen — Frontend Engineer</span>
              </div>
              <div className="flex gap-2">
                <div className="h-6 px-2.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  HIRE
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">SC</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-0.5">Sarah Chen</h2>
                    <p className="text-slate-500 text-xs">Kecocokan Keseluruhan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">92<span className="text-lg text-slate-400">%</span></div>
                </div>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Teknis (React)', score: 95, color: 'bg-purple-600' },
                  { label: 'Sistem Desain', score: 88, color: 'bg-indigo-500' },
                  { label: 'Komunikasi', score: 92, color: 'bg-emerald-500' },
                  { label: 'Problem Solving', score: 85, color: 'bg-blue-500' },
                ].map((item, idx) => (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + (idx * 0.1) }}
                    key={item.label} 
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50"
                  >
                    <div className="text-xs text-slate-500 font-medium mb-2">{item.label}</div>
                    <div className="flex items-end justify-between mb-1.5">
                      <div className="text-lg font-bold text-slate-900">{item.score}</div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: 1 + (idx * 0.1), ease: "easeOut" }}
                        className={`h-full ${item.color} rounded-full`} 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="rounded-xl border border-purple-100 bg-purple-50/50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md gradient-brand flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">AI</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Insight Evaluasi</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kandidat menunjukkan penguasaan React yang sangat kuat, terutama dalam optimasi <span className="font-semibold text-purple-700 bg-purple-100 px-1 rounded">rendering performance</span>. Komunikasi terstruktur dan sangat cocok untuk posisi Senior.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
            className="absolute -right-8 top-24 glass p-3 rounded-xl shadow-lg border border-white flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Analisis Selesai</div>
              <div className="text-[10px] text-slate-500">Dalam 2.4 detik</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
