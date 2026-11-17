import React, { useEffect, useRef } from 'react'

/**
 * Ekuo NAILS - Ultra-HD Full-Bleed 100vw × 100vh Canvas Engine
 * - Zero letterboxing, zero boxed borders, background fills 100vw × 100vh
 * - Scaled down by 24% (scale * 0.76) for balanced editorial luxury proportions (52%–55% nail width)
 * - Nails cleanly centered at top: 52% with generous breathing room above (headline) and below (SCROLL indicator)
 * - 4-edge soft feathering guarantees seamless blend into #070b09 studio obsidian-emerald
 */
export default function CanvasStage({
  images,
  totalFrames,
  progress,
  isLoaded,
  isFirstFrameReady,
}) {
  const canvasRef = useRef(null)
  const currentFrameRef = useRef(0)

  // Shared pure render function for high performance & guaranteed consistency
  const renderFrameOnCanvas = (img, context, targetCanvas, frameProgress = 0) => {
    const canvasWidth = targetCanvas.width
    const canvasHeight = targetCanvas.height

    // Deep obsidian-emerald base
    context.fillStyle = '#070b09'
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    if (!img || !img.complete || img.naturalWidth === 0) {
      return
    }

    // High quality bicubic smoothing
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    // ── True 100vw × 100vh Base Scaling ──
    const imgRatio = img.naturalWidth / img.naturalHeight
    const screenRatio = canvasWidth / canvasHeight

    let baseWidth, baseHeight
    if (screenRatio > imgRatio) {
      // Screen is wider than 16:9: match width, height expands proportionally
      baseWidth = canvasWidth
      baseHeight = canvasWidth / imgRatio
    } else {
      // Screen is taller than 16:9: match height, width expands proportionally
      baseHeight = canvasHeight
      baseWidth = canvasHeight * imgRatio
    }

    // Scale down by roughly 22%–25% (scale * 0.76) for refined editorial proportions
    const scaleFactor = 0.76
    const renderWidth = baseWidth * scaleFactor
    const renderHeight = baseHeight * scaleFactor

    // Center nails cleanly at top: 52%
    // In Hero frame, vertical center is at 0.444 of frame height
    // In Exploded frame, vertical center is at 0.495 of frame height
    const t = Math.min(1, Math.max(0, (frameProgress - 0.16) / 0.12))
    const nailCenterInFrame = 0.444 * (1 - t) + 0.495 * t
    const targetNailY = canvasHeight * 0.52

    const offsetX = (canvasWidth - renderWidth) / 2
    const offsetY = targetNailY - renderHeight * nailCenterInFrame

    // Draw high-resolution frame
    context.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)

    // ── Soft Edge Feathering to blend seamlessly into #070b09 without any rectangular border ──
    const featherSize = Math.min(renderWidth, renderHeight) * 0.08
    const bg = '#070b09'

    // Left edge
    const leftGrad = context.createLinearGradient(offsetX, 0, offsetX + featherSize, 0)
    leftGrad.addColorStop(0, bg)
    leftGrad.addColorStop(1, 'rgba(7, 11, 9, 0)')
    context.fillStyle = leftGrad
    context.fillRect(offsetX - 2, offsetY - 2, featherSize + 2, renderHeight + 4)

    // Right edge
    const rightGrad = context.createLinearGradient(offsetX + renderWidth - featherSize, 0, offsetX + renderWidth, 0)
    rightGrad.addColorStop(0, 'rgba(7, 11, 9, 0)')
    rightGrad.addColorStop(1, bg)
    context.fillStyle = rightGrad
    context.fillRect(offsetX + renderWidth - featherSize, offsetY - 2, featherSize + 4, renderHeight + 4)

    // Top edge
    const topGrad = context.createLinearGradient(0, offsetY, 0, offsetY + featherSize)
    topGrad.addColorStop(0, bg)
    topGrad.addColorStop(1, 'rgba(7, 11, 9, 0)')
    context.fillStyle = topGrad
    context.fillRect(offsetX - 2, offsetY - 2, renderWidth + 4, featherSize + 2)

    // Bottom edge
    const botGrad = context.createLinearGradient(0, offsetY + renderHeight - featherSize, 0, offsetY + renderHeight)
    botGrad.addColorStop(0, 'rgba(7, 11, 9, 0)')
    botGrad.addColorStop(1, bg)
    context.fillStyle = botGrad
    context.fillRect(offsetX - 2, offsetY + renderHeight - featherSize, renderWidth + 4, featherSize + 4)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!ctx) return

    let animationFrameId
    let currentRenderedFrame = currentFrameRef.current

    const handleResize = () => {
      const dpr = Math.max(window.devicePixelRatio || 1, 1)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const safeIndex = Math.max(0, Math.min(Math.round(currentRenderedFrame), totalFrames - 1))
      const img = images[safeIndex] || images[0]
      if (img) {
        const frameProg = totalFrames > 1 ? safeIndex / (totalFrames - 1) : 0
        renderFrameOnCanvas(img, ctx, canvas, frameProg)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Smooth Lerp Scrubbing Loop (Apple-style interpolation)
    const renderLoop = () => {
      const targetFrame = Math.max(0, Math.min(totalFrames - 1, (totalFrames - 1) * progress))

      const diff = targetFrame - currentRenderedFrame
      if (Math.abs(diff) > 0.003) {
        currentRenderedFrame += diff * 0.14
        currentFrameRef.current = currentRenderedFrame
        const safeIndex = Math.max(0, Math.min(Math.round(currentRenderedFrame), totalFrames - 1))
        const img = images[safeIndex]
        if (img) {
          const frameProg = totalFrames > 1 ? safeIndex / (totalFrames - 1) : 0
          renderFrameOnCanvas(img, ctx, canvas, frameProg)
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    animationFrameId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [images, totalFrames, progress])

  // Instant redraw on first frame ready
  useEffect(() => {
    if (canvasRef.current && (isFirstFrameReady || isLoaded)) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
      if (ctx) {
        const dpr = Math.max(window.devicePixelRatio || 1, 1)
        const width = window.innerWidth
        const height = window.innerHeight
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const frame = Math.round(currentFrameRef.current)
        const img = images[frame] || images[0]
        if (img && img.complete) {
          const frameProg = totalFrames > 1 ? frame / (totalFrames - 1) : 0
          renderFrameOnCanvas(img, ctx, canvas, frameProg)
        }
      }
    }
  }, [isFirstFrameReady, isLoaded, images, totalFrames])

  // 3D Canvas smoothly and naturally dissolves to 0% between 48% and 52%
  // so that when entering "EMMA 指尖私藏" (54%+) and "日曆預約" (85%+), there is ZERO 3D nail ghosting
  let canvasOpacity = 1
  if (progress > 0.48) {
    canvasOpacity = Math.max(0, 1 - (progress - 0.48) / 0.04)
  }

  const isCanvasVisible = canvasOpacity > 0.001

  return (
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#070b09]"
      style={{
        display: isCanvasVisible ? 'block' : 'none',
      }}
    >
      {/* Subtle Atmospheric Ambient Glow */}
      <div
        className="absolute w-[600px] h-[600px] -top-24 -left-24 bg-emerald-950/20 rounded-full blur-[160px] pointer-events-none"
        style={{ opacity: canvasOpacity }}
      />
      <div
        className="absolute w-[700px] h-[700px] -bottom-24 -right-24 bg-emerald-900/15 rounded-full blur-[180px] pointer-events-none"
        style={{ opacity: canvasOpacity }}
      />

      {/* The Master HD Canvas — Solid, perfectly grounded & stable */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          width: '100vw',
          height: '100vh',
          opacity: (isFirstFrameReady || isLoaded) ? canvasOpacity : 0,
          visibility: isCanvasVisible ? 'visible' : 'hidden',
        }}
      />
    </div>
  )
}
