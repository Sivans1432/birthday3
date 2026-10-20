import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Calendar, Star, Gift, Compass } from 'lucide-react'
import { BIRTHDAY_CONFIG, type TimelineMilestone } from '../config/birthdayData'


export const LoveTimeline: React.FC = () => {
  const milestones = BIRTHDAY_CONFIG.timeline

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart size={16} className="text-rose-400 fill-rose-400" />
      case 'sparkles':
        return <Sparkles size={16} className="text-amber-400" />
      case 'star':
        return <Star size={16} className="text-amber-300 fill-amber-300" />
      case 'gift':
        return <Gift size={16} className="text-rose-400" />
      default:
        return <Calendar size={16} className="text-amber-400" />
    }
  }

  return (
    <section id="story" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md">
          <Compass size={14} className="text-amber-400" />
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-amber-200">
            Our Love Story
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-gold-bright tracking-tight">
          Chapters of You & Me ❤️
        </h2>

        <p className="text-amber-100/75 text-sm sm:text-base font-serif italic max-w-lg mx-auto">
          From the day our paths crossed to our future birthdays hand in hand.
        </p>
      </div>

      {/* Timeline Vertical Track */}
      <div className="relative">
        {/* Golden Central Line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-400/80 via-amber-500/40 to-rose-500/80 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />

        <div className="space-y-12">
          {milestones.map((item, idx) => {
            const isEven = idx % 2 === 0
            return (
              <TimelineCard
                key={item.id}
                item={item}
                index={idx}
                isEven={isEven}
                icon={getIcon(item.iconName)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface TimelineCardProps {
  item: TimelineMilestone
  index: number
  isEven: boolean
  icon: React.ReactNode
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, index, isEven, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row items-start ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Golden Node on the Line */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 z-10 w-9 h-9 rounded-full bg-[#120e0a] border-2 border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.6)]">
        {icon}
      </div>

      {/* Content Container */}
      <div className="ml-12 md:ml-0 md:w-1/2 md:px-8 w-full">
        <div
          className={`p-6 sm:p-7 rounded-2xl gold-card gold-card-hover border ${
            item.highlight ? 'border-amber-400/60 shadow-[0_0_30px_rgba(212,175,55,0.18)]' : 'border-amber-500/25'
          } relative overflow-hidden`}
        >
          {/* Milestone Date Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-cinzel font-semibold tracking-wider uppercase bg-amber-950/70 border border-amber-500/40 text-amber-300">
              {item.date}
            </span>
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1">
            {item.title}
          </h3>

          <p className="font-serif italic text-xs sm:text-sm text-amber-200/70 mb-3">
            {item.subtitle}
          </p>

          <p className="font-sans text-sm sm:text-base text-amber-100/80 leading-relaxed">
            {item.description}
          </p>

          {/* Optional attached milestone image */}
          {item.image && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-amber-500/40 bg-black/80 shadow-2xl group/img relative">
              <img
                src={item.image}
                alt={item.title}
                style={{ objectPosition: item.objectPosition || 'center' }}
                className="w-full h-72 sm:h-80 md:h-88 object-cover transition-transform duration-700 group-hover/img:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-[11px] font-cinzel text-amber-200 shadow-lg flex items-center gap-1.5">
                <span className="text-rose-400">♥</span>
                <span>{item.imageBadge || 'Our Memory'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
