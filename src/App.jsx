import React, { useState, useEffect, useCallback } from 'react'
import CanvasStage from './components/CanvasStage'
import StoryOverlays from './components/StoryOverlays'
import LuxuryHeader from './components/LuxuryHeader'
import TimelineControls from './components/TimelineControls'
import Preloader from './components/Preloader'
import CraftModal from './components/CraftModal'
import AdminPinModal from './components/AdminPinModal'
import AdminTopBar from './components/AdminTopBar'
import AdminReservationsModal from './components/AdminReservationsModal'
import AdminLineSettingsModal from './components/AdminLineSettingsModal'
import AmbientStardust from './components/AmbientStardust'
import { useImageSequence } from './hooks/useImageSequence'
import { getBookingsStore, cancelClientBooking } from './utils/adminStorage'
import { resolveAsset } from './utils/assetPath'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState('')

  // Studio Admin Management Mode States
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [isReservationsOpen, setIsReservationsOpen] = useState(false)
  const [isLineSettingsOpen, setIsLineSettingsOpen] = useState(false)
  const [bookings, setBookings] = useState(() => getBookingsStore())

  // Check URL query parameter ?admin=1 on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('admin=1')) {
      setIsPinModalOpen(true)
    }
  }, [])

  // Listen to bookings update events
  useEffect(() => {
    const handleBookingsUpdate = () => {
      setBookings(getBookingsStore())
    }
    window.addEventListener('ekuo_bookings_updated', handleBookingsUpdate)
    return () => window.removeEventListener('ekuo_bookings_updated', handleBookingsUpdate)
  }, [])

  // Initialize image sequence hook
  const {
    images,
    totalFrames,
    loadProgress,
    isLoaded,
    isFirstFrameReady
  } = useImageSequence({
    basePath: resolveAsset('frames'),
    prefix: 'emma_',
    extension: '.jpg',
    fallbackPrefix: 'ezgif-frame-',
    defaultTotal: 300,
    padDigits: 3
  })

  // Smooth scroll handler
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (maxScroll <= 0) return

    const progress = Math.min(1, Math.max(0, scrollY / maxScroll))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Programmatic scroll to target progress
  const scrollToProgress = (targetProgress) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const targetY = targetProgress * maxScroll
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })
  }

  // Admin access handlers
  const handleTriggerAdmin = () => {
    setIsPinModalOpen(true)
  }

  const handleAdminSuccess = () => {
    setIsPinModalOpen(false)
    setIsAdminMode(true)
    // Smoothly scroll down to the calendar so admin can edit slots right away
    scrollToProgress(1)
  }

  const handleExitAdmin = () => {
    setIsAdminMode(false)
  }

  const handleCancelBooking = (bookingId) => {
    const updated = cancelClientBooking(bookingId)
    setBookings(updated)
  }

  return (
    <div className="relative min-h-[420vh] sm:min-h-[550vh] w-full overflow-x-hidden bg-[#070b09] text-[#B3B3B8] font-sans">
      {/* Preloader with Gold Circle Progress */}
      <Preloader progress={loadProgress} isLoaded={isLoaded} />

      {/* Floating Admin Mode Bar at Top when active */}
      {isAdminMode && (
        <AdminTopBar
          onOpenReservations={() => setIsReservationsOpen(true)}
          onOpenLineSettings={() => setIsLineSettingsOpen(true)}
          onExitAdmin={handleExitAdmin}
          bookingCount={bookings.length}
        />
      )}

      {/* Seamless Transparent Header (smoothly scrolls to Calendar on CTA click) */}
      <LuxuryHeader
        onOpenBooking={() => scrollToProgress(1.0)}
        hideCTA={scrollProgress > 0.88}
        onTriggerAdmin={handleTriggerAdmin}
      />

      {/* Canvas Stage — 3D frames with studio lighting & reflection */}
      <CanvasStage
        images={images}
        totalFrames={totalFrames}
        progress={scrollProgress}
        isLoaded={isLoaded}
        isFirstFrameReady={isFirstFrameReady}
      />

      {/* Ambient Haute Stardust Micro-Crystals (Active strictly in Hero, smoothly fades on scroll) */}
      <AmbientStardust
        opacity={Math.max(0, 1 - scrollProgress / 0.18)}
      />

      {/* Apple-Style Story Overlays, Portfolio Lookbook & Booking Calendar */}
      <StoryOverlays
        progress={scrollProgress}
        onScrollTo={scrollToProgress}
        isAdminMode={isAdminMode}
        selectedDesign={selectedDesign}
        onSelectDesign={(design) => {
          setSelectedDesign(design)
          scrollToProgress(1.0)
        }}
        onClearDesign={() => setSelectedDesign('')}
      />

      {/* Ultra-Minimalist Scroll Indicator */}
      <TimelineControls
        progress={scrollProgress}
      />

      {/* Booking Modal (for header CTA trigger) */}
      <CraftModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Admin Secret PIN Prompt Modal (Default PIN: 8888) */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Admin Consolidated Client Reservations Modal with CSV Export */}
      <AdminReservationsModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* Admin LINE Official Account & Messaging API Settings Modal */}
      <AdminLineSettingsModal
        isOpen={isLineSettingsOpen}
        onClose={() => setIsLineSettingsOpen(false)}
      />
    </div>
  )
}
