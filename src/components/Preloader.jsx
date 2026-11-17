import React, { useState, useEffect } from 'react'

/**
 * Ekuo NAILS - Haute Couture Preloader
 * Ultra-minimalist Liquid Silver & Obsidian-Emerald Loading Experience
 * - Deep emerald-obsidian background (#060907)
 * - Refined Cormorant Garamond typographic brandmark
 * - Single 1px hairline silver progress indicator
 * - 0.8s smooth opacity dissolve into the Hero stage
 */
export default function Preloader({ progress, isLoaded }) {
  const [shouldRender, setShouldRender] = useState(true)
  const [fadeState, setFadeState] = useState(false)

  useEffect(() => {
    if (isLoaded || progress >= 100) {
      // Graceful delay for luxurious transition
      const timer1 = setTimeout(() => setFadeState(true), 350)
      const timer2 = setTimeout(() => setShouldRender(false), 1200)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isLoaded, progress])

  if (!shouldRender) return null

  const displayProgress = Math.min(Math.round(progress), 100)

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#060907] flex flex-col items-center justify-center transition-opacity duration-800 ease-out select-none ${
        fadeState ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: '800ms' }}
    >
      <div className="relative flex flex-col items-center z-10">
        {/* Subtle Category Eyebrow */}
        <span className="font-sans text-[9px] tracking-[0.4em] text-[#6E7B77] uppercase font-light mb-4 select-none">
          ATELIER ARCHIVE
        </span>

        {/* Brandmark Typography (Cormorant Garamond 32px Liquid Silver #EEF2F1) */}
        <h1
          className="text-[32px] text-[#EEF2F1] font-normal leading-none tracking-[0.08em] select-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Ekuo
        </h1>

        {/* Brandmark Subtitle (9px, letter-spacing 0.45em, #8A9692) */}
        <span className="text-[9px] tracking-[0.45em] text-[#8A9692] uppercase font-sans font-light mt-1.5 select-none">
          — NAILS —
        </span>

        {/* Single Hairline Silver Progress Track (160px wide, 1px high) */}
        <div className="w-[160px] h-[1px] bg-[rgba(226,230,229,0.15)] mt-6 relative overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#E2E6E5] transition-all duration-200 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Minimal Italic Percentage Readout (13px, #8E9A96) */}
        <span className="font-serif italic text-[13px] text-[#8E9A96] tracking-wider mt-2.5 font-light">
          {displayProgress}<span className="text-[10px] text-[#6E7B77] font-sans not-italic ml-0.5">%</span>
        </span>
      </div>
    </div>
  )
}
