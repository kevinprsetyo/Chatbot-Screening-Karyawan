'use client'

import { motion } from 'framer-motion'
import { FileText, MessageSquare, BarChart3, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Analisis CV Instan',
    description: 'Ekstrak keterampilan, pengalaman, dan pendidikan dari format CV apa pun secara otomatis dalam detik.',
    preview: (
      <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md">React</div>
          <div className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md">Node.js</div>
          <div className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">+5</div>
        </div>
        <div className="space-y-1.5 pt-2 border-t border-slate-50">
          <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
          <div className="h-1.5 w-4/5 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    )
  },
  {
    icon: MessageSquare,
    title: 'Mesin Wawancara Adaptif',
    description: 'AI membaca CV kandidat dan menghasilkan pertanyaan yang sangat relevan untuk menggali pengalaman mereka.',
    preview: (
      <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
        <div className="self-end bg-purple-600 text-white text-[10px] p-2 rounded-l-xl rounded-tr-xl max-w-[80%]">
          Ceritakan tentang optimasi rendering yang Anda lakukan di proyek X.
        </div>
        <div className="self-start bg-slate-100 text-slate-600 text-[10px] p-2 rounded-r-xl rounded-tl-xl max-w-[80%]">
          Saya menggunakan React.memo dan useMemo untuk...
        </div>
      </div>
    )
  },
  {
    icon: BarChart3,
    title: 'Penilaian Multi-Dimensi',
    description: 'Dapatkan skor terpisah untuk kemampuan teknis, komunikasi, pemecahan masalah, dan kepemimpinan.',
    preview: (
      <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        {[
          { l: 'Teknis', w: '90%' },
          { l: 'Komunikasi', w: '85%' },
          { l: 'Kultur', w: '95%' }
        ].map(s => (
          <div key={s.l}>
            <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-600">
              <span>{s.l}</span>
              <span className="text-slate-900">{s.w}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: s.w }}></div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    icon: CheckCircle,
    title: 'Hiring Recommendation',
    description: 'Keputusan definitif (Hire / No Hire) didukung oleh data lengkap, kekuatan, dan area pengembangan.',
    preview: (
      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">STRONG HIRE</div>
          <div className="text-[10px] text-slate-500">Kecocokan: 92%</div>
        </div>
      </div>
    )
  },
]

export default function SolutionOverview() {
  return (
    <section id="solution" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-purple-700 text-sm font-bold tracking-wide mb-4 shadow-sm">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">
            Setiap fitur dirancang untuk presisi.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Hentikan tebak-tebakan. Dapatkan insight berbasis data dari proses evaluasi yang terstandardisasi dan komprehensif.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200 hover:border-purple-200 rounded-3xl p-1 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="p-6 bg-slate-50/50 rounded-t-[22px] flex-1">
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <div className="p-4 bg-slate-100/50 rounded-b-[22px] mt-auto">
                {feature.preview}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
