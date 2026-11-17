import { useState, useEffect, useRef } from 'react'

/**
 * High-performance image sequence preloader with auto-detection support.
 * Loads 3-digit zero-padded frames starting with `emma_XXX.jpg` or fallback prefixes.
 */
export function useImageSequence({
  basePath = '/frames',
  prefix = 'emma_',
  extension = '.jpg',
  fallbackPrefix = 'ezgif-frame-',
  defaultTotal = 300,
  padDigits = 3,
} = {}) {
  const [images, setImages] = useState([])
  const [totalFrames, setTotalFrames] = useState(defaultTotal)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false)
  const [activePrefix, setActivePrefix] = useState(prefix)
  const imageCacheRef = useRef([])

  // Format frame filename
  const getFrameUrl = (index, pfx = activePrefix) => {
    const num = String(index + 1).padStart(padDigits, '0')
    return `${basePath}/${pfx}${num}${extension}`
  }

  useEffect(() => {
    let isCancelled = false

    async function initializeAndPreload() {
      let finalCount = defaultTotal
      let chosenPrefix = prefix

      // Step 1: Attempt to fetch manifest if available
      try {
        const manifestRes = await fetch(`${basePath}/manifest.json`)
        if (manifestRes.ok) {
          const manifest = await manifestRes.json()
          if (manifest.frameCount) {
            finalCount = manifest.frameCount
          }
          if (manifest.prefix) {
            chosenPrefix = manifest.prefix
          }
        }
      } catch (err) {
        console.warn('Manifest not found, using automatic prefix probing...', err)
      }

      // Step 2: Probe prefix availability (test emma_ vs fallbackPrefix)
      const testImage = (url) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = url
        })

      const testPrimary = await testImage(getFrameUrl(0, chosenPrefix))
      if (!testPrimary) {
        const testFallback = await testImage(getFrameUrl(0, fallbackPrefix))
        if (testFallback) {
          chosenPrefix = fallbackPrefix
        }
      }

      if (isCancelled) return
      setActivePrefix(chosenPrefix)
      setTotalFrames(finalCount)

      // Step 3: Fast-track Frame 0 for immediate visual presentation
      const initialImg = new Image()
      initialImg.src = getFrameUrl(0, chosenPrefix)
      initialImg.onload = () => {
        if (!isCancelled) {
          imageCacheRef.current[0] = initialImg
          setIsFirstFrameReady(true)
        }
      }

      // Step 4: Batch preload all frames with concurrency pooling
      const loadedImages = new Array(finalCount)
      let loadedCount = 0
      const concurrency = 12 // Optimal simultaneous image downloads
      const queue = Array.from({ length: finalCount }, (_, i) => i)

      const loadNext = async () => {
        while (queue.length > 0) {
          if (isCancelled) return
          const index = queue.shift()
          const url = getFrameUrl(index, chosenPrefix)

          await new Promise((resolve) => {
            const img = new Image()
            img.src = url
            img.onload = () => {
              loadedImages[index] = img
              loadedCount++
              if (!isCancelled) {
                const pct = Math.floor((loadedCount / finalCount) * 100)
                setLoadProgress(pct)
              }
              resolve()
            }
            img.onerror = () => {
              console.warn(`Frame ${index + 1} failed to load from ${url}`)
              // Fallback to previous image or blank placeholder
              loadedImages[index] = loadedImages[Math.max(0, index - 1)] || null
              loadedCount++
              resolve()
            }
          })
        }
      }

      // Launch worker pool
      const workers = Array.from({ length: concurrency }, () => loadNext())
      await Promise.all(workers)

      if (!isCancelled) {
        imageCacheRef.current = loadedImages
        setImages(loadedImages)
        setIsLoaded(true)
        setLoadProgress(100)
      }
    }

    initializeAndPreload()

    return () => {
      isCancelled = true
    }
  }, [basePath, prefix, extension, defaultTotal])

  return {
    images: images.length > 0 ? images : imageCacheRef.current,
    totalFrames,
    loadProgress,
    isLoaded,
    isFirstFrameReady,
    activePrefix,
    getFrameUrl
  }
}
