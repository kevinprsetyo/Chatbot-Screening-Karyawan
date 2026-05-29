'use client'

import { motion } from 'framer-motion'

const stats = [
  {
    value: '78%',
    label: 'Pengurangan waktu penyaringan',
    description: 'Tim yang menggunakan penilaian terstruktur menghabiskan jauh lebih sedikit waktu pada peninjauan manual',
  },
  {
    value: '3.2×',
    label: 'Kualitas rekrutmen yang lebih baik',
    description: 'Wawancara terstruktur memprediksi kinerja pekerjaan secara signifikan lebih baik daripada yang tidak terstruktur',
  },
  {
    value: '91%',
    label: 'Konsistensi evaluasi',
    description: 'Penilaian yang didorong oleh AI menghilangkan subjektivitas dan menerapkan standar yang sama pada setiap kandidat',
  },
  {
    value: '60%',
    label: 'Waktu untuk merekrut berkurang',
    description: 'Dari aplikasi hingga keputusan dalam hitungan jam, bukan minggu',
  },
]

export default function BusinessImpact() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Dampak Bisnis
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Hasil yang memberikan perubahan.
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Penilaian kandidat yang terstruktur bukan hanya lebih cepat — ini menghasilkan hasil rekrutmen yang terukur lebih baik.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 card-hover"
            >
              <div className="text-5xl font-bold gradient-text mb-3">{stat.value}</div>
              <div className="font-semibold text-slate-900 mb-2">{stat.label}</div>
              <div className="text-sm text-slate-400 leading-relaxed">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Comparison banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden gradient-brand p-0.5"
        >
          <div className="bg-white rounded-[calc(1.5rem-2px)] p-10">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  Tanpa TalentMatch AI
                </div>
                {[
                  'Peninjauan CV manual memakan waktu berhari-hari',
                  'Pertanyaan wawancara tidak konsisten',
                  'Keputusan rekrutmen berdasarkan firasat',
                  'Tidak ada data untuk meningkatkan proses',
                  'Kandidat yang baik terabaikan',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 py-2.5 border-b border-slate-50">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-xs font-bold">✕</span>
                    </div>
                    <span className="text-slate-500">{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">
                  Dengan TalentMatch AI
                </div>
                {[
                  'Analisis dan ringkasan CV instan',
                  'Pertanyaan wawancara adaptif dan terstruktur',
                  'Penilaian berbasis bukti di 5 dimensi',
                  'Kekuatan, kelemahan, dan tingkat risiko yang jelas',
                  'Keputusan konsisten yang dapat diandalkan',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 py-2.5 border-b border-slate-50">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
