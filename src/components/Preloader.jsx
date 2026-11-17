import React, { useState, useEffect } from 'react'
import { Diamond } from 'lucide-react'
import { resolveAsset } from '../utils/assetPath'

export default function Preloader({ progress, isLoaded }) {
  const [shouldRender, setShouldRender] = useState(true)
  const [fadeState, setFadeState] = useState(false)

  useEffect(() => {
    if (isLoaded || progress >= 100) {
      // Graceful delay for luxurious transition
      const timer1 = setTimeout(() => setFadeState(true), 400)
      const timer2 = setTimeout(() => setShouldRender(false), 1200)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isLoaded, progress])

  if (!shouldRender) return null

  const strokeDashoffset = 283 - (283 * Math.min(progress, 100)) / 100

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070709] flex flex-col items-center justify-center transition-all duration-700 ease-out select-none ${
        fadeState ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Subtle Luxury Radial Light */}
      <div className="absolute w-[500px] h-[500px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center z-10">
        {/* Animated Circular Progress Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="rgba(245, 243, 239, 0.05)"
              strokeWidth="2"
            />
            {/* Golden Active Progress Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))',
              }}
            />
          </svg>

          {/* Center Brand Logo & Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <img
              src={resolveAsset('ekuo-logo.png')}
              alt="Ekuo NAILS"
              className="h-11 w-auto object-contain mix-blend-screen mb-1"
            />
            <span className="font-serif italic text-base font-normal text-[#F5F3EF] tracking-wider">
              {progress}<span className="text-[10px] text-[#B3B3B8] font-sans ml-0.5 not-italic">%</span>
            </span>
          </div>
        </div>

        {/* Exhibition Tag */}
        <div className="text-center mt-2">
          <p className="font-sans text-[10px] tracking-[0.35em] text-[#B3B3B8] uppercase font-light">
            HAUTE 3D NAIL EXHIBITION
          </p>
        </div>

        {/* Elegant Micro-bar */}
        <div className="w-48 h-[1px] bg-stone-900 mt-6 relative overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-champagne to-transparent transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
