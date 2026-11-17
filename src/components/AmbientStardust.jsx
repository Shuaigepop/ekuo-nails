import React, { useMemo } from 'react'

/**
 * Ekuo NAILS - Ambient Haute Stardust Particles
 * 32 delicate, floating micro-crystals of champagne gold, moonlight silver, and emerald jade.
 * Active strictly during the Hero chapter, softly fading out as user scrolls down.
 */
export default function AmbientStardust({ opacity = 1 }) {
  // Pre-generate stable, deterministic particle coordinates & animation parameters for 32 particles
  const particles = useMemo(() => {
    return [
      // Left Upper Atmosphere
      { id: 1, left: '12%', top: '22%', size: 1.5, color: '#F4F7F6', duration: 8.5, delay: 0.2, driftX: 12 },
      { id: 2, left: '18%', top: '36%', size: 2.0, color: '#D4AF37', duration: 11.0, delay: 1.5, driftX: -8 },
      { id: 3, left: '25%', top: '16%', size: 1.2, color: '#E2E6E5', duration: 7.8, delay: 3.2, driftX: 6 },
      { id: 4, left: '8%', top: '28%', size: 1.6, color: '#8BB0A5', duration: 10.8, delay: 3.8, driftX: -9 },
      { id: 5, left: '14%', top: '46%', size: 1.4, color: '#FAF6E9', duration: 9.6, delay: 2.4, driftX: 8 },
      { id: 6, left: '22%', top: '28%', size: 1.8, color: '#D4AF37', duration: 12.2, delay: 0.9, driftX: -11 },
      { id: 7, left: '6%', top: '42%', size: 1.3, color: '#F4F7F6', duration: 8.2, delay: 4.1, driftX: 7 },
      { id: 8, left: '28%', top: '38%', size: 2.2, color: '#8BB0A5', duration: 13.5, delay: 1.8, driftX: -14 },

      // Right Upper Atmosphere
      { id: 9, left: '82%', top: '24%', size: 1.8, color: '#8BB0A5', duration: 9.2, delay: 0.8, driftX: -14 },
      { id: 10, left: '88%', top: '38%', size: 2.2, color: '#FAF6E9', duration: 12.5, delay: 2.1, driftX: 10 },
      { id: 11, left: '74%', top: '18%', size: 1.6, color: '#D4AF37', duration: 10.4, delay: 0.5, driftX: -10 },
      { id: 12, left: '92%', top: '28%', size: 1.4, color: '#D4AF37', duration: 9.5, delay: 4.5, driftX: 12 },
      { id: 13, left: '78%', top: '34%', size: 1.3, color: '#E2E6E5', duration: 8.0, delay: 3.0, driftX: 9 },
      { id: 14, left: '85%', top: '48%', size: 1.9, color: '#F4F7F6', duration: 11.8, delay: 1.3, driftX: -8 },
      { id: 15, left: '94%', top: '44%', size: 1.5, color: '#8BB0A5', duration: 10.2, delay: 5.2, driftX: -12 },
      { id: 16, left: '72%', top: '44%', size: 2.0, color: '#D4AF37', duration: 12.8, delay: 2.8, driftX: 11 },

      // Center Upper Crown (Above Headline & Above Nails)
      { id: 17, left: '38%', top: '14%', size: 1.2, color: '#D4AF37', duration: 8.2, delay: 1.2, driftX: 5 },
      { id: 18, left: '62%', top: '15%', size: 1.5, color: '#F4F7F6', duration: 11.2, delay: 2.9, driftX: -8 },
      { id: 19, left: '48%', top: '11%', size: 1.4, color: '#8BB0A5', duration: 9.0, delay: 4.7, driftX: 6 },
      { id: 20, left: '54%', top: '18%', size: 1.3, color: '#FAF6E9', duration: 10.6, delay: 0.6, driftX: -7 },

      // Left Lower Ambient Zone
      { id: 21, left: '15%', top: '68%', size: 2.0, color: '#8BB0A5', duration: 13.0, delay: 4.0, driftX: 8 },
      { id: 22, left: '30%', top: '78%', size: 1.4, color: '#D4AF37', duration: 11.5, delay: 2.7, driftX: 15 },
      { id: 23, left: '22%', top: '84%', size: 1.6, color: '#FAF6E9', duration: 10.0, delay: 5.0, driftX: 10 },
      { id: 24, left: '9%', top: '74%', size: 1.3, color: '#F4F7F6', duration: 8.8, delay: 1.7, driftX: -6 },
      { id: 25, left: '26%', top: '64%', size: 1.7, color: '#D4AF37', duration: 12.0, delay: 3.4, driftX: -10 },
      { id: 26, left: '18%', top: '82%', size: 1.5, color: '#8BB0A5', duration: 9.4, delay: 2.0, driftX: 9 },

      // Right Lower Ambient Zone
      { id: 27, left: '85%', top: '66%', size: 1.5, color: '#F4F7F6', duration: 8.9, delay: 1.8, driftX: -12 },
      { id: 28, left: '70%', top: '76%', size: 1.8, color: '#E2E6E5', duration: 9.8, delay: 3.5, driftX: -6 },
      { id: 29, left: '78%', top: '82%', size: 2.0, color: '#8BB0A5', duration: 12.0, delay: 0.1, driftX: -15 },
      { id: 30, left: '91%', top: '72%', size: 1.4, color: '#D4AF37', duration: 10.5, delay: 4.3, driftX: 11 },
      { id: 31, left: '74%', top: '64%', size: 1.6, color: '#FAF6E9', duration: 11.4, delay: 2.5, driftX: 7 },
      { id: 32, left: '84%', top: '80%', size: 1.3, color: '#F4F7F6', duration: 8.6, delay: 5.5, driftX: -8 },
    ]
  }, [])

  if (opacity <= 0.01) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden transition-opacity duration-500"
      style={{ opacity }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2.5}px 0.5px ${p.color}`,
            animation: `stardustDrift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
