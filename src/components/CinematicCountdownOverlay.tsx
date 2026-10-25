import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Sparkles, Heart, Crown } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { romanticAudio } from '../utils/audioManager'
import { triggerCelebrationCrackerBurst } from '../utils/confettiFireworks'

interface CinematicCountdownOverlayProps {
  onRevealComplete: () => void
}

type RevealStage = 'COUNTDOWN' | 'BURST' | 'CELEBRATING' | 'FADING_OUT' | 'DONE'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export const CinematicCountdownOverlay: React.FC<CinematicCountdownOverlayProps> = ({
  onRevealComplete
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false)
  const [stage, setStage] = useState<RevealStage>('COUNTDOWN')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 1
  })

  // Target timestamp: October 27, 2026 at 12:00:00 AM IST (1793039400000)
  // Supports ?test=true in URL for 10-second countdown preview
  const [targetTimestamp, setTargetTimestamp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('test') === 'true') {
        return Date.now() + 10000 // 10-second test countdown
      }
    }
    return BIRTHDAY_CONFIG.targetTimestampIST
  })

  const celebrationTriggeredRef = useRef<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isTestMode = targetTimestamp <= Date.now() + 60000 && targetTimestamp > Date.now() - 30000

  // 1. Lock body and html scroll when overlay is active
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalBodyOverflow || ''
      document.documentElement.style.overflow = originalHtmlOverflow || ''
    }
  }, [])

  // 2. Trigger celebration sequence when countdown hits zero
  const triggerCelebrationSequence = useCallback(() => {
    if (celebrationTriggeredRef.current) return
    celebrationTriggeredRef.current = true

    // Step 1: Freeze countdown at zero
    setTimeLeft({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0
    })

    // Step 2: Golden Light Burst
    setStage('BURST')

    // Sound fanfare + wish chimes
    try {
      romanticAudio.playCelebrationFanfare()
      romanticAudio.playWishChime()
      // If user hadn't toggled music, attempt background play
      romanticAudio.play(BIRTHDAY_CONFIG.audio.src).catch(() => {})
      setIsPlayingMusic(true)
    } catch {
      // AudioContext might require user gesture in some browsers
    }

    // Step 3: Launch fireworks, golden crackers, sparkles & confetti
    triggerCelebrationCrackerBurst()

    // Step 4: After 450ms light burst, reveal huge 3D golden birthday text
    const celebrateTimer = setTimeout(() => {
      setStage('CELEBRATING')
    }, 450)

    // Step 5: Keep reveal visible for ~6 seconds (5-7 seconds specified)
    const fadeTimer = setTimeout(() => {
      setStage('FADING_OUT')
    }, 6500)

    // Step 6: After smooth fade out, complete reveal and show existing website
    const completeTimer = setTimeout(() => {
      setStage('DONE')
      // Restore scroll
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      onRevealComplete()
    }, 8000)

    return () => {
      clearTimeout(celebrateTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onRevealComplete])

  // 3. Precision countdown loop (calculates from target timestamp, avoiding drift)
  useEffect(() => {
    if (celebrationTriggeredRef.current) return

    const updateCountdown = () => {
      const now = Date.now()
      const diff = targetTimestamp - now

      if (diff <= 0) {
        // Countdown reached zero or visitor opened after target time
        triggerCelebrationSequence()
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalMs: diff
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 250)

    return () => clearInterval(timer)
  }, [targetTimestamp, triggerCelebrationSequence])

  // 4. Background Cinematic Canvas: Golden particles, twinkling stars, floating rose petals
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle types: Gold sparkles, stars, and rose petals
    interface Particle {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      fadeSpeed: number
      color: string
      type: 'sparkle' | 'star' | 'petal'
      angle: number
      rotationSpeed: number
    }

    const particles: Particle[] = []
    const particleCount = Math.min(width < 768 ? 45 : 85, 90)

    const goldColors = ['#ffd700', '#f6d167', '#d4af37', '#ffe89e', '#ffffff']

    for (let i = 0; i < particleCount; i++) {
      const isPetal = i % 7 === 0
      const isStar = i % 4 === 0 && !isPetal
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? Math.random() * 8 + 6 : isStar ? Math.random() * 2.8 + 1.5 : Math.random() * 2 + 1,
        speedY: isPetal ? Math.random() * 0.9 + 0.5 : -(Math.random() * 0.4 + 0.2),
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.015 + 0.005,
        color: isPetal ? '#e63946' : goldColors[Math.floor(Math.random() * goldColors.length)],
        type: isPetal ? 'petal' : isStar ? 'star' : 'sparkle',
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.save()

        // Twinkle opacity
        p.opacity += p.fadeSpeed
        if (p.opacity > 0.9 || p.opacity < 0.2) {
          p.fadeSpeed = -p.fadeSpeed
        }

        p.y += p.speedY
        p.x += p.speedX
        p.angle += p.rotationSpeed

        // Wrap around bounds
        if (p.type === 'petal') {
          if (p.y > height + 20) p.y = -20
        } else {
          if (p.y < -20) p.y = height + 20
        }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20

        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity))
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        if (p.type === 'petal') {
          // Romantic rose petal curve
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.8, 0, p.size)
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.8, 0, -p.size)
          ctx.fill()
        } else if (p.type === 'star') {
          // Twinkling golden cross star
          ctx.fillStyle = p.color
          ctx.shadowBlur = 8
          ctx.shadowColor = '#ffd700'
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = p.color
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(-p.size * 2, 0)
          ctx.lineTo(p.size * 2, 0)
          ctx.moveTo(0, -p.size * 2)
          ctx.lineTo(0, p.size * 2)
          ctx.stroke()
        } else {
          // Soft golden glowing orb
          ctx.fillStyle = p.color
          ctx.shadowBlur = 6
          ctx.shadowColor = '#ffd700'
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Toggle romantic background music
  const toggleMusic = () => {
    const isNowPlaying = romanticAudio.toggle(BIRTHDAY_CONFIG.audio.src)
    setIsPlayingMusic(isNowPlaying)
  }

  // Quick 10-second test countdown trigger for inspection
  const triggerTestCountdown = () => {
    celebrationTriggeredRef.current = false
    setStage('COUNTDOWN')
    setTargetTimestamp(Date.now() + 10000)
  }

  if (stage === 'DONE') {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-countdown-overlay"
        initial={{ opacity: 1 }}
        animate={{
          opacity: stage === 'FADING_OUT' ? 0 : 1
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-[#050403] text-[#f7eed7] flex flex-col items-center justify-center overflow-hidden select-none"
        style={{
          touchAction: 'none'
        }}
      >
        {/* Background Canvas Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Ambient Dark Luxury Radial Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-0" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-0" />

        {/* Top Floating Music Controller */}
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              isPlayingMusic
                ? 'border-amber-400/70 bg-amber-500/20 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'border-amber-500/30 bg-black/60 text-amber-200/80 hover:border-amber-400/60'
            }`}
            title={isPlayingMusic ? 'Mute Music' : 'Play Romantic Music'}
          >
            {isPlayingMusic ? (
              <>
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s] h-4" />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s] h-2.5" />
                </div>
                <span className="text-xs font-cinzel tracking-widest uppercase text-amber-300">
                  Music Playing
                </span>
              </>
            ) : (
              <>
                <Music size={15} className="text-amber-400 animate-pulse" />
                <span className="text-xs font-cinzel tracking-widest uppercase">
                  Play Music 🎵
                </span>
              </>
            )}
          </button>
        </div>

        {/* ============================================================== */}
        {/* CINEMATIC LIGHT BURST FLASH EFFECT (When countdown reaches 0)  */}
        {/* ============================================================== */}
        {stage === 'BURST' && (
          <div className="absolute inset-0 z-40 bg-radial from-amber-200 via-amber-400 to-transparent pointer-events-none animate-light-burst" />
        )}

        {/* ============================================================== */}
        {/* STAGE 1: FULL-SCREEN COUNTDOWN ONLY                            */}
        {/* ============================================================== */}
        {stage === 'COUNTDOWN' && (
          <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center animate-fade-in">
            {/* Top Royal Crown / Heart Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/40 bg-amber-950/30 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold">
                FOR MY AMMUUU 👑
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </motion.div>

            {/* Opening Teaser Text */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-amber-100 tracking-wide mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            >
              Something Special Is Waiting For You ❤️
            </motion.h2>

            {/* Large Animated Luxury Countdown Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="w-full max-w-3xl mb-12"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/20 via-black/60 to-black/80 border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-xl">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HOURS', value: timeLeft.hours },
                  { label: 'MINUTES', value: timeLeft.minutes },
                  { label: 'SECONDS', value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group p-4 sm:p-6 rounded-2xl bg-black/60 border border-amber-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center overflow-hidden"
                  >
                    {/* Golden top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

                    {/* Numeric Digits */}
                    <div className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold text-3d-gold tracking-tight py-1">
                      {String(item.value).padStart(2, '0')}
                    </div>

                    {/* Label */}
                    <div className="mt-2 text-xs sm:text-sm font-cinzel font-semibold tracking-[0.25em] text-amber-300/80 uppercase">
                      {item.label}
                    </div>

                    {/* Subtle corner sparkles */}
                    <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-60 transition-opacity">
                      <Sparkles size={12} className="text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Target Date Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xs sm:text-sm font-cinzel tracking-[0.2em] text-amber-400/60 uppercase"
            >
              Target: October 27, 2026 · 12:00:00 AM IST
            </motion.p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2 & 3: GRAND CELEBRATION REVEAL (Huge 3D Golden Text)   */}
        {/* ============================================================== */}
        {(stage === 'CELEBRATING' || stage === 'FADING_OUT') && (
          <div className="relative z-20 max-w-5xl w-full px-6 flex flex-col items-center text-center">
            {/* Crown Icon with Golden Rays */}
            <motion.div
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], rotate: 0, opacity: 1 }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.6 }
              }}
              className="mb-4"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-amber-400/60 bg-gradient-to-tr from-amber-950/80 via-red-950/60 to-black/80 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.7)]">
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(246,209,103,0.9)]" />
              </div>
            </motion.div>

            {/* HUGE 3D GOLDEN TEXT: HAPPY BIRTHDAY */}
            <motion.h1
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-cinzel font-extrabold tracking-tight text-3d-gold leading-none drop-shadow-[0_0_40px_rgba(212,175,55,0.8)] mb-4"
            >
              HAPPY BIRTHDAY
            </motion.h1>

            {/* HUGE 3D GOLDEN TEXT: AMMUUUUU ❤️🎂 */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-3 sm:gap-4 mb-6"
            >
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
                AMMUUUUU
              </h2>
              <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]">
                ❤️🎂
              </span>
            </motion.div>

            {/* SUBTITLE: “My Ammuuu • My Happiness • My Everything” */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="relative px-6 py-3 rounded-full border border-amber-500/40 bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-8"
            >
              <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-amber-200 tracking-wide">
                My Ammuuu • My Happiness • My Everything
              </p>
            </motion.div>

            {/* Automatic Transition Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="flex items-center gap-2 text-xs sm:text-sm font-cinzel tracking-widest text-amber-300/70 uppercase"
            >
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Entering Your Birthday Universe...</span>
              <Sparkles size={14} className="text-amber-400 animate-spin" />
            </motion.div>
          </div>
        )}

        {/* Bottom Dev / Preview Helper (Discreet, allows quick testing without modifying code) */}
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-30">
          <button
            onClick={triggerTestCountdown}
            className="px-3 py-1 rounded-full text-[11px] font-cinzel tracking-wider text-amber-400/40 hover:text-amber-300 hover:border-amber-400/40 border border-transparent transition-all cursor-pointer"
            title="Preview the 10-second countdown completion and reveal sequence"
          >
            {isTestMode ? '⏳ Test Mode Active (10s)' : '⚡ Preview 10s Countdown'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
