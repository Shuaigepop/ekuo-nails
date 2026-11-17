import React, { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  SlidersHorizontal,
  CalendarDays,
  MessageCircle
} from 'lucide-react'
import {
  getDayConfig,
  toggleDayRest,
  toggleSlotStatus,
  addSlotToDay,
  removeSlotFromDay,
  addClientBooking,
  getLineConfig,
} from '../utils/adminStorage'
import {
  getLineDeepLink,
  sendLineReservationNotification,
} from '../utils/lineMessagingApi'

// Base simulation reference: November 2026
const INITIAL_YEAR = 2026
const INITIAL_MONTH = 10 // 0-indexed: 10 is November

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const WEEKDAYS_ZH = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function BookingCalendarCard({
  onScrollTo,
  isAdminMode = false,
  selectedDesign = '',
  onClearDesign,
}) {
  // Calendar navigation state
  const [currentYear, setCurrentYear] = useState(INITIAL_YEAR)
  const [currentMonth, setCurrentMonth] = useState(INITIAL_MONTH)

  // Simulation today (Nov 17, 2026)
  const simToday = 17

  // Update trigger for force-refreshing when schedule updates in localStorage
  const [scheduleVersion, setScheduleVersion] = useState(0)

  useEffect(() => {
    const handleUpdate = () => setScheduleVersion((v) => v + 1)
    window.addEventListener('ekuo_schedule_updated', handleUpdate)
    window.addEventListener('ekuo_bookings_updated', handleUpdate)
    return () => {
      window.removeEventListener('ekuo_schedule_updated', handleUpdate)
      window.removeEventListener('ekuo_bookings_updated', handleUpdate)
    }
  }, [])

  // Progressive disclosure modal state (Public Mode)
  const [activeSlotModal, setActiveSlotModal] = useState(null)
  // activeSlotModal format: { year, month, day, weekday, slot }

  // Form input state
  const [guestName, setGuestName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [formError, setFormError] = useState('')

  // Booking confirmed state
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  // Calculate calendar days aligned to Monday-first grid
  const { totalDays, leadingEmptyDays, monthNumeral, monthNameEn } = useMemo(() => {
    const firstDayDate = new Date(currentYear, currentMonth, 1)
    // Convert JS 0=Sun..6=Sat into 0=Mon..6=Sun
    const mondayFirstDay = (firstDayDate.getDay() + 6) % 7
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const numeral = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`
    const nameEn = MONTH_NAMES_EN[currentMonth]

    return {
      totalDays: daysInMonth,
      leadingEmptyDays: mondayFirstDay,
      monthNumeral: numeral,
      monthNameEn: nameEn,
    }
  }, [currentYear, currentMonth])

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  // Determine if a day is a default Rest Day (Monday)
  const isDefaultMonday = (dayNum) => {
    const colIndex = (leadingEmptyDays + dayNum - 1) % 7
    return colIndex === 0 // Monday is colIndex 0
  }

  // Get current day's live configuration (isRest, slots)
  const getDayData = (dayNum) => {
    return getDayConfig(currentYear, currentMonth + 1, dayNum, isDefaultMonday(dayNum))
  }

  // Public mode: click slot to open booking form
  const handlePublicSlotClick = (dayNum, slotTime) => {
    const colIndex = (leadingEmptyDays + dayNum - 1) % 7
    const weekday = WEEKDAYS_ZH[colIndex]
    setActiveSlotModal({
      year: currentYear,
      month: currentMonth + 1,
      day: dayNum,
      weekday,
      slot: slotTime,
    })
    setFormError('')
    setIsConfirmed(false)
  }

  // Admin mode: toggle slot availability
  const handleAdminToggleSlot = (dayNum, slotTime) => {
    toggleSlotStatus(currentYear, currentMonth + 1, dayNum, slotTime, isDefaultMonday(dayNum))
  }

  // Admin mode: toggle day rest status
  const handleAdminToggleRest = (dayNum) => {
    toggleDayRest(currentYear, currentMonth + 1, dayNum, isDefaultMonday(dayNum))
  }

  // Admin mode: add custom slot to day
  const handleAdminAddSlot = (dayNum) => {
    const newTime = window.prompt(`請輸入 ${currentMonth + 1}月${dayNum}日 新增的時段 (例如 20:00)：`, '20:00')
    if (newTime && newTime.trim()) {
      addSlotToDay(currentYear, currentMonth + 1, dayNum, newTime.trim(), isDefaultMonday(dayNum))
    }
  }

  // Admin mode: remove a slot from day
  const handleAdminRemoveSlot = (e, dayNum, slotTime) => {
    e.stopPropagation()
    if (window.confirm(`確定刪除 ${currentMonth + 1}月${dayNum}日的 ${slotTime} 時段嗎？`)) {
      removeSlotFromDay(currentYear, currentMonth + 1, dayNum, slotTime, isDefaultMonday(dayNum))
    }
  }

  // Handle client booking form submission (Public Mode)
  const handleSubmitBooking = (e) => {
    e.preventDefault()
    setFormError('')

    if (!guestName.trim()) {
      setFormError('請輸入貴賓尊稱')
      return
    }
    if (!contactInfo.trim()) {
      setFormError('請輸入 LINE ID 或手機號碼')
      return
    }

    const saved = addClientBooking({
      ...activeSlotModal,
      guestName: guestName.trim(),
      contactInfo: contactInfo.trim(),
      selectedDesign: selectedDesign || '客製高訂款',
    })

    // Trigger LINE Messaging API background push notification
    try {
      const lineConfig = getLineConfig()
      sendLineReservationNotification({ booking: saved, config: lineConfig })
    } catch (err) {
      console.warn('LINE notification trigger error:', err)
    }

    setConfirmedBooking(saved)
    setIsConfirmed(true)
  }

  return (
    <div className="relative w-full max-w-4xl bg-transparent transition-all select-none">
      {/* ── Top Bar: Clean Right-Aligned Platinum Back Button & Selected Design Badge ── */}
      <div className="w-full flex items-center justify-between pb-3 sm:pb-4 gap-3">
        {selectedDesign ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[rgba(197,206,203,0.3)] text-xs font-serif italic text-[#E2E6E5]">
            <span>已指定款式：{selectedDesign}</span>
            {onClearDesign && (
              <button
                type="button"
                onClick={onClearDesign}
                className="p-0.5 text-[#9A9E9D] hover:text-white"
                title="清除指定款式"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : isAdminMode ? (
          <div className="flex items-center gap-1.5 text-xs text-[#E2E6E5] font-serif italic">
            <SlidersHorizontal size={13} className="text-[#E2E6E5]" />
            <span>點選時段即時切換「可約 / 額滿」；點選日標切換「休 / 開」</span>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={() => onScrollTo(0)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[rgba(197,206,203,0.22)] hover:border-[#E2E6E5] text-[#C5CECB] hover:text-[#E2E6E5] font-serif italic text-xs tracking-wider transition-all duration-300 bg-black/25 hover:bg-black/40"
          title="返回首頁 (Home)"
        >
          <Home size={11} className="stroke-[1.5] text-[#C5CECB]" />
          <span>Home</span>
        </button>
      </div>

      {/* ── Liquid Silver & Moonlit Platinum Month Header ── */}
      <div className="relative flex items-center justify-center my-4 sm:my-6 h-24 select-none">
        {/* Previous Month Arrow in Platinum-Gray */}
        <button
          onClick={handlePrevMonth}
          className="p-2 text-[#9A9E9D] hover:text-[#E2E6E5] transition-colors mr-8 sm:mr-12 z-10"
          title="上一個月份"
          aria-label="Previous Month"
        >
          <ChevronLeft size={20} className="stroke-[1.5]" />
        </button>

        {/* Center Artwork: Faint Non-Glowing Platinum-Gray "11" with Moonlit Silver Script "November" */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Extremely faint, non-glowing translucent platinum-gray numeral */}
          <span
            className="absolute font-serif font-light pointer-events-none select-none"
            style={{
              fontSize: '5.5rem',
              lineHeight: 1,
              color: 'rgba(226, 230, 229, 0.08)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              letterSpacing: '-0.03em',
            }}
          >
            {monthNumeral}
          </span>

          {/* Small Year Label in Muted Platinum-Gray */}
          <span className="font-serif italic text-xs tracking-[0.35em] text-[#9A9E9D] z-10 select-none mb-[-2px]">
            {currentYear}
          </span>

          {/* Elegant natural matte script in moonlit silver-white */}
          <h3
            className="text-4xl sm:text-5xl text-[#E2E6E5] font-normal z-10 select-none tracking-wide"
            style={{
              fontFamily: "'Pinyon Script', 'Alex Brush', cursive",
              textShadow: '0 2px 16px rgba(0,0,0,0.8)',
            }}
          >
            {monthNameEn}
          </h3>
        </div>

        {/* Next Month Arrow in Platinum-Gray */}
        <button
          onClick={handleNextMonth}
          className="p-2 text-[#9A9E9D] hover:text-[#E2E6E5] transition-colors ml-8 sm:ml-12 z-10"
          title="下一個月份"
          aria-label="Next Month"
        >
          <ChevronRight size={20} className="stroke-[1.5]" />
        </button>
      </div>

      {/* ── Seamless 7-Column Schedule Grid (MON to SUN) ── */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[560px] sm:min-w-[620px]">
          {/* Weekday Labels (MON to SUN) — Muted Platinum-Gray */}
          <div className="grid grid-cols-7 text-center border-b border-[rgba(197,206,203,0.15)] pb-2 mb-2 select-none">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="font-serif text-[11px] sm:text-xs tracking-[0.24em] text-[#9A9E9D] uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 7-Column Calendar Grid with Ultra-Delicate Platinum-Gray Borders */}
          <div className="grid grid-cols-7 border-t border-l border-[rgba(197,206,203,0.12)]">
            {/* Empty padding cells before first day */}
            {Array.from({ length: leadingEmptyDays }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[118px] sm:min-h-[132px] border-r border-b border-[rgba(197,206,203,0.12)] bg-transparent"
              />
            ))}

            {/* Days of the Month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1
              const dayConfig = getDayData(dayNum)
              const rest = dayConfig.isRest
              const isToday =
                currentYear === INITIAL_YEAR &&
                currentMonth === INITIAL_MONTH &&
                dayNum === simToday

              return (
                <div
                  key={dayNum}
                  className={`min-h-[124px] sm:min-h-[140px] p-2 sm:p-2.5 border-r border-b border-[rgba(197,206,203,0.12)] flex flex-col justify-between relative transition-colors ${
                    isAdminMode ? 'hover:bg-white/[0.02]' : ''
                  }`}
                >
                  {/* Top row: Date Number (21px clamp), Today badge, and Admin Toggle */}
                  <div className="flex items-center justify-between pb-1 select-none">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-serif leading-none ${
                          isToday
                            ? 'text-[#FFFFFF] font-semibold'
                            : 'text-[#F4F7F6]'
                        }`}
                        style={{
                          fontSize: 'clamp(18px, 1.4vw, 24px)',
                          fontWeight: 500,
                        }}
                      >
                        {dayNum}
                      </span>

                      {/* Today sketch box with handwritten "today" in 12px */}
                      {isToday && (
                        <span
                          className="font-serif italic text-[#C5CECB] px-1.5 py-0.5 border border-[rgba(226,230,229,0.5)] rounded-[3px] select-none leading-none"
                          style={{ fontSize: '12px' }}
                        >
                          today
                        </span>
                      )}
                    </div>

                    {/* Admin Mode: Toggle Day Rest / Open */}
                    {isAdminMode && (
                      <button
                        type="button"
                        onClick={() => handleAdminToggleRest(dayNum)}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-serif italic border transition-colors ${
                          rest
                            ? 'text-amber-200/90 border-amber-300/40 bg-amber-950/30 hover:bg-amber-950/60'
                            : 'text-[#C5CECB] border-[rgba(197,206,203,0.25)] hover:border-[#E2E6E5] bg-black/40'
                        }`}
                        title={rest ? '點擊取消公休 (開工)' : '點擊設為公休 (打烊)'}
                      >
                        {rest ? '公休' : '營業'}
                      </button>
                    )}
                  </div>

                  {/* Rest Day (Mondays or Admin toggled): Clean 45-degree diagonal slash */}
                  {rest ? (
                    <div
                      className={`flex-1 flex items-center justify-center relative my-auto select-none py-2 ${
                        isAdminMode ? 'cursor-pointer group' : ''
                      }`}
                      onClick={() => {
                        if (isAdminMode) handleAdminToggleRest(dayNum)
                      }}
                      title={isAdminMode ? '點擊解除公休並顯示時段' : undefined}
                    >
                      <span
                        className="font-serif text-3xl sm:text-4xl font-light select-none text-[rgba(197,206,203,0.35)] group-hover:text-[rgba(197,206,203,0.7)] transition-colors"
                        style={{
                          transform: 'rotate(-35deg)',
                          display: 'inline-block',
                          lineHeight: 1,
                        }}
                      >
                        /
                      </span>
                    </div>
                  ) : (
                    /* Daily VIP Time Slots Listing (16px clamp, font-weight 500, 8px gap) */
                    <div className="flex flex-col gap-2 my-auto pt-1">
                      {dayConfig.slots.map((sObj) => {
                        const slot = sObj.time
                        const isBooked = sObj.status === 'booked'

                        // ─── ADMIN MODE: DIRECT INTERACTIVE TOGGLE ───
                        if (isAdminMode) {
                          return (
                            <div
                              key={slot}
                              className="group/slot flex items-center justify-between py-1 px-1.5 rounded-[4px] border border-transparent hover:border-[rgba(197,206,203,0.3)] bg-black/30 hover:bg-black/50 transition-all"
                            >
                              <button
                                type="button"
                                onClick={() => handleAdminToggleSlot(dayNum, slot)}
                                className={`flex-1 font-serif italic text-left tracking-tight ${
                                  isBooked
                                    ? 'line-through text-[rgba(226,230,229,0.3)]'
                                    : 'text-[#F4F7F6]'
                                }`}
                                style={{
                                  fontSize: 'clamp(15px, 1.25vw, 19px)',
                                  fontWeight: 500,
                                  textDecorationColor: 'rgba(197, 206, 203, 0.4)',
                                }}
                                title="點擊切換：可約 ↔ 額滿"
                              >
                                {slot} {isBooked ? '(滿)' : '(可)'}
                              </button>

                              {/* Delete slot button */}
                              <button
                                type="button"
                                onClick={(e) => handleAdminRemoveSlot(e, dayNum, slot)}
                                className="opacity-0 group-hover/slot:opacity-80 hover:!opacity-100 p-0.5 text-[#9A9E9D] hover:text-rose-300 transition-opacity ml-1"
                                title="刪除此時段"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )
                        }

                        // ─── PUBLIC VISITOR MODE ───
                        if (isBooked) {
                          return (
                            <div
                              key={slot}
                              className="font-serif italic text-center tracking-tight select-none line-through cursor-not-allowed py-1"
                              style={{
                                fontSize: 'clamp(16px, 1.35vw, 21px)',
                                fontWeight: 500,
                                color: 'rgba(226, 230, 229, 0.28)',
                                textDecorationColor: 'rgba(197, 206, 203, 0.4)',
                              }}
                              title="該時段已滿"
                            >
                              {slot}
                            </div>
                          )
                        }

                        // Available slot: Bright, crisp moonlight silver-white (#F4F7F6)
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handlePublicSlotClick(dayNum, slot)}
                            className="font-serif italic text-center tracking-tight py-1 px-1.5 rounded-[4px] text-[#F4F7F6] hover:text-[#FFFFFF] hover:border hover:border-[#C5CECB] hover:bg-[rgba(197,206,203,0.08)] border border-transparent transition-all cursor-pointer"
                            style={{
                              fontSize: 'clamp(16px, 1.35vw, 21px)',
                              fontWeight: 500,
                            }}
                            title={`預約 ${dayNum}日 · ${slot}`}
                          >
                            {slot}
                          </button>
                        )
                      })}

                      {/* Admin Mode: Add custom slot button (+) */}
                      {isAdminMode && (
                        <button
                          type="button"
                          onClick={() => handleAdminAddSlot(dayNum)}
                          className="w-full py-1 text-[11px] text-[#9A9E9D] hover:text-[#E2E6E5] border border-dashed border-[rgba(197,206,203,0.2)] hover:border-[rgba(197,206,203,0.5)] rounded flex items-center justify-center gap-1 transition-colors"
                          title="新增自訂席位時段 (如 20:00)"
                        >
                          <Plus size={10} />
                          <span>加時段</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Studio Legend in Moonlit Platinum-Gray & Moonlight Ivory ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-[rgba(197,206,203,0.12)] text-[11px] sm:text-xs text-[#9A9E9D] select-none">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="font-serif italic text-sm text-[#F4F7F6]" style={{ fontWeight: 500 }}>14:00</span>
            <span className="font-serif italic text-xs">可預約席位</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-serif italic text-sm line-through text-[rgba(226,230,229,0.28)]" style={{ fontWeight: 500, textDecorationColor: 'rgba(197, 206, 203, 0.4)' }}>17:30</span>
            <span className="font-serif italic text-xs">已滿席</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-serif text-sm text-[#9A9E9D]/70 font-light" style={{ transform: 'rotate(-35deg)', display: 'inline-block' }}>/</span>
            <span className="font-serif italic text-xs">工坊公休日</span>
          </span>
        </div>
        <span className="font-serif italic text-xs text-[#9A9E9D]">
          Ekuo NAILS · 每日僅接待 3 組貴賓
        </span>
      </div>

      {/* ================================================================= */}
      {/* PUBLIC VISITOR PROGRESSIVE DISCLOSURE MODAL                        */}
      {/* ================================================================= */}
      {activeSlotModal && !isAdminMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative w-full max-w-md p-6 sm:p-7 rounded-[18px]"
            style={{
              backgroundColor: 'rgba(14, 18, 16, 0.96)',
              border: '1px solid rgba(197, 206, 203, 0.25)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveSlotModal(null)}
              className="absolute top-4 right-4 p-1.5 text-[#9A9E9D] hover:text-[#E2E6E5] transition-colors"
            >
              <X size={16} />
            </button>

            {!isConfirmed ? (
              /* Booking Input Form */
              <div>
                <span className="block font-serif italic text-xs text-[#C5CECB] tracking-widest uppercase mb-1">
                  Private Atelier Appointment
                </span>
                <h3 className="font-serif text-2xl text-[#E2E6E5] font-normal tracking-[0.04em] mb-4">
                  預約專屬高訂時段
                </h3>

                {/* Selected Date & Time with Haute Styling */}
                <div className="p-3.5 mb-4 rounded-[8px] border border-[rgba(197,206,203,0.2)] bg-black/35 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-[10px] text-[#9A9E9D] uppercase tracking-[0.2em]">
                      SELECTED SESSION
                    </span>
                    {selectedDesign && (
                      <span className="font-serif text-[11px] text-[#C5CECB] px-2 py-0.5 rounded bg-white/[0.05] border border-[rgba(197,206,203,0.2)]">
                        款式: {selectedDesign}
                      </span>
                    )}
                  </div>
                  <span className="block font-serif italic text-xl sm:text-2xl text-[#F2F5F4] font-medium tracking-tight">
                    {activeSlotModal.year}年 {activeSlotModal.month}月 {activeSlotModal.day}日 ({activeSlotModal.weekday}) · {activeSlotModal.slot}
                  </span>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                  <div>
                    <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
                      貴賓尊稱 (Name) <span className="text-[#E2E6E5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="請輸入貴賓尊稱，如：王小姐"
                      className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-sans"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
                      LINE ID / 手機號碼 <span className="text-[#E2E6E5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="請輸入聯繫手機或 LINE ID"
                      className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-sans"
                    />
                  </div>

                  {formError && (
                    <p className="text-[11px] text-stone-300 font-light pt-0.5">
                      ⚠️ {formError}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveSlotModal(null)}
                      className="w-1/3 py-2.5 rounded-[8px] border border-[rgba(197,206,203,0.22)] hover:border-[#E2E6E5] text-[#9A9E9D] hover:text-[#E2E6E5] font-serif italic text-xs tracking-wide transition-all"
                    >
                      取消重選
                    </button>

                    {/* Submit button with brushed-silver gradient */}
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-[8px] font-serif text-xs tracking-[0.16em] font-medium transition-all hover:brightness-110 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #E2E6E5 0%, #A9B5B2 100%)',
                        color: '#070b09',
                      }}
                    >
                      確認預約此時段
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Confirmation Success View */
              <div className="text-center py-4 flex flex-col items-center">
                <div className="w-11 h-11 rounded-full border border-[#E2E6E5] flex items-center justify-center mb-3 text-[#E2E6E5]">
                  <CheckCircle2 size={22} />
                </div>
                <span className="font-serif italic text-sm text-[#C5CECB] mb-1">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-2xl text-[#E2E6E5] font-normal mb-2">
                  預約席位已保留
                </h3>
                <p className="font-sans text-xs text-[#9A9E9D] max-w-xs leading-relaxed mb-4">
                  尊貴的 {confirmedBooking?.guestName}，感謝您的預約。Ekuo NAILS 私人顧問將於 24 小時內與您聯繫確認專屬鑑賞細節。
                </p>

                <div className="w-full bg-black/35 border border-[rgba(197,206,203,0.2)] rounded-[8px] p-3 text-left font-serif text-xs space-y-1.5 mb-5">
                  <div className="flex justify-between border-b border-[rgba(197,206,203,0.15)] pb-1.5">
                    <span className="text-[#9A9E9D]">預約時段</span>
                    <span className="text-[#E2E6E5]">
                      {confirmedBooking?.dateStr} · {confirmedBooking?.slot}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[rgba(197,206,203,0.15)] pb-1.5">
                    <span className="text-[#9A9E9D]">預約款式</span>
                    <span className="text-[#F2F5F4] font-medium">
                      {confirmedBooking?.selectedDesign || selectedDesign || '客製高訂款'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[rgba(197,206,203,0.15)] pb-1.5">
                    <span className="text-[#9A9E9D]">貴賓聯繫</span>
                    <span className="text-[#E2E6E5]">{confirmedBooking?.contactInfo}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#9A9E9D]">私人工坊</span>
                    <span className="text-[#E2E6E5]/80">台北大安 (預約制)</span>
                  </div>
                </div>

                {/* ── Official LINE Deep Link Confirmation Button ── */}
                <a
                  href={getLineDeepLink({ booking: confirmedBooking || {}, config: getLineConfig() })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 mb-2.5 rounded-[8px] flex items-center justify-center gap-2 font-serif text-xs tracking-wider font-medium transition-all hover:brightness-110 shadow-lg text-white"
                  style={{
                    backgroundColor: '#06C755',
                  }}
                >
                  <MessageCircle size={15} />
                  <span>開啟 LINE 官方領取預約憑證與須知</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveSlotModal(null)}
                  className="w-full py-2.5 rounded-[8px] border border-[rgba(197,206,203,0.25)] text-[#C5CECB] hover:text-white font-serif text-xs tracking-wider transition-all"
                >
                  完成並關閉
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
