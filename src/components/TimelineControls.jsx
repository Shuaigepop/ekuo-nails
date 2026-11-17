import React, { useEffect, useState } from 'react'

/**
 * Apple-Style Ultra-Minimalist Scroll Indicator
 * - Single 1px vertical animated hairline at bottom center
 * - Subtle champagne-gold gradient with descending light pulse
 * - Smoothly fades out the moment the user scrolls
 */
export default function TimelineControls({ progress }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Fade out once user scrolls past 2%
    if (progress > 0.02) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [progress])

  return (
    <div
      className="fixed bottom-7 inset-x-0 z-40 flex flex-col items-center pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Minimal "SCROLL" label */}
      <span
        className="font-sans text-[9px] tracking-[0.35em] text-[#B3B3B8]/40 font-light uppercase mb-3 select-none"
        style={{ writingMode: 'vertical-rl' }}
      >
        SCROLL
      </span>

      {/* 1px Animated Hairline in Moonlit Silver */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '1px',
          height: '38px',
          background: 'linear-gradient(180deg, rgba(226, 230, 229, 0.45) 0%, rgba(226, 230, 229, 0.08) 100%)',
        }}
      >
        {/* Descending light pulse */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            height: '12px',
            background: 'linear-gradient(180deg, rgba(244, 247, 246, 0.95) 0%, rgba(226, 230, 229, 0) 100%)',
            animation: 'scrollPulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          }}
        />
      </div>
    </div>
  )
}
