import React from 'react'
import { MessageSquare, CalendarCheck, Check } from 'lucide-react'

export default function AdminTopBar({
  onOpenReservations,
  onOpenLineSettings,
  onExitAdmin,
  bookingCount = 0
}) {
  return (
    <div className="fixed top-3 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none animate-fadeIn">
      <div
        className="pointer-events-auto w-full sm:w-auto max-w-[calc(100vw-16px)] overflow-x-auto rounded-2xl sm:rounded-full border shadow-2xl transition-all"
        style={{
          backgroundColor: 'rgba(12, 16, 14, 0.94)',
          borderColor: 'rgba(197, 206, 203, 0.35)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(197, 206, 203, 0.08)',
        }}
      >
        {/* Mobile: Compact stacked layout */}
        <div className="flex sm:hidden flex-col gap-2 px-3 py-2.5">
          {/* Top row: status + exit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2E6E5] animate-pulse" />
              <span className="font-serif italic text-[11px] text-[#E2E6E5] tracking-wider select-none">
                管理模式
              </span>
            </div>
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1 px-3 py-1 rounded-full font-serif text-[11px] tracking-wider text-[#070b09] font-medium transition-all hover:brightness-110 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #E2E6E5 0%, #A9B5B2 100%)',
              }}
            >
              <Check size={11} className="stroke-[2.5]" />
              <span>退出</span>
            </button>
          </div>
          {/* Bottom row: action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenLineSettings}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-emerald-500/35 text-emerald-300 font-serif text-[11px] tracking-wide transition-all bg-emerald-950/25"
              title="LINE 官方串接"
            >
              <MessageSquare size={11} className="text-emerald-400 flex-shrink-0" />
              <span>LINE</span>
            </button>
            <button
              onClick={onOpenReservations}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[rgba(197,206,203,0.25)] text-[#C5CECB] font-serif text-[11px] tracking-wide transition-all bg-black/30"
            >
              <CalendarCheck size={11} className="text-[#E2E6E5] flex-shrink-0" />
              <span>預約</span>
              {bookingCount > 0 && (
                <span className="px-1.5 rounded-full bg-[#E2E6E5] text-[#070b09] font-sans text-[9px] font-semibold">
                  {bookingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop: Original horizontal pill layout */}
        <div className="hidden sm:flex items-center justify-between gap-6 px-6 py-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2E6E5] animate-pulse" />
            <span className="font-serif italic text-sm text-[#E2E6E5] tracking-wider select-none">
              主理人排班管理模式
            </span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLineSettings}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/35 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 font-serif text-xs tracking-wide transition-all bg-emerald-950/25"
              title="設定 LINE Messaging API 與自動回覆"
            >
              <MessageSquare size={12} className="text-emerald-400" />
              <span>LINE 官方串接</span>
            </button>

            <button
              onClick={onOpenReservations}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(197,206,203,0.25)] hover:border-[#E2E6E5] text-[#C5CECB] hover:text-[#E2E6E5] font-serif text-xs tracking-wide transition-all bg-black/30"
            >
              <CalendarCheck size={12} className="text-[#E2E6E5]" />
              <span>查看預約總表</span>
              {bookingCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#E2E6E5] text-[#070b09] font-sans text-[10px] font-semibold">
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full font-serif text-xs tracking-wider text-[#070b09] font-medium transition-all hover:brightness-110 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #E2E6E5 0%, #A9B5B2 100%)',
              }}
            >
              <Check size={12} className="stroke-[2.5]" />
              <span>儲存並退出</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
