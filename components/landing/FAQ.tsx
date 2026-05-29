'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'

const faqs = [
  {
    question: 'Apakah AI sepenuhnya menggantikan tim HR?',
    answer: 'Sama sekali tidak. TalentMatch AI dirancang sebagai alat bantu (copilot) bagi tim rekrutmen. AI kami melakukan ekstraksi data berat dan analisis awal, memberikan Anda insight terstruktur untuk membuat keputusan akhir yang lebih cerdas dan cepat.'
  },
  {
    question: 'Seberapa akurat evaluasi wawancara adaptif?',
    answer: 'Mesin wawancara adaptif kami tidak hanya mencari kata kunci, tetapi memahami konteks semantik dari pengalaman kandidat. Skor didasarkan pada matriks evaluasi yang divalidasi oleh pakar industri, memastikan akurasi dan objektivitas tinggi.'
  },
  {
    question: 'Apakah platform ini dapat digunakan untuk peran non-teknis?',
    answer: 'Ya. Meskipun sangat kuat untuk posisi teknis (seperti Software Engineer atau Data Analyst), kriteria evaluasi kami sepenuhnya adaptif. Anda dapat menyesuaikan matriks penilaian untuk peran seperti Sales, Marketing, atau Operations.'
  },
  {
    question: 'Bagaimana keamanan data kandidat dikelola?',
    answer: 'Keamanan adalah prioritas utama. Semua data CV dan riwayat wawancara dienkripsi end-to-end. Kami mematuhi standar privasi data global dan tidak pernah menggunakan data klien kami untuk melatih model AI publik.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-slate-500">
            Punya pertanyaan lain? Tim support kami siap membantu 24/7.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`bg-white border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-purple-200 shadow-sm' : 'border-slate-200'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-6 sm:px-8 sm:py-6 text-left flex items-center justify-between focus:outline-none group"
                >
                  <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-purple-700' : 'text-slate-900 group-hover:text-purple-600'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-purple-100' : 'bg-slate-100 group-hover:bg-purple-50'}`}>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Plus className={`w-5 h-5 ${isOpen ? 'text-purple-600' : 'text-slate-500'}`} />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                        <p className="text-slate-500 leading-relaxed text-base">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
