import Link from 'next/link'
import { Zap, Mail, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              TalentMatch AI
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
              Platform rekrutmen cerdas yang dirancang untuk membantu tim HR menemukan kandidat terbaik dengan cepat dan objektif melalui evaluasi berbasis AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-indigo-400 transition-colors">Beranda</Link></li>
              <li><a href="#how-it-works" className="text-slate-400 hover:text-indigo-400 transition-colors">Cara Kerja</a></li>
              <li><a href="#solution" className="text-slate-400 hover:text-indigo-400 transition-colors">Fitur Utama</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Lainnya</h4>
            <ul className="space-y-3">
              <li><Link href="/apply" className="text-slate-400 hover:text-indigo-400 transition-colors">Mulai Penilaian</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-4 text-center md:text-left">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TalentMatch AI. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm text-slate-500">Sistem Online</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
