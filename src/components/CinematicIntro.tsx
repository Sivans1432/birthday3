import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Clock } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { triggerGrandCelebration, triggerGoldenSparks } from '../utils/confettiFireworks'
import { romanticAudio } from '../utils/audioManager'

interface CinematicIntroProps {
  onEnterSurprise: () => void
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnterSurprise }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthdayToday: false
  })
  const [forceCelebrationMode, setForceCelebrationMode] = useState<boolean>(true)


  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      let target = new Date(currentYear, BIRTHDAY_CONFIG.birthdayMonth, BIRTHDAY_CONFIG.birthdayDay, 0, 0, 0)

      // If the target has already passed this year by more than 24 hours, count to next year
      const diffMs = target.getTime() - now.getTime()
      const isToday =
        now.getMonth() === BIRTHDAY_CONFIG.birthdayMonth &&
        now.getDate() === BIRTHDAY_CONFIG.birthdayDay

      if (isToday) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthdayToday: true
        })
        return
      }

      let diff = diffMs
      if (diff < 0) {
        // Next year's birthday
        target = new Date(currentYear + 1, BIRTHDAY_CONFIG.birthdayMonth, BIRTHDAY_CONFIG.birthdayDay, 0, 0, 0)
        diff = target.getTime() - now.getTime()
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isBirthdayToday: false
      })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleOpenSurprise = () => {
    triggerGoldenSparks()
    triggerGrandCelebration()
    // Start ambient romantic soundtrack on user interaction
    romanticAudio.play(BIRTHDAY_CONFIG.audio.src)
    onEnterSurprise()
  }

  const isCelebration = timeRemaining.isBirthdayToday || forceCelebrationMode

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
      {/* Background cinematic vignette & radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060504]/60 via-transparent to-[#060504] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Sparkle Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-[10%] text-amber-300/40 pointer-events-none hidden md:block"
      >
        <Sparkles size={36} />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[12%] text-rose-400/40 pointer-events-none hidden md:block"
      >
        <Heart size={32} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle royal badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-200/90 font-medium">
            October 27 · A Royal Celebration
          </span>
        </motion.div>

        {/* Cinematic Opening Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-serif italic text-xl md:text-2xl text-amber-200/80 mb-3 tracking-wide"
        >
          Someone Very Special Was Born Today…
        </motion.p>

        {/* 3D Glowing Pulsing Heart */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{
            scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 1.2, delay: 0.8 }
          }}
          className="relative my-6"
        >
          <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl transform scale-150 animate-pulse" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border border-amber-400/40 flex items-center justify-center bg-gradient-to-tr from-amber-950/60 to-red-950/60 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500/90 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
          </div>
        </motion.div>

        {/* Grand Headline Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-cinzel font-extrabold tracking-tight leading-none text-gold-bright drop-shadow-2xl">
            Happy Birthday,
          </h1>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white/95 font-semibold tracking-wide">
              {BIRTHDAY_CONFIG.girlfriendName}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
              <p className="font-script text-3xl sm:text-4xl md:text-5xl text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]">
                My {BIRTHDAY_CONFIG.nickname} ❤️
              </p>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </div>
        </motion.div>

        {/* Romantic Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="max-w-2xl text-base sm:text-lg text-amber-100/75 leading-relaxed font-sans mb-10 px-4"
        >
          Distance may keep us apart today, but every beat of my heart belongs to you.
          Step inside your little universe, made with all my love, just for you, Maa.
        </motion.p>

        {/* Dynamic Countdown or Birthday Mode Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="w-full max-w-lg mb-10"
        >
          {isCelebration ? (
            <div className="p-6 rounded-2xl gold-card border border-amber-500/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 animate-shimmer" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 text-amber-300 font-cinzel text-sm uppercase tracking-widest mb-1">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>The Grand Day Is Here!</span>
                  <Sparkles size={16} className="text-amber-400" />
                </div>
                <p className="text-2xl md:text-3xl font-serif text-white font-bold mb-2">
                  Today Is Ammuuu’s Birthday! 🎂
                </p>
                <p className="text-sm text-amber-200/80">
                  Ready to celebrate the most precious girl in the universe?
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl gold-card border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 text-xs font-cinzel tracking-widest text-amber-300/80 uppercase mb-4">
                <Clock size={14} />
                <span>Counting Down To October 27</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Days', val: timeRemaining.days },
                  { label: 'Hours', val: timeRemaining.hours },
                  { label: 'Mins', val: timeRemaining.minutes },
                  { label: 'Secs', val: timeRemaining.seconds }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/50 border border-amber-400/20 backdrop-blur-sm"
                  >
                    <div className="text-2xl md:text-3xl font-cinzel font-bold text-amber-200">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-400/70 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Main CTA Button: "Open Your Surprise ❤️" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleOpenSurprise}
            className="group relative px-9 py-4 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-lg tracking-wider uppercase shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_55px_rgba(212,175,55,0.7)] transition-all transform flex items-center gap-3 cursor-pointer"
          >
            <span>Open Your Surprise</span>
            <Heart className="w-5 h-5 text-red-600 fill-red-600 group-hover:scale-125 transition-transform" />
          </button>
        </motion.div>

        {/* Small subtle mode toggle for visitor convenience */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-8 flex items-center gap-2 text-xs text-amber-300/50"
        >
          <span>Mode:</span>
          <button
            onClick={() => setForceCelebrationMode(!forceCelebrationMode)}
            className="underline hover:text-amber-200 cursor-pointer"
          >
            {forceCelebrationMode ? 'Switch to dynamic countdown' : 'Replay birthday celebration mode'}
          </button>
        </motion.div>
      </div>

      {/* Cinematic scroll down cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-amber-300/40 text-[11px] font-cinzel tracking-widest uppercase pointer-events-none"
      >
        <span>Explore Below</span>
        <span className="text-amber-400">↓</span>
      </motion.div>
    </div>
  )
}
