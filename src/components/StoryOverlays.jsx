import React, { useEffect, useRef, useCallback } from 'react'
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

  // Portfolio Archive Gallery (Ekuo 指尖私藏): 50% - 75%
  let portfolioOpacity = 0
  let portfolioTranslateY = 0
  let portfolioScale = 1

  if (progress >= 0.50 && progress <= 0.75) {
    if (progress < 0.55) {
      portfolioOpacity = (progress - 0.50) / 0.05
    } else if (progress <= 0.70) {
      portfolioOpacity = 1
    } else {
      // Gentle fade out cleanly before calendar enters, avoiding any desktop screen collision
      const exitT = (progress - 0.70) / 0.05
      portfolioOpacity = Math.max(0, 1 - exitT)
      portfolioTranslateY = exitT * -40
      portfolioScale = 1 - exitT * 0.02
    }
  }

  // Finale section: Calendar & Booking — Smoothly docks from 0.73, 100% full-screen from 0.79 to 1.00
  let calendarScrollProgress = 0
  if (progress > 0.73) {
    calendarScrollProgress = Math.min(1, Math.max(0, (progress - 0.73) / 0.06))
  }
  // Apple-grade cubic deceleration for natural physical inertia
  const easeProgress = 1 - Math.pow(1 - calendarScrollProgress, 3)
  const calendarTranslateY = (1 - easeProgress) * 100 // 100vh down to 0vh
  const calendarOpacity = Math.min(1, calendarScrollProgress / 0.4)
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
      {/* Editorial Leader Line with glowing pinpoint & Liquid Silver line */}
      {/* ================================================================= */}
      <div
        className="absolute flex items-center pointer-events-none select-none"
        style={{
          top: '32%',
          left: '2%',
          width: 'clamp(200px, 32.3vw, 620px)',
          transform: `translateY(-50%) translateX(${(1 - layer3Opacity) * -20}px)`,
          opacity: layer3Opacity,
          visibility: layer3Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div className="flex-shrink-0 text-right pr-2.5 sm:pr-4 select-none max-w-[135px] sm:max-w-[210px]">
          <span className="block font-serif italic text-[12px] sm:text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">
            03
          </span>
          <span
            className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]"
            style={{
              fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.2vw, 18px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            水光鏡面封層
          </span>
          <span
            className="block font-sans text-[10px] sm:text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-0.5 sm:mt-1 select-none"
            style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)' }}
          >
            清透抗刮，持久鎖光
          </span>
        </div>
        <div
          className="flex-1 h-[1px] min-w-[24px] sm:min-w-[32px]"
          style={{
            background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.15), rgba(226, 230, 229, 0.65))',
          }}
        />
        <div
          className="flex-shrink-0 rounded-full"
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#EEF2F1',
            boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.95), 0 0 2px #FFFFFF',
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* SECTION 3: Middle Row — 02 (Relief/Cat-Eye)                      */}
      {/* ================================================================= */}
      <div
        className="absolute flex items-center justify-end pointer-events-none select-none"
        style={{
          top: '51.5%',
          right: '2%',
          width: 'clamp(200px, 32.2vw, 640px)',
          transform: `translateY(-50%) translateX(${(1 - layer2Opacity) * 20}px)`,
          opacity: layer2Opacity,
          visibility: layer2Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div
          className="flex-shrink-0 rounded-full"
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#EEF2F1',
            boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.95), 0 0 2px #FFFFFF',
          }}
        />
        <div
          className="flex-1 h-[1px] min-w-[24px] sm:min-w-[36px]"
          style={{
            background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.65), rgba(226, 230, 229, 0.15))',
          }}
        />
        <div className="flex-shrink-0 text-left pl-2.5 sm:pl-4 select-none max-w-[135px] sm:max-w-[210px]">
          <span className="block font-serif italic text-[12px] sm:text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">
            02
          </span>
          <span
            className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]"
            style={{
              fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.2vw, 18px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            手繪浮雕與貓眼
          </span>
          <span
            className="block font-sans text-[10px] sm:text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-0.5 sm:mt-1 select-none"
            style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)' }}
          >
            一筆一畫堆疊立體金屬
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 4: Bottom Row — 01 (Nude Base)                            */}
      {/* ================================================================= */}
      <div
        className="absolute flex items-center pointer-events-none select-none"
        style={{
          top: '71%',
          left: '2%',
          width: 'clamp(200px, 31.9vw, 610px)',
          transform: `translateY(-50%) translateX(${(1 - layer1Opacity) * -20}px)`,
          opacity: layer1Opacity,
          visibility: layer1Opacity > 0.02 ? 'visible' : 'hidden',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div className="flex-shrink-0 text-right pr-2.5 sm:pr-4 select-none max-w-[135px] sm:max-w-[210px]">
          <span className="block font-serif italic text-[12px] sm:text-[14px] tracking-[0.25em] text-[#8BB0A5] uppercase mb-0.5">
            01
          </span>
          <span
            className="block leading-snug drop-shadow-md select-none text-[#F4F7F6]"
            style={{
              fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.2vw, 18px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            溫和護甲打底
          </span>
          <span
            className="block font-sans text-[10px] sm:text-[13px] tracking-[0.04em] text-[#B8C2BF] font-light mt-0.5 sm:mt-1 select-none"
            style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)' }}
          >
            貼合原生甲面，不傷真甲
          </span>
        </div>
        <div
          className="flex-1 h-[1px] min-w-[24px] sm:min-w-[32px]"
          style={{
            background: 'linear-gradient(90deg, rgba(226, 230, 229, 0.15), rgba(226, 230, 229, 0.65))',
          }}
        />
        <div
          className="flex-shrink-0 rounded-full"
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#EEF2F1',
            boxShadow: '0 0 8px 1px rgba(238, 242, 241, 0.95), 0 0 2px #FFFFFF',
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* SECTION 4.5: Portfolio Archive Gallery (Editorial Lookbook)        */}
      {/* pointer-events on children only — scroll always goes to window    */}
      {/* ================================================================= */}
      <div
        id="portfolio-scroll-container"
        className="absolute inset-0 w-full max-w-full flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 pt-[85px] sm:pt-[95px] overflow-hidden bg-[#070b09]"
        style={{
          transform: `translate3d(0, ${portfolioTranslateY}px, 0) scale(${portfolioScale})`,
          opacity: portfolioOpacity,
          visibility: portfolioOpacity > 0.01 ? 'visible' : 'hidden',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          zIndex: 20,
        }}
      >
        <div
          className="w-full max-w-6xl flex justify-center my-auto pb-12"
          style={{
            pointerEvents: portfolioOpacity > 0.5 && calendarScrollProgress < 0.5 ? 'auto' : 'none',
          }}
        >
          <PortfolioSection
            onSelectDesign={onSelectDesign}
            isAdminMode={isAdminMode}
          />
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 5: Finale — Edge-to-Edge Emerald Obsidian Schedule       */}
      {/* During slide-up transition: pointer-events:none → scroll goes to window */}
      {/* Once fully docked (easeProgress≈1): allow internal scroll for calendar content */}
      {/* ================================================================= */}
      {(() => {
        const isFullyDocked = easeProgress > 0.97
        return (
          <div
            id="calendar-scroll-container"
            className={`absolute inset-0 w-full max-w-full flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 pt-[70px] sm:pt-[75px] bg-[#070b09] border-t sm:border-t-0 border-[#E2E6E5]/20 shadow-[0_-35px_100px_rgba(0,0,0,0.95)] sm:shadow-none ${isFullyDocked ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}
            style={{
              transform: `translate3d(0, ${calendarTranslateY}vh, 0)`,
              opacity: calendarOpacity,
              visibility: isCalendarVisible ? 'visible' : 'hidden',
              pointerEvents: isFullyDocked ? 'auto' : 'none',
              willChange: isFullyDocked ? 'auto' : 'transform, opacity',
              zIndex: 30,
              ...(isFullyDocked ? { overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' } : {}),
            }}
          >
            {/* Subtle Architectural Sheet Grab Bar (Mobile only) */}
            <div className="w-12 h-1 rounded-full bg-[#E2E6E5]/25 mx-auto mb-3 flex-shrink-0 sm:hidden" />

            <div className="w-full max-w-4xl flex justify-center pb-12 sm:pb-8 my-auto sm:my-0">
              <BookingCalendarCard
                onScrollTo={onScrollTo}
                isAdminMode={isAdminMode}
                selectedDesign={selectedDesign}
                onClearDesign={onClearDesign}
              />
            </div>
          </div>
        )
      })()}

    </div>
  )
}
