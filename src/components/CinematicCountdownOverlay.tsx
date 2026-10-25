import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Sparkles, Heart, Crown, Volume2, VolumeX, Delete, X } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { romanticAudio } from '../utils/audioManager'

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

const SECRET_PIN = '4410'

export const CinematicCountdownOverlay: React.FC<CinematicCountdownOverlayProps> = ({
  onRevealComplete
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false)
  const [stage, setStage] = useState<RevealStage>('COUNTDOWN')
  const [videoSrc] = useState<string>(BIRTHDAY_CONFIG.crackersVideo || '/assets/crackers-blast.mp4')
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false)
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false)

  // PIN security keypad modal state
  const [showPinModal, setShowPinModal] = useState<boolean>(false)
  const [enteredPin, setEnteredPin] = useState<string>('')
  const [pinState, setPinState] = useState<'idle' | 'success' | 'error'>('idle')
  const [activeKey, setActiveKey] = useState<string | null>(null)

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
  const videoRef = useRef<HTMLVideoElement | null>(null)

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

  // Transition to fadeout and complete
  const proceedToFadeOut = useCallback(() => {
    setStage((currentStage) => {
      if (currentStage === 'FADING_OUT' || currentStage === 'DONE') return currentStage
      return 'FADING_OUT'
    })

    setTimeout(() => {
      setStage('DONE')
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      onRevealComplete()
    }, 1500)
  }, [onRevealComplete])

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

    // Celebration audio fanfare fallback
    try {
      romanticAudio.playCelebrationFanfare()
      romanticAudio.playWishChime()
    } catch {
      // AudioContext fallback
    }

    // Step 3: Play REAL CRACKERS BLAST VIDEO (no paper blast)
    setTimeout(() => {
      setStage('CELEBRATING')
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {
          // If browser policy blocks audio autoplay, play muted
          if (videoRef.current) {
            videoRef.current.muted = true
            setIsVideoMuted(true)
            videoRef.current.play().catch(() => {})
          }
        })
      }
    }, 350)

    // Step 4: After ~7 seconds of real crackers blast celebration, fade out
    const fadeTimer = setTimeout(() => {
      proceedToFadeOut()
    }, 7500)

    return () => {
      clearTimeout(fadeTimer)
    }
  }, [proceedToFadeOut])

  // Handle when video finishes naturally
  const handleVideoEnded = () => {
    proceedToFadeOut()
  }

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

  // 4. Background Canvas: Golden particles, twinkling stars, floating rose petals
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
    const particleCount = Math.min(width < 768 ? 40 : 80, 85)
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.save()

        p.opacity += p.fadeSpeed
        if (p.opacity > 0.9 || p.opacity < 0.2) {
          p.fadeSpeed = -p.fadeSpeed
        }

        p.y += p.speedY
        p.x += p.speedX
        p.angle += p.rotationSpeed

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
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.8, 0, p.size)
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.8, 0, -p.size)
          ctx.fill()
        } else if (p.type === 'star') {
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

  // Toggle video audio mute/unmute
  const toggleVideoMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted
      videoRef.current.muted = newMuted
      setIsVideoMuted(newMuted)
    }
  }

  // PIN Keypad Handling
  const handleKeyPadPress = useCallback((val: string) => {
    if (pinState !== 'idle') return

    if (val === 'backspace') {
      setEnteredPin((prev) => prev.slice(0, -1))
      return
    }

    setEnteredPin((prev) => {
      if (prev.length >= 4) return prev
      const nextPin = prev + val

      if (nextPin.length === 4) {
        if (nextPin === SECRET_PIN) {
          setPinState('success')
          try {
            romanticAudio.playWishChime()
          } catch {}

          setTimeout(() => {
            setShowPinModal(false)
            setEnteredPin('')
            setPinState('idle')

            // Trigger 10-second countdown celebration preview sequence!
            celebrationTriggeredRef.current = false
            setStage('COUNTDOWN')
            setTargetTimestamp(Date.now() + 10000) // 10-second countdown into real crackers blast
          }, 450)
        } else {
          setPinState('error')
          setTimeout(() => {
            setEnteredPin('')
            setPinState('idle')
          }, 700)
        }
      }
      return nextPin
    })
  }, [pinState])

  // Support physical keyboard typing for PIN
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showPinModal) {
        // Pressing P or typing 4 opens PIN modal
        if (e.key === 'p' || e.key === 'P') {
          setShowPinModal(true)
        }
        return
      }

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPadPress(e.key)
      } else if (e.key === 'Backspace') {
        handleKeyPadPress('backspace')
      } else if (e.key === 'Escape') {
        setShowPinModal(false)
        setEnteredPin('')
        setPinState('idle')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPinModal, handleKeyPadPress])

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
        className="fixed inset-0 z-50 w-full h-[100dvh] min-h-[100dvh] bg-[#050403] text-[#f7eed7] flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden select-none py-4 sm:py-6"
        style={{ touchAction: 'manipulation' }}
      >
        {/* ============================================================== */}
        {/* REAL CRACKERS BLAST VIDEO BACKGROUND                           */}
        {/* ============================================================== */}
        {(stage === 'BURST' || stage === 'CELEBRATING' || stage === 'FADING_OUT') && (
          <div className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              autoPlay
              muted={isVideoMuted}
              className="w-full h-full object-cover transition-opacity duration-700"
              onEnded={handleVideoEnded}
              onError={() => setVideoLoadError(true)}
            />
            {/* Cinematic dark grading overlay to keep golden text brilliant and visible */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_90%)] pointer-events-none" />
          </div>
        )}

        {/* Background Canvas Particles (Stars & Petals) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Ambient Dark Luxury Radial Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-0" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-0" />

        {/* Top Controls: Music & Video Mute Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3">
          {/* Video Audio Unmute button when video is active */}
          {(stage === 'CELEBRATING' || stage === 'BURST') && (
            <button
              onClick={toggleVideoMute}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg text-xs ${
                isVideoMuted
                  ? 'border-red-500/60 bg-red-950/40 text-red-200'
                  : 'border-amber-400/80 bg-amber-500/30 text-amber-200'
              }`}
              title={isVideoMuted ? 'Unmute crackers video sound' : 'Mute crackers video sound'}
            >
              {isVideoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="font-cinzel tracking-wider uppercase text-[11px] sm:text-xs">
                {isVideoMuted ? 'Unmute' : 'Sound On'}
              </span>
            </button>
          )}

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg text-xs ${
              isPlayingMusic
                ? 'border-amber-400/70 bg-amber-500/20 text-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'border-amber-500/30 bg-black/60 text-amber-200/80 hover:border-amber-400/60'
            }`}
            title={isPlayingMusic ? 'Mute Music' : 'Play Romantic Music'}
          >
            {isPlayingMusic ? (
              <>
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-0.5 sm:w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
                  <span className="w-0.5 sm:w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s] h-4" />
                  <span className="w-0.5 sm:w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s] h-2.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-cinzel tracking-widest uppercase text-amber-300">
                  Playing
                </span>
              </>
            ) : (
              <>
                <Music size={14} className="text-amber-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-cinzel tracking-widest uppercase">
                  Music 🎵
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
          <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 flex flex-col items-center text-center animate-fade-in">
            {/* Top Royal Crown / Heart Badge (Clicking opens secret PIN modal) */}
            <button
              onClick={() => setShowPinModal(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-amber-500/40 bg-amber-950/30 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-amber-400/80 transition-all cursor-pointer"
              title="Click to enter PIN: 4410"
            >
              <Crown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400 animate-pulse" />
              <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-200 font-semibold">
                FOR MY AMMUUU 👑
              </span>
              <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </button>

            {/* Opening Teaser Text */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-serif italic text-lg sm:text-2xl md:text-4xl text-amber-100 tracking-wide mb-8 sm:mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-2"
            >
              Something Special Is Waiting For You ❤️
            </motion.h2>

            {/* Large Animated Luxury Countdown Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="w-full max-w-3xl mb-8 sm:mb-12"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-950/20 via-black/60 to-black/80 border border-amber-500/35 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-xl">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HOURS', value: timeLeft.hours },
                  { label: 'MINUTES', value: timeLeft.minutes },
                  { label: 'SECONDS', value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-black/60 border border-amber-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center overflow-hidden"
                  >
                    {/* Golden top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

                    {/* Numeric Digits */}
                    <div className="text-3xl sm:text-6xl md:text-7xl font-cinzel font-bold text-3d-gold tracking-tight py-1">
                      {String(item.value).padStart(2, '0')}
                    </div>

                    {/* Label */}
                    <div className="mt-1 sm:mt-2 text-[10px] sm:text-sm font-cinzel font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-amber-300/80 uppercase">
                      {item.label}
                    </div>

                    {/* Subtle corner sparkles */}
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 opacity-20 group-hover:opacity-60 transition-opacity">
                      <Sparkles size={11} className="text-amber-400" />
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
              className="text-[11px] sm:text-sm font-cinzel tracking-[0.18em] sm:tracking-[0.2em] text-amber-400/60 uppercase"
            >
              Target: October 27, 2026 · 12:00:00 AM IST
            </motion.p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2 & 3: GRAND CELEBRATION REVEAL (Over Real Crackers Video)*/}
        {/* ============================================================== */}
        {(stage === 'CELEBRATING' || stage === 'FADING_OUT') && (
          <div className="relative z-20 max-w-5xl w-full px-4 sm:px-6 flex flex-col items-center text-center">
            {/* Crown Icon with Golden Rays */}
            <motion.div
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{ scale: [1, 1.15, 1], rotate: 0, opacity: 1 }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.6 }
              }}
              className="mb-3 sm:mb-4"
            >
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-amber-400/60 bg-gradient-to-tr from-amber-950/80 via-red-950/60 to-black/80 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.7)] backdrop-blur-md">
                <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(246,209,103,0.9)]" />
              </div>
            </motion.div>

            {/* HUGE 3D GOLDEN TEXT: HAPPY BIRTHDAY */}
            <motion.h1
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-cinzel font-extrabold tracking-tight text-3d-gold leading-tight sm:leading-none drop-shadow-[0_0_45px_rgba(212,175,55,0.95)] mb-2 sm:mb-4"
            >
              HAPPY BIRTHDAY
            </motion.h1>

            {/* HUGE 3D GOLDEN TEXT: AMMUUUUU ❤️🎂 */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6"
            >
              <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
                AMMUUUUU
              </h2>
              <span className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]">
                ❤️🎂
              </span>
            </motion.div>

            {/* SUBTITLE: “My Ammuuu • My Happiness • My Everything” */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="relative px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-amber-500/40 bg-black/70 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-6 sm:mb-8"
            >
              <p className="font-serif italic text-xs sm:text-xl md:text-3xl text-amber-200 tracking-wide">
                My Ammuuu • My Happiness • My Everything
              </p>
            </motion.div>

            {/* Notice if video file is not yet placed in /assets/crackers-blast.mp4 */}
            {videoLoadError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-sans max-w-md"
              >
                Place your crackers blast video as{' '}
                <span className="font-mono text-white">public/assets/crackers-blast.mp4</span>.
              </motion.div>
            )}

            {/* Automatic Transition Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="flex items-center gap-2 text-xs sm:text-sm font-cinzel tracking-widest text-amber-300/80 uppercase bg-black/50 px-4 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Entering Your Birthday Universe...</span>
              <Sparkles size={14} className="text-amber-400 animate-spin" />
            </motion.div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLEEK COMPACT BOTTOM PREVIEW BUTTON (MATCHING UPLOADED PHOTO)  */}
        {/* ============================================================== */}
        {stage === 'COUNTDOWN' && (
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex items-center justify-center z-30 pointer-events-auto px-4">
            <button
              onClick={() => setShowPinModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-cinzel font-medium tracking-[0.14em] text-amber-400/80 hover:text-amber-200 border border-white/10 hover:border-amber-400/50 bg-black/60 backdrop-blur-sm transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.6)] active:scale-95"
              title="Preview 10s Countdown (PIN: 4410)"
            >
              <span className="text-amber-400 text-xs leading-none">⚡</span>
              <span>PREVIEW 10S COUNTDOWN</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4-DIGIT PIN SECURITY KEYPAD MODAL (MATCHING UPLOADED UI)       */}
        {/* ============================================================== */}
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-[340px] sm:max-w-[360px] max-h-[92dvh] overflow-y-auto bg-[#0e0d16] border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col items-center select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowPinModal(false)
                  setEnteredPin('')
                  setPinState('idle')
                }}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Header Title & Subtitle (matching user uploaded image) */}
              <h3 className="text-lg font-medium text-white/95 text-center mt-1 mb-1">
                Choose a 4 Digit Password
              </h3>
              <p className="text-[11px] sm:text-xs text-white/45 text-center max-w-[260px] leading-relaxed mb-6 font-normal">
                This Password will be used as security measure to prevent unauthorized access
              </p>

              {/* 4 Digit Entry Boxes */}
              <motion.div
                animate={
                  pinState === 'error'
                    ? { x: [-12, 12, -8, 8, -4, 4, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3.5 mb-7"
              >
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = enteredPin.length > idx
                  const isActive = enteredPin.length === idx && pinState === 'idle'
                  const isSuccess = pinState === 'success'
                  const isError = pinState === 'error'

                  return (
                    <div
                      key={idx}
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        isError
                          ? 'border-2 border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : isSuccess
                          ? 'border-2 border-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                          : isActive
                          ? 'border-2 border-amber-400 bg-[#171624] shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                          : 'border border-white/5 bg-[#171624]'
                      }`}
                    >
                      {isFilled && (
                        <div
                          className={`w-3.5 h-3.5 rounded-full transition-transform scale-100 ${
                            isSuccess
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                              : isError
                              ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                              : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </motion.div>

              {/* Numeric Keypad Grid 3x4 (Matching user uploaded keypad UI) */}
              <div className="grid grid-cols-3 gap-y-3.5 gap-x-6 sm:gap-y-4 sm:gap-x-7 w-full max-w-[270px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, i) => {
                  if (key === '') {
                    return <div key={`empty-${i}`} className="w-16 h-16" />
                  }

                  if (key === 'delete') {
                    return (
                      <button
                        key="key-delete"
                        onClick={() => handleKeyPadPress('backspace')}
                        onMouseDown={() => setActiveKey('delete')}
                        onMouseUp={() => setActiveKey(null)}
                        onTouchStart={() => setActiveKey('delete')}
                        onTouchEnd={() => setActiveKey(null)}
                        className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-full text-white/80 hover:text-white transition-all cursor-pointer"
                        aria-label="Backspace"
                      >
                        {activeKey === 'delete' && (
                          <span className="absolute w-12 h-12 rounded-full bg-white/10 pointer-events-none" />
                        )}
                        <Delete size={24} className="stroke-[1.6]" />
                      </button>
                    )
                  }

                  return (
                    <button
                      key={`key-${key}`}
                      onClick={() => handleKeyPadPress(key)}
                      onMouseDown={() => setActiveKey(key)}
                      onMouseUp={() => setActiveKey(null)}
                      onTouchStart={() => setActiveKey(key)}
                      onTouchEnd={() => setActiveKey(null)}
                      className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-full text-white text-2xl sm:text-[28px] font-normal transition-all cursor-pointer"
                    >
                      {activeKey === key && (
                        <span className="absolute w-12 h-12 rounded-full bg-white/12 pointer-events-none" />
                      )}
                      <span>{key}</span>
                    </button>
                  )
                })}
              </div>

              {/* Feedback messages */}
              {pinState === 'error' && (
                <p className="mt-4 text-xs text-red-400 font-sans">
                  Incorrect PIN. Please try again.
                </p>
              )}
              {pinState === 'success' && (
                <p className="mt-4 text-xs text-emerald-400 font-sans flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>PIN Accepted! Starting Preview...</span>
                </p>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
