'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Database, BrainCircuit, Code2, Shield, LayoutTemplate } from 'lucide-react'

const roles = [
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: Server,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    criteria: [
      { name: 'System Architecture', score: 95 },
      { name: 'API Design & Security', score: 90 },
      { name: 'Database Optimization', score: 85 },
      { name: 'Node.js / Go / Python', score: 90 }
    ],
    description: 'Evaluasi berfokus pada skalabilitas, desain sistem, dan efisiensi query.'
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    icon: LayoutTemplate,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    criteria: [
      { name: 'React / Next.js', score: 95 },
      { name: 'State Management', score: 90 },
      { name: 'Performance Opt.', score: 85 },
      { name: 'CSS / Tailwind', score: 95 }
    ],
    description: 'Menilai pemahaman tentang siklus hidup komponen, aksesibilitas, dan performa rendering.'
  },
  {
    id: 'data',
    title: 'Data Analyst',
    icon: Database,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    criteria: [
      { name: 'Advanced SQL', score: 95 },
      { name: 'Statistical Analysis', score: 90 },
      { name: 'Data Visualization', score: 85 },
      { name: 'Business Acumen', score: 80 }
    ],
    description: 'Fokus pada kemampuan menerjemahkan raw data menjadi insight bisnis yang actionable.'
  },
  {
    id: 'ml',
    title: 'ML Engineer',
    icon: BrainCircuit,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    criteria: [
      { name: 'Model Architecture', score: 90 },
      { name: 'Data Pipeline', score: 85 },
      { name: 'Python / PyTorch', score: 95 },
      { name: 'Model Deployment', score: 85 }
    ],
    description: 'Mengukur pemahaman algoritma, optimasi parameter, dan MLOps lifecycle.'
  }
]

export default function PositionCriteria() {
  const [activeTab, setActiveTab] = useState(roles[0].id)
  const activeRole = roles.find(r => r.id === activeTab)!

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold mb-4">
            Adaptive Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Satu platform, <br className="hidden sm:block" /> adaptasi untuk setiap posisi.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            TalentMatch AI menyesuaikan matriks evaluasinya secara dinamis berdasarkan posisi yang Anda buka, persis seperti hiring manager sungguhan.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="lg:w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all whitespace-nowrap lg:whitespace-normal flex-shrink-0 ${
                  activeTab === role.id 
                    ? 'bg-white shadow-md border border-slate-200 ring-1 ring-slate-100' 
                    : 'hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === role.id ? role.bgColor : 'bg-slate-200'}`}>
                  <role.icon className={`w-5 h-5 ${activeTab === role.id ? role.color : 'text-slate-500'}`} />
                </div>
                <span className={`font-semibold ${activeTab === role.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {role.title}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-8 lg:p-12 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col justify-center"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${activeRole.bgColor}`}>
                    <activeRole.icon className={`w-8 h-8 ${activeRole.color}`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">{activeRole.title}</h3>
                    <p className="text-slate-500 mt-1">{activeRole.description}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Fokus Penilaian Utama</h4>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    {activeRole.criteria.map((item, idx) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm font-semibold mb-2">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-slate-400">Bobot {item.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1) }}
                            className={`h-full bg-slate-900 rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
