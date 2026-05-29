'use client'

import { motion } from 'framer-motion'

const logos = [
  { name: 'Acme Corp', text: 'ACME' },
  { name: 'Globex', text: 'GLOBEX' },
  { name: 'Soylent', text: 'SOYLENT' },
  { name: 'Initech', text: 'INITECH' },
  { name: 'Umbrella', text: 'UMBRELLA' },
  { name: 'Stark Ind.', text: 'STARK' },
]

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-slate-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Dipercaya oleh tim rekrutmen dari startup hingga enterprise
        </p>
        
        {/* Logo Farm / Marquee effect */}
        <div className="relative flex overflow-hidden">
          {/* Gradient masks for smooth fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20
            }}
            className="flex items-center gap-16 md:gap-24 whitespace-nowrap px-4"
          >
            {/* Render logos twice for seamless loop */}
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              >
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                  {logo.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
