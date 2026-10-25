import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Heart, CheckCircle2, ChevronRight, Unlock } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { triggerGrandCelebration, triggerGoldenSparks } from '../utils/confettiFireworks'
import { romanticAudio } from '../utils/audioManager'

export const VirtualGiftBox: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false)
  const [activePromiseIndex, setActivePromiseIndex] = useState(0)

  const handleOpenGift = () => {
    if (!isOpened) {
      triggerGoldenSparks(0.5, 0.4)
      triggerGrandCelebration()
      romanticAudio.playWishChime()
    }
    setIsOpened(!isOpened)
  }

  const promises = BIRTHDAY_CONFIG.promises

  return (
    <section id="gift" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
          <Gift size={14} className="text-amber-400" />
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200">
            A Surprise From The Heart
          </span>
        </div>

        <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-gold-bright tracking-tight">
          Virtual Gift Box 🎁
        </h2>

        <p className="text-amber-100/75 text-xs sm:text-base font-serif italic max-w-lg mx-auto">
          Wrapped with love, sealed with promises, waiting for your touch to reveal its secrets.
        </p>
      </div>

      <div className="flex flex-col items-center w-full px-2 sm:px-0">
        {/* The Gift Box */}
        {!isOpened ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            onClick={handleOpenGift}
            className="group relative cursor-pointer flex flex-col items-center select-none"
          >
            {/* Box Container */}
            <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-[#800f1c] via-[#520912] to-[#250308] border-2 border-amber-400/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-300 group-hover:shadow-[0_25px_70px_rgba(212,175,55,0.5)]">
              {/* Ribbon Vertical */}
              <div className="absolute inset-y-0 w-10 sm:w-12 bg-gradient-to-r from-[#ffd54f] via-[#d4af37] to-[#aa771c] shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              {/* Ribbon Horizontal */}
              <div className="absolute inset-x-0 h-10 sm:h-12 bg-gradient-to-b from-[#ffd54f] via-[#d4af37] to-[#aa771c] shadow-[0_0_15px_rgba(212,175,55,0.5)]" />

              {/* 3D Bow in the center */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#ffe082] via-[#d4af37] to-[#8d620e] flex items-center justify-center border-2 border-white/60 shadow-[0_0_25px_rgba(212,175,55,0.8)]"
              >
                <Heart size={28} className="sm:w-8 sm:h-8 text-red-700 fill-red-700 drop-shadow" />
              </motion.div>

              {/* Shimmer light pass */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>

            <button
              onClick={handleOpenGift}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-xs sm:text-base uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform transform group-hover:scale-105 cursor-pointer"
            >
              <Unlock size={16} />
              <span>Tap To Untie & Open Gift</span>
            </button>
          </motion.div>
        ) : (
          /* Opened Gift Box Content */
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-3xl rounded-3xl p-5 sm:p-10 gold-card border-2 border-amber-400/50 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.25)] relative"
          >
            {/* Header with Close */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-amber-500/30 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Gift size={22} />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                    {BIRTHDAY_CONFIG.giftSurprise.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/70 font-serif italic">
                    {BIRTHDAY_CONFIG.giftSurprise.subtext}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpened(false)}
                className="px-4 py-1.5 rounded-full border border-amber-400/30 text-amber-300 hover:bg-amber-500/10 text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close Box
              </button>
            </div>

            {/* Special Telugu Note */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/40 border border-rose-500/30 mb-8 text-center">
              <p className="text-base sm:text-lg font-telugu text-rose-200 leading-relaxed font-semibold">
                “{BIRTHDAY_CONFIG.giftSurprise.specialNote}”
              </p>
            </div>

            {/* 7 Promises for Ammuuu */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-xs uppercase tracking-widest text-amber-300 font-semibold">
                  7 Eternal Promises For Ammuuu ❤️
                </span>
                <span className="text-xs text-amber-200/60 font-cinzel">
                  Promise {activePromiseIndex + 1} of {promises.length}
                </span>
              </div>

              {/* Active Promise Card */}
              <div className="p-6 rounded-2xl bg-black/50 border border-amber-400/30 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center gap-2 text-rose-400 mb-2">
                  <CheckCircle2 size={18} className="text-amber-400" />
                  <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                    {promises[activePromiseIndex].title}
                  </h4>
                </div>
                <p className="font-serif text-sm sm:text-base text-amber-100/85 leading-relaxed pl-6">
                  {promises[activePromiseIndex].description}
                </p>
              </div>

              {/* Navigation pagination for promises */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                  {promises.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePromiseIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activePromiseIndex === idx
                          ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      title={`Promise ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActivePromiseIndex(
                        (prev) => (prev - 1 + promises.length) % promises.length
                      )
                    }
                    className="px-3 py-1 rounded-lg border border-amber-400/30 text-xs text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setActivePromiseIndex((prev) => (prev + 1) % promises.length)
                    }
                    className="px-3 py-1 rounded-lg bg-amber-500/30 border border-amber-400/40 text-xs text-amber-200 hover:bg-amber-500/40 cursor-pointer flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
