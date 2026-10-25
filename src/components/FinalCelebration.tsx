import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, RotateCcw } from 'lucide-react'
import { triggerGrandCelebration, triggerGoldenSparks, triggerHeartBurst } from '../utils/confettiFireworks'


interface FinalCelebrationProps {
  onReplay: () => void
}

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({ onReplay }) => {
  const handleGrandCelebration = () => {
    triggerGoldenSparks(0.5, 0.4)
    triggerHeartBurst(0.5, 0.5)
    setTimeout(() => {
      triggerGrandCelebration()
    }, 200)
  }

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
      {/* Background glow and lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Subtle crown icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-950/60 to-red-950/60 border border-amber-400/50 shadow-[0_0_35px_rgba(212,175,55,0.4)]"
        >
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
        </motion.div>

        {/* Grand Finale Text: You Are Special, Ammuuu ❤️ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <p className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-300">
            Forever In My Heart
          </p>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-cinzel font-black text-gold-bright tracking-tight drop-shadow-2xl">
            You Are Special, Ammuuu ❤️
          </h2>
          <p className="font-script text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-rose-400 break-words">
            Happy Birthday, Maaaaaaaaaaaaaaaaaa 💖🫂🎂
          </p>
        </motion.div>

        {/* Telugu Quote Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto p-5 sm:p-9 rounded-2xl sm:rounded-3xl gold-card border-amber-400/40 relative"
        >
          <p className="font-telugu text-sm sm:text-lg text-amber-100 leading-relaxed">
            “Oka roju ee distance antha dooram aipoyi, manam kalisi birthdays celebrate chesukune roju vasthundhani hope chesthunna. Appudu nee birthday ni inka beautiful ga celebrate chesukundham. Nuvvu eppudu happy ga undaali, Ammu!”
          </p>
          <div className="w-16 h-0.5 mx-auto bg-amber-400/50 mt-4 mb-2" />
          <p className="text-xs font-serif italic text-amber-300/80">
            — With all my love, your forever person
          </p>
        </motion.div>

        {/* Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-4 w-full sm:w-auto px-4"
        >
          {/* Light up the skies button */}
          <button
            onClick={handleGrandCelebration}
            className="w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-sm sm:text-base tracking-wider uppercase shadow-[0_0_40px_rgba(212,175,55,0.45)] hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Sparkles size={18} />
            <span>Light Up The Skies For Ammuuu 🎆</span>
          </button>

          {/* Replay Option */}
          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black/60 border border-amber-400/40 text-amber-200 font-cinzel font-semibold text-xs uppercase tracking-widest hover:bg-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Experience Surprise Again ✦</span>
          </button>
        </motion.div>

        {/* Royal Footer */}
        <footer className="pt-20 pb-8 text-center border-t border-amber-500/20 mt-20">
          <div className="flex items-center justify-center gap-2 text-xs font-cinzel uppercase tracking-[0.25em] text-amber-300/70 mb-2">
            <span>Made With All My Love</span>
            <span>✦</span>
            <span>For Mounika (Ammuuu)</span>
          </div>
          <p className="text-[11px] text-amber-100/40 font-serif">
            October 27 · Every day, every year, celebrating you.
          </p>
        </footer>
      </div>
    </section>
  )
}
