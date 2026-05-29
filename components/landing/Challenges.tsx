'use client'

import { motion } from 'framer-motion'
import { FileWarning, SearchX, Clock, SlidersHorizontal } from 'lucide-react'

const challenges = [
  {
    icon: FileWarning,
    title: 'Terlalu banyak CV untuk ditinjau',
    description:
      'Tim HR menghabiskan berjam-jam untuk menyeleksi ratusan pelamar, membuang waktu berharga yang seharusnya digunakan untuk mewawancarai kandidat terbaik.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Evaluasi tidak konsisten',
    description:
      'Tanpa struktur yang baku, kandidat sering dinilai berdasarkan preferensi subjektif perekrut yang berbeda-beda, bukan metrik objektif.',
  },
  {
    icon: SearchX,
    title: 'Kandidat potensial terlewat',
    description:
      'Kelelahan dalam proses screening massal sering kali membuat kandidat "kuda hitam" dengan pengalaman luar biasa terabaikan secara tidak sengaja.',
  },
  {
    icon: Clock,
    title: 'Sulit memberikan feedback',
    description:
      'Memberikan alasan penolakan yang jelas dan terstruktur kepada hiring manager atau kandidat sangat sulit tanpa data evaluasi yang komprehensif.',
  },
]

export default function Challenges() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 lg:sticky lg:top-32"
          >
            <div className="inline-flex px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-6">
              Masalah Rekrutmen
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Rekrutmen lambat, bias menutupi potensi sejati.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Proses rekrutmen tradisional mengandalkan insting dan skimming cepat, menyebabkan kesalahan perekrutan dan waktu yang terbuang.
            </p>
          </motion.div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {challenges.map((challenge, i) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-purple-200 hover:bg-purple-50/10 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <challenge.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{challenge.title}</h3>
                <p className="text-slate-500 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
