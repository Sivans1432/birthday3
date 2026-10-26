import React, { useRef, useState, useCallback } from 'react'
import { BackgroundCanvas3D } from './components/BackgroundCanvas3D'
import { Navbar } from './components/Navbar'
import { CinematicIntro } from './components/CinematicIntro'
import { PhotoGallery } from './components/PhotoGallery'
import { Interactive3DCake } from './components/Interactive3DCake'
import { LoveTimeline } from './components/LoveTimeline'
import { LoveLetterSection } from './components/LoveLetterSection'
import { VirtualGiftBox } from './components/VirtualGiftBox'
import { FinalCelebration } from './components/FinalCelebration'
import { CinematicCountdownOverlay } from './components/CinematicCountdownOverlay'
import { romanticAudio } from './utils/audioManager'
import { BIRTHDAY_CONFIG } from './config/birthdayData'

export const App: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [isWebsiteRevealed, setIsWebsiteRevealed] = useState<boolean>(false)
  const [showCountdownOverlay, setShowCountdownOverlay] = useState<boolean>(true)

  const handleRevealComplete = useCallback(() => {
    setIsWebsiteRevealed(true)
    setShowCountdownOverlay(false)
    // Start romantic background music automatically after countdown celebration reveals website
    try {
      romanticAudio.play(BIRTHDAY_CONFIG.audio.src)
    } catch {
      // AudioContext fallback
    }
  }, [])

  const handleEnterSurprise = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-[#050403] w-full overflow-x-hidden">
      {/* 1. First Screen: Full-Screen Cinematic Countdown Overlay */}
      {showCountdownOverlay && (
        <CinematicCountdownOverlay onRevealComplete={handleRevealComplete} />
      )}

      {/* 2. Existing Birthday Website (Gated behind countdown reveal, zero flash) */}
      <div
        className={`relative min-h-screen bg-[#060504] text-[#f7eed7] selection:bg-amber-500/30 selection:text-amber-200 transition-opacity duration-1000 w-full overflow-x-hidden ${
          isWebsiteRevealed
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none fixed inset-0 overflow-hidden'
        }`}
      >
        {/* 3D WebGL Ambient Space (Only runs when website is revealed, saving 100% GPU during countdown & video) */}
        {isWebsiteRevealed && <BackgroundCanvas3D />}

        {/* Floating Luxury Navigation */}
        <Navbar onReplayIntro={handleReplay} />

        {/* Hero / Cinematic Intro Screen */}
        <main className="relative z-10">
          <section id="home">
            <CinematicIntro onEnterSurprise={handleEnterSurprise} />
          </section>

          {/* Anchor for smooth scroll after clicking 'Open Your Surprise' */}
          <div ref={mainContentRef} id="main-content" />

          {/* Section 1: Memories & Personal Photo Gallery */}
          <PhotoGallery />

          {/* Section 2: Interactive 3D Birthday Cake */}
          <Interactive3DCake />

          {/* Section 3: Our Love Story Timeline */}
          <LoveTimeline />

          {/* Section 4: Personal Love Letter in 3D Envelope */}
          <LoveLetterSection />

          {/* Section 5: Virtual Gift Box with 7 Promises */}
          <VirtualGiftBox />

          {/* Section 6: Grand Finale & 'You Are Special, Ammuuu ❤️' */}
          <FinalCelebration onReplay={handleReplay} />
        </main>
      </div>
    </div>
  )
}

export default App
