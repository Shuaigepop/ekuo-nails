import React from 'react'
import BookingCalendarCard from './BookingCalendarCard'
import PortfolioSection from './PortfolioSection'

// Smooth opacity curve helper
function getCardOpacity(progress, enter, peakStart, peakEnd, exit) {
  if (progress < enter || progress > exit) return 0
  if (progress >= peakStart && progress <= peakEnd) return 1
  if (progress < peakStart) {
    return (progress - enter) / (peakStart - enter)
  }
  return (exit - progress) / (exit - peakEnd)
}

/**
 * Ekuo NAILS - Cinematic Scroll Story Overlays
 * Sequence Chapters:
 * 1. Hero headline: 0% - 26%
 * 2. 3D Exploded Layer Callouts: 26% - 58%
 * 3. Haute Couture Archive Portfolio (Editorial Lookbook): 58% - 85%
 * 4. Liquid Silver Appointment Calendar & Booking: 85% - 100%
 */
export default function StoryOverlays({
  progress,
  onScrollTo,
  isAdminMode = false,
  selectedDesign = '',
  onSelectDesign,
  onClearDesign,
}) {
  // Hero section opacity: 0% - 24%
  const heroOpacity = getCardOpacity(progress, 0, 0, 0.16, 0.23)

  // Exploded rows callouts opacity: 23% - 47% (fades cleanly before 3D canvas dissolves at 48%-52%)
  const layer3Opacity = getCardOpacity(progress, 0.23, 0.30, 0.43, 0.47)
  const layer2Opacity = getCardOpacity(progress, 0.25, 0.32, 0.43, 0.47)
  const layer1Opacity = getCardOpacity(progress, 0.27, 0.34, 0.43, 0.47)

  // Portfolio Archive Gallery (EMMA 指尖私藏): 52% - 88%
  let portfolioOpacity = 0
  let portfolioTranslateY = 0
  let portfolioScale = 1

  if (progress >= 0.52 && progress <= 0.88) {
    if (progress < 0.57) {
      portfolioOpacity = (progress - 0.52) / 0.05
    } else if (progress <= 0.72) {
      portfolioOpacity = 1
    } else {
      // Gentle fade out and subtle upward drift as calendar rises from below
      const exitT = Math.min(1, (progress - 0.72) / 0.16)
      portfolioOpacity = Math.max(0, 1 - exitT)
      portfolioTranslateY = exitT * -60
      portfolioScale = 1 - exitT * 0.03
    }
  }

  // Finale section: Calendar & Booking — Slowly rises up from bottom (0.72 - 0.90)
  let calendarScrollProgress = 0
  if (progress > 0.72) {
    calendarScrollProgress = Math.min(1, Math.max(0, (progress - 0.72) / 0.18))
  }
  // Apple-grade cubic deceleration for natural physical inertia
  const easeProgress = 1 - Math.pow(1 - calendarScrollProgress, 3)
  const calendarTranslateY = (1 - easeProgress) * 100 // 100vh down to 0vh
  const calendarOpacity = Math.min(1, calendarScrollProgress / 0.12)
  const isCalendarVisible = calendarScrollProgress > 0.005

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">

      {/* ================================================================= */}
      {/* SECTION 1: Hero Headline — Positioned ABOVE the nails (top: 23%)  */}
      {/* ================================================================= */}
      <div
        className="absolute inset-x-0 flex justify-center px-6"
        style={{
          top: '23%',
          transform: `translateY(-50%) translateY(${(1 - heroOpacity) * 20}px)`,
          opacity: heroOpacity,
          visibility: heroOpacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <h1
          className="text-center leading-tight select-none"
          style={{
            fontFamily: "'Noto Serif TC', 'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 4.4vw, 4rem)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: '#F2F5F4',
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.75), 0 0 36px rgba(242, 245, 244, 0.25)',
          }}
        >
          True beauty is beyond definition
        </h1>
      </div>

      {/* ================================================================= */}
      {/* SECTION 2: Top Row — 03 (Topcoat)                                */}
      {/* Desktop: full callout with leader line. Mobile: compact label.    */}
      {/* ================================================================= */}
      {/* Desktop callout */}
      <div
        className="absolute hidden sm:flex items-center pointer-events-none select-none"
        style={{
          top: '32%',
          left: '2%',
          width: 'clamp(280px, 32.3vw, 620px)',
          transform: `translateY(-50%) translateX(${(1 - layer3Opacity) * -20}px)`,
          opacity: layer3Opacity,
          visibility: layer3Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div className="flex-shrink-0 text-right pr-4 select-none max-w-[210px]">
          <span className="block font-serif italic text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">03</span>
          <span className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]" style={{ fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif", fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 500, letterSpacing: '0.06em', textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)' }}>水光鏡面封層</span>
          <span className="block font-sans text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-1 select-none">清透抗刮，持久鎖光</span>
        </div>
        <div className="flex-1 h-[1px] min-w-[32px]" style={{ background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.15), rgba(226, 230, 229, 0.55))' }} />
        <div className="flex-shrink-0 rounded-full" style={{ width: '4px', height: '4px', backgroundColor: '#EEF2F1', boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.9), 0 0 2px #FFFFFF' }} />
      </div>
      {/* Mobile compact label */}
      <div
        className="absolute flex sm:hidden items-center pointer-events-none select-none"
        style={{
          top: '25%',
          left: '4%',
          transform: `translateY(-50%)`,
          opacity: layer3Opacity,
          visibility: layer3Opacity > 0.02 ? 'visible' : 'hidden',
        }}
      >
        <div className="px-2.5 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(7, 11, 9, 0.75)', backdropFilter: 'blur(8px)' }}>
          <span className="block font-serif italic text-[10px] tracking-[0.2em] text-[#8BB0A5] uppercase">03</span>
          <span className="block font-serif text-[12px] text-[#F4F7F6] font-medium leading-tight" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>水光鏡面封層</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 3: Middle Row — 02 (Relief/Cat-Eye)                      */}
      {/* ================================================================= */}
      {/* Desktop callout */}
      <div
        className="absolute hidden sm:flex items-center justify-end pointer-events-none select-none"
        style={{
          top: '51.5%',
          right: '2%',
          width: 'clamp(300px, 32.2vw, 640px)',
          transform: `translateY(-50%) translateX(${(1 - layer2Opacity) * 20}px)`,
          opacity: layer2Opacity,
          visibility: layer2Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div className="flex-shrink-0 rounded-full" style={{ width: '4px', height: '4px', backgroundColor: '#EEF2F1', boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.9), 0 0 2px #FFFFFF' }} />
        <div className="flex-1 h-[1px] min-w-[36px]" style={{ background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.55), rgba(226, 230, 229, 0.15))' }} />
        <div className="flex-shrink-0 text-left pl-4 select-none max-w-[210px]">
          <span className="block font-serif italic text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">02</span>
          <span className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]" style={{ fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif", fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 500, letterSpacing: '0.06em', textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)' }}>手繪浮雕與貓眼流光</span>
          <span className="block font-sans text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-1 select-none">一筆一畫堆疊立體金屬紋理</span>
        </div>
      </div>
      {/* Mobile compact label */}
      <div
        className="absolute flex sm:hidden items-center pointer-events-none select-none"
        style={{
          top: '45%',
          right: '4%',
          transform: `translateY(-50%)`,
          opacity: layer2Opacity,
          visibility: layer2Opacity > 0.02 ? 'visible' : 'hidden',
        }}
      >
        <div className="px-2.5 py-1.5 rounded-md text-right" style={{ backgroundColor: 'rgba(7, 11, 9, 0.75)', backdropFilter: 'blur(8px)' }}>
          <span className="block font-serif italic text-[10px] tracking-[0.2em] text-[#8BB0A5] uppercase">02</span>
          <span className="block font-serif text-[12px] text-[#F4F7F6] font-medium leading-tight" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>手繪浮雕與貓眼</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 4: Bottom Row — 01 (Nude Base)                            */}
      {/* ================================================================= */}
      {/* Desktop callout */}
      <div
        className="absolute hidden sm:flex items-center pointer-events-none select-none"
        style={{
          top: '71%',
          left: '2%',
          width: 'clamp(280px, 31.9vw, 610px)',
          transform: `translateY(-50%) translateX(${(1 - layer1Opacity) * -20}px)`,
          opacity: layer1Opacity,
          visibility: layer1Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div className="flex-shrink-0 text-right pr-4 select-none max-w-[210px]">
          <span className="block font-serif italic text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">01</span>
          <span className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]" style={{ fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif", fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 500, letterSpacing: '0.06em', textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)' }}>溫和護甲打底</span>
          <span className="block font-sans text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-1 select-none">貼合原生甲面，不傷真甲</span>
        </div>
        <div className="flex-1 h-[1px] min-w-[32px]" style={{ background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.15), rgba(226, 230, 229, 0.55))' }} />
        <div className="flex-shrink-0 rounded-full" style={{ width: '4px', height: '4px', backgroundColor: '#EEF2F1', boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.9), 0 0 2px #FFFFFF' }} />
      </div>
      {/* Mobile compact label */}
      <div
        className="absolute flex sm:hidden items-center pointer-events-none select-none"
        style={{
          top: '72%',
          left: '4%',
          transform: `translateY(-50%)`,
          opacity: layer1Opacity,
          visibility: layer1Opacity > 0.02 ? 'visible' : 'hidden',
        }}
      >
        <div className="px-2.5 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(7, 11, 9, 0.75)', backdropFilter: 'blur(8px)' }}>
          <span className="block font-serif italic text-[10px] tracking-[0.2em] text-[#8BB0A5] uppercase">01</span>
          <span className="block font-serif text-[12px] text-[#F4F7F6] font-medium leading-tight" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>溫和護甲打底</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 4.5: Portfolio Archive Gallery (Editorial Lookbook)        */}
      {/* Subtly floats upward and recedes as the calendar rises from below */}
      {/* ================================================================= */}
      <div
        id="portfolio-scroll-container"
        className="absolute inset-0 w-full max-w-full flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 pt-[85px] sm:pt-[95px] overflow-y-auto bg-[#070b09]"
        style={{
          transform: `translate3d(0, ${portfolioTranslateY}px, 0) scale(${portfolioScale})`,
          opacity: portfolioOpacity,
          visibility: portfolioOpacity > 0.01 ? 'visible' : 'hidden',
          pointerEvents: portfolioOpacity > 0.5 && calendarScrollProgress < 0.5 ? 'auto' : 'none',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
          zIndex: 20,
        }}
      >
        <div className="w-full max-w-6xl flex justify-center my-auto pb-12">
          <PortfolioSection
            onSelectDesign={onSelectDesign}
            isAdminMode={isAdminMode}
          />
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 5: Finale — Edge-to-Edge Emerald Obsidian Schedule       */}
      {/* Slowly rises up from bottom (慢慢往上) with luxury architectural sheet*/}
      {/* ================================================================= */}
      <div
        id="calendar-scroll-container"
        className="absolute inset-0 w-full max-w-full flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 pt-[75px] sm:pt-[85px] overflow-y-auto bg-[#070b09] border-t border-[#E2E6E5]/20 shadow-[0_-35px_100px_rgba(0,0,0,0.95)]"
        style={{
          transform: `translate3d(0, ${calendarTranslateY}vh, 0)`,
          opacity: calendarOpacity,
          visibility: isCalendarVisible ? 'visible' : 'hidden',
          pointerEvents: calendarScrollProgress > 0.5 ? 'auto' : 'none',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
          zIndex: 30,
        }}
      >
        {/* Subtle Architectural Sheet Grab Bar */}
        <div className="w-12 h-1 rounded-full bg-[#E2E6E5]/25 mx-auto mb-3 flex-shrink-0" />

        <div className="w-full max-w-4xl flex justify-center my-auto pb-10">
          <BookingCalendarCard
            onScrollTo={onScrollTo}
            isAdminMode={isAdminMode}
            selectedDesign={selectedDesign}
            onClearDesign={onClearDesign}
          />
        </div>
      </div>

    </div>
  )
}
