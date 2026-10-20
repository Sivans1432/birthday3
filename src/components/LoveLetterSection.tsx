import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Mail, MailOpen } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { triggerGoldenSparks, triggerHeartBurst } from '../utils/confettiFireworks'
import { romanticAudio } from '../utils/audioManager'

export const LoveLetterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenLetter = () => {
    if (!isOpen) {
      triggerGoldenSparks(0.5, 0.4)
      triggerHeartBurst(0.5, 0.5)
      romanticAudio.playWishChime()
    }
    setIsOpen(!isOpen)
  }

  return (
    <section id="letter" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
          <Mail size={14} className="text-amber-400" />
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200">
            Written From My Soul
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-gold-bright tracking-tight">
          A Letter For Ammu ❤️
        </h2>

        <p className="text-amber-100/75 text-sm sm:text-base font-serif italic max-w-lg mx-auto">
          Words that come straight from the deepest chambers of my heart,
          across every mile between us.
        </p>
      </div>

      {/* 3D Envelope Presentation */}
      <div className="flex flex-col items-center">
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            onClick={handleOpenLetter}
            className="group relative w-full max-w-lg cursor-pointer select-none"
          >
            {/* Outer envelope body */}
            <div className="relative h-64 sm:h-72 rounded-3xl p-6 bg-gradient-to-b from-[#1b140e] via-[#100d0a] to-[#080605] border border-amber-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] flex flex-col items-center justify-center text-center overflow-hidden transition-all group-hover:border-amber-400/80 group-hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.3)]">
              {/* Envelope Triangular Flap Graphic */}
              <div
                className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#251b12] to-[#16110c] border-b border-amber-500/30"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                }}
              />

              {/* Glowing Golden Wax Seal */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd54f] via-[#d4af37] to-[#8d620e] flex items-center justify-center border-2 border-[#fff3b0] shadow-[0_0_25px_rgba(212,175,55,0.6)] cursor-pointer"
              >
                <span className="font-cinzel font-bold text-amber-950 text-xl tracking-tighter">
                  M
                </span>
                <Heart
                  size={12}
                  className="absolute -top-1 -right-1 text-red-600 fill-red-600 drop-shadow"
                />
              </motion.div>

              {/* Invitation prompt */}
              <div className="relative z-10 mt-6 space-y-1">
                <p className="font-cinzel text-sm sm:text-base font-semibold text-amber-200 tracking-wider">
                  Tap To Break Seal & Unfold
                </p>
                <p className="font-script text-2xl text-rose-400">
                  With all my love, forever
                </p>
              </div>

              {/* Golden corner flourishes */}
              <span className="absolute bottom-3 left-4 text-xs text-amber-400/40">✦</span>
              <span className="absolute bottom-3 right-4 text-xs text-amber-400/40">✦</span>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleOpenLetter}
                className="px-6 py-2.5 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <MailOpen size={15} />
                <span>Open Birthday Letter</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Unfolded Royal Parchment Letter */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full max-w-3xl rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-b from-[#16120d] via-[#100d0a] to-[#090705] border-2 border-amber-500/40 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.2)] backdrop-blur-2xl relative overflow-hidden"
            >
              {/* Artistic B&W Holding Hands Background with Reduced Opacity */}
              <div
                className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/assets/letter-bg-hands.jpg')`,
                  opacity: 0.14,
                  filter: 'grayscale(100%) contrast(115%) brightness(85%)',
                }}
              />
              {/* Soft dark vignette overlay to preserve perfect text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#120e0a]/88 via-[#0a0806]/80 to-[#070504]/92 pointer-events-none z-0" />

              {/* Main Letter Content */}
              <div className="relative z-10">
                {/* Top seal badge */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#aa771c] flex items-center justify-center font-cinzel font-bold text-amber-950 text-base shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                      M
                    </div>
                    <div>
                      <p className="font-cinzel text-xs uppercase tracking-widest text-amber-300">
                        Personal Birthday Letter
                      </p>
                      <p className="font-serif text-sm text-amber-200/60">
                        For Mounika (Ammuuu)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-1.5 rounded-full border border-amber-400/30 text-amber-300 hover:bg-amber-500/10 text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Fold Letter
                  </button>
                </div>

                {/* Salutation */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-rose-300 tracking-wide drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                    {BIRTHDAY_CONFIG.letter.salutation}
                  </h3>
                  <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-3" />
                </div>

                {/* Letter Paragraphs (Exact Telugu-English Wording Preserved) */}
                <div className="space-y-6 text-sm sm:text-base md:text-lg leading-relaxed text-amber-100/90 font-serif">
                  {BIRTHDAY_CONFIG.letter.paragraphs.map((para, idx) => {
                    // Check if paragraph contains bold emphasis
                    const isHighlighted =
                      para.includes('I am sorry, Maa') ||
                      para.includes('Happiest Birthday to my Ammuuuu') ||
                      para.includes('I may not be beside you today') ||
                      para.includes('Love you so much!')

                    return (
                      <p
                        key={idx}
                        className={`leading-relaxed text-left ${
                          isHighlighted
                            ? 'p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 font-semibold text-amber-200'
                            : 'text-amber-100/90'
                        }`}
                      >
                        {para}
                      </p>
                    )
                  })}
                </div>

                {/* Signoff */}
                <div className="mt-12 pt-8 border-t border-amber-500/30 flex flex-col items-center text-center space-y-2">
                  <Heart size={24} className="text-rose-500 fill-rose-500/80 animate-pulse" />
                  <p className="font-script text-3xl sm:text-4xl text-rose-400">
                    {BIRTHDAY_CONFIG.letter.signoff}
                  </p>
                  <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/70 pt-2">
                    Forever & Always Yours
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
