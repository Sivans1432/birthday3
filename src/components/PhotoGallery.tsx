import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react'
import { BIRTHDAY_CONFIG, type PhotoItem } from '../config/birthdayData'

export const PhotoGallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const photos = BIRTHDAY_CONFIG.photos


  // Keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return
      if (e.key === 'Escape') setSelectedPhotoIndex(null)
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null))
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex, photos.length])

  // Reset zoom when switching photos
  useEffect(() => {
    setZoomLevel(1)
  }, [selectedPhotoIndex])


  return (
    <section id="memories" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
          <Heart size={14} className="text-rose-400 fill-rose-400" />
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200">
            Our Precious Memories
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-gold-bright tracking-tight">
          Captured Moments of Us ❤️
        </h2>

        <p className="text-amber-100/75 text-sm sm:text-base font-serif italic max-w-xl mx-auto">
          Every picture holds a timeless story, every glance holds a thousand feelings,
          and every single memory proves that you are my favorite person.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo, idx) => (
          <GalleryCard
            key={photo.id || idx}
            photo={photo}
            index={idx}
            onOpen={() => setSelectedPhotoIndex(idx)}
          />
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-black/70 sm:bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20"
              title="Close (Esc)"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhotoIndex((prev) =>
                  prev !== null ? (prev - 1 + photos.length) % photos.length : null
                )
              }}
              className="absolute left-2 sm:left-8 z-50 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 transition-all cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft size={22} className="sm:w-7 sm:h-7" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhotoIndex((prev) =>
                  prev !== null ? (prev + 1) % photos.length : null
                )
              }}
              className="absolute right-2 sm:right-8 z-50 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 transition-all cursor-pointer"
              title="Next photo"
            >
              <ChevronRight size={22} className="sm:w-7 sm:h-7" />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center bg-[#0d0a08]/95 border border-amber-500/40 rounded-2xl sm:rounded-3xl overflow-y-auto shadow-[0_0_80px_rgba(212,175,55,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div className="relative w-full max-h-[65vh] overflow-hidden flex items-center justify-center bg-black/80 p-2 sm:p-4">
                <img
                  src={photos[selectedPhotoIndex].src}
                  alt={photos[selectedPhotoIndex].title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl select-none transition-transform duration-300 shadow-2xl"
                  style={{ transform: `scale(${zoomLevel})` }}
                  onError={(e) => {
                    // Fallback to placeholder if not found
                    const target = e.currentTarget
                    target.src = '/assets/file_000000001fe4821196382939e7696d36.png'
                  }}
                />
              </div>

              {/* Caption & Details Footer */}
              <div className="w-full p-6 sm:p-8 bg-gradient-to-b from-[#140f0c] to-[#0a0806] border-t border-amber-500/30 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-xs font-semibold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30">
                      Memory {selectedPhotoIndex + 1} of {photos.length}
                    </span>
                    <span className="text-xs text-amber-200/60 flex items-center gap-1">
                      <Calendar size={13} />
                      {photos[selectedPhotoIndex].date}
                    </span>
                  </div>

                  <button
                    onClick={() => setZoomLevel((z) => (z === 1 ? 1.4 : 1))}
                    className="text-xs text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
                  >
                    {zoomLevel === 1 ? 'Zoom In (+)' : 'Reset Zoom (-)'}
                  </button>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
                  {photos[selectedPhotoIndex].title}
                </h3>

                <p className="text-sm sm:text-base text-amber-100/85 font-serif leading-relaxed">
                  {photos[selectedPhotoIndex].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// 3D Tilt Card Component
interface GalleryCardProps {
  photo: PhotoItem
  index: number
  onOpen: () => void
}

const GalleryCard: React.FC<GalleryCardProps> = ({ photo, index, onOpen }) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotateX(-y / 15)
    setRotateY(x / 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out'
      }}
      className="group relative cursor-pointer rounded-2xl p-3 bg-gradient-to-b from-[#18130e]/90 via-[#0f0c09] to-[#080605] border border-amber-500/25 hover:border-amber-400/60 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.08)] hover:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.22)] transition-all overflow-hidden flex flex-col"
    >
      {/* Gold metallic corner accents */}
      <span className="absolute top-2 left-2 text-[10px] text-amber-400/40 select-none">✦</span>
      <span className="absolute top-2 right-2 text-[10px] text-amber-400/40 select-none">✦</span>

      {/* Image container preserving original face geometry */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/60 border border-amber-500/20">
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          style={{ objectPosition: photo.objectPosition || 'center' }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            const target = e.currentTarget
            target.src = '/assets/file_000000001fe4821196382939e7696d36.png'
          }}
        />

        {/* Hover overlay with maximize icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <span className="text-xs font-cinzel text-amber-200/90 tracking-wider">
            Click to view full image
          </span>
          <div className="p-2 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200">
            <Maximize2 size={16} />
          </div>
        </div>

        {/* Date badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-400/20 text-[11px] font-sans text-amber-200/90">
          {photo.date}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 pt-4 text-left flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
            {photo.title}
          </h3>
          <p className="text-xs font-serif italic text-amber-200/70 mt-0.5 line-clamp-1">
            {photo.subtitle}
          </p>
        </div>

        <p className="text-xs text-amber-100/70 font-sans mt-2 line-clamp-2 leading-relaxed">
          {photo.caption}
        </p>
      </div>
    </motion.div>
  )
}
