import React, { useRef } from 'react'
import { BackgroundCanvas3D } from './components/BackgroundCanvas3D'
import { Navbar } from './components/Navbar'
import { CinematicIntro } from './components/CinematicIntro'
import { PhotoGallery } from './components/PhotoGallery'
import { Interactive3DCake } from './components/Interactive3DCake'
import { LoveTimeline } from './components/LoveTimeline'
import { LoveLetterSection } from './components/LoveLetterSection'
import { VirtualGiftBox } from './components/VirtualGiftBox'
import { FinalCelebration } from './components/FinalCelebration'

export const App: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null)

  const handleEnterSurprise = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-[#060504] text-[#f7eed7] selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3D WebGL Ambient Space (Floating sparkles, rose petals, rotating rings) */}
      <BackgroundCanvas3D />

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
  )
}

export default App
