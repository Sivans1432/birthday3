import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Sparkles, Music, Menu, X } from 'lucide-react'
import { BIRTHDAY_CONFIG } from '../config/birthdayData'
import { romanticAudio } from '../utils/audioManager'
import { triggerGrandCelebration, triggerGoldenSparks } from '../utils/confettiFireworks'

interface NavbarProps {
  onReplayIntro: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro }) => {

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.7)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMusic = () => {
    const nowPlaying = romanticAudio.toggle(BIRTHDAY_CONFIG.audio.src)
    setIsPlaying(nowPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    romanticAudio.setVolume(val)
  }

  const handleCelebrate = () => {
    triggerGoldenSparks(0.5, 0.4)
    triggerGrandCelebration()
  }

  const navLinks = [
    { label: 'Memories', href: '#memories' },
    { label: '3D Cake', href: '#cake' },
    { label: 'Our Story', href: '#story' },
    { label: 'Love Letter', href: '#letter' },
    { label: 'Gift Box', href: '#gift' }
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#080605]/85 backdrop-blur-xl border-b border-amber-500/25 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            onReplayIntro()
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center font-cinzel font-bold text-amber-950 text-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel text-sm font-bold tracking-widest text-gold-bright">
              MOUNIKA
            </span>
            <span className="font-serif italic text-[11px] text-rose-400">
              My Ammuuu ❤️
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-cinzel tracking-[0.18em] uppercase text-amber-100/80 hover:text-amber-300 transition-colors relative py-1 group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-rose-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Celebrate Button */}
          <button
            onClick={handleCelebrate}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-cinzel tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
            title="Trigger celebratory fireworks and confetti"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Celebrate Ammuuu</span>
          </button>

          {/* Music Controller Button */}
          <div className="relative">
            <button
              onClick={toggleMusic}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
                isPlaying
                  ? 'border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'border-white/15 bg-black/40 text-amber-200/70 hover:border-amber-400/40'
              }`}
              title={isPlaying ? 'Pause romantic music' : 'Play romantic music'}
            >
              {isPlaying ? (
                <>
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s] h-4" />
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s] h-2" />
                  </div>
                  <span className="hidden lg:inline text-xs font-cinzel tracking-wider uppercase">
                    Playing Music
                  </span>
                </>
              ) : (
                <>
                  <Music size={15} />
                  <span className="hidden lg:inline text-xs font-cinzel tracking-wider uppercase">
                    Play Song
                  </span>
                </>
              )}
            </button>

            {/* Hover Volume Slider Popover */}
            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute right-0 top-full mt-2 p-3 rounded-xl bg-black/90 border border-amber-500/40 shadow-2xl flex items-center gap-2 z-50 min-w-[140px]"
              >
                <button
                  onClick={() => {
                    const newVol = volume === 0 ? 0.7 : 0
                    setVolume(newVol)
                    romanticAudio.setVolume(newVol)
                  }}
                  className="text-amber-300 hover:text-white"
                >
                  {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-amber-400 h-1 bg-white/20 rounded cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-200 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0806]/98 border-b border-amber-500/30 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-cinzel text-sm uppercase tracking-widest text-amber-200/90 hover:text-amber-400 py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              handleCelebrate()
              setMobileMenuOpen(false)
            }}
            className="w-full mt-3 py-3 rounded-full bg-gold-btn text-amber-950 font-cinzel font-bold text-xs uppercase tracking-wider"
          >
            🎉 Celebrate Ammuuu
          </button>
        </div>
      )}
    </header>
  )
}
