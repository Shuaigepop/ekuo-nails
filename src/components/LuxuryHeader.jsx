import React, { useRef } from 'react'

/**
 * Ultra-Minimalist Luxury Editorial Header
 * - Pure transparent background floating on deep emerald-obsidian viewport
 * - Brand logo cleanly on the top-left (Triple click triggers hidden Studio Admin Mode)
 * - Top-right CTA: Borderless architectural link button with refined serif typography,
 *   crisp moonlight silver text (#E2E6E5, 13px, letter-spacing: 0.2em),
 *   and a delicate 1px hairline silver underline that expands from left to right on hover.
 */
export default function LuxuryHeader({ onOpenBooking, hideCTA = false, onTriggerAdmin }) {
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)

  const handleLogoClick = () => {
    clickCountRef.current += 1
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      if (onTriggerAdmin) onTriggerAdmin()
      return
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 450)
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-6 sm:px-10 lg:px-14 py-5 sm:py-6 flex items-center justify-between pointer-events-auto bg-transparent">

      {/* Brand Typographic Identity — Pure Vector (Triple click triggers Admin) */}
      <div
        className="group cursor-pointer flex flex-col items-center transition-opacity duration-500 hover:opacity-80 select-none"
        onClick={handleLogoClick}
        title="Ekuo NAILS"
      >
        <div className="relative inline-flex items-center leading-none">
          <span
            className="font-serif text-[22px] sm:text-[26px] tracking-[0.06em] text-[#F4F7F6] font-medium"
            style={{ textShadow: '0 0 24px rgba(244, 247, 246, 0.2)' }}
          >
            Ekuo
          </span>
          <span className="relative -top-2 -ml-0.5 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-[#E2E6E5]/90 animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 5px rgba(226, 230, 229, 0.7))' }}
            >
              <path d="M12 0L14 8.5L23 12L14 15.5L12 24L10 15.5L1 12L10 8.5Z" />
            </svg>
          </span>
        </div>
        <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.5em] text-[#9A9E9D]/80 font-light mt-0.5 pl-[0.5em] text-center uppercase">
          NAILS
        </span>
      </div>

      {/* Haute Architectural Link Button (Zero yellow pill box, zero generic AI sparkle) */}
      <button
        onClick={onOpenBooking}
        className={`group relative inline-flex flex-col items-start pt-1 pb-0.5 transition-all duration-500 ${
          hideCTA ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 pointer-events-auto translate-y-0'
        }`}
      >
        {/* Moonlight Silver Text with Refined Serif */}
        <span
          className="text-[#E2E6E5] group-hover:text-white transition-colors duration-300 select-none pl-[0.18em] leading-tight"
          style={{
            fontFamily: "'Noto Serif TC', 'Cormorant Garamond', serif",
            fontSize: '13px',
            letterSpacing: '0.18em',
            fontWeight: 400,
          }}
        >
          預約起來！
        </span>

        {/* Delicate 1px Hairline Silver Underline Spaced 6px Below Text with Left-to-Right Hover Sweep */}
        <span className="relative w-full h-[1px] mt-[6px] bg-[rgba(226,230,229,0.35)] overflow-hidden">
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        </span>
      </button>

    </header>
  )
}
