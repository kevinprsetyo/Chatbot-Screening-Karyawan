'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-24 relative overflow-hidden group shadow-2xl"
        >
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-purple-600/40 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none group-hover:bg-indigo-600/30 transition-colors duration-700" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-purple-200 text-sm font-semibold mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              Siap untuk merekrut lebih cerdas?
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              Mulai Evaluasi <br className="hidden md:block" /> Kandidat Terbaik Anda.
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tinggalkan proses seleksi manual yang melelahkan. Dapatkan insight rekrutmen berbasis data secara otomatis dalam hitungan menit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="flex sm:inline-flex justify-center items-center gap-2 px-8 py-4 sm:py-5 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20 w-full sm:w-auto"
              >
                Mulai Penilaian Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                className="flex sm:inline-flex justify-center items-center gap-2 px-8 py-4 sm:py-5 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 border border-slate-700 transition-transform duration-300 hover:-translate-y-1 w-full sm:w-auto"
              >
                Jadwalkan Demo
              </button>
            </div>
            
            <p className="mt-8 text-sm text-slate-400">
              
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
