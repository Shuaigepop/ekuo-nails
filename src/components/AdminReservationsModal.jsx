import React, { useState } from 'react'
import { Download, X, Trash2, Calendar, User, Phone, Clock, Search } from 'lucide-react'
import { exportBookingsToCSV } from '../utils/adminStorage'

export default function AdminReservationsModal({
  isOpen,
  onClose,
  bookings = [],
  onCancelBooking,
}) {
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      b.guestName.toLowerCase().includes(term) ||
      b.contactInfo.toLowerCase().includes(term) ||
      b.dateStr.toLowerCase().includes(term) ||
      b.slot.toLowerCase().includes(term)
    )
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-[20px] shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(14, 18, 16, 0.98)',
          border: '1px solid rgba(197, 206, 203, 0.3)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.98)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 sm:p-6 border-b border-[rgba(197,206,203,0.18)]">
          <div>
            <span className="font-serif italic text-xs tracking-widest text-[#9A9E9D] uppercase block">
              Ekuo NAILS Studio Management
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#E2E6E5] font-normal tracking-wide mt-0.5">
              高訂席位預約總表
            </h2>
            <span className="font-sans text-[11px] text-[#9A9E9D]/70 font-light">
              共計 {bookings.length} 筆貴賓席位預約記錄
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Export CSV Button */}
            <button
              onClick={exportBookingsToCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[rgba(197,206,203,0.3)] hover:border-[#E2E6E5] text-[#E2E6E5] font-serif text-xs tracking-wider transition-all bg-black/40 hover:bg-black/60 shadow-sm"
              title="匯出 UTF-8 CSV 檔案 (支援 Excel / Numbers)"
            >
              <Download size={13} className="text-[#E2E6E5]" />
              <span>匯出 Excel / CSV 報表</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#9A9E9D] hover:text-[#E2E6E5] hover:bg-stone-800/40 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-[rgba(197,206,203,0.12)] bg-black/20 flex items-center gap-2">
          <Search size={14} className="text-[#9A9E9D]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋貴賓姓名、電話或時段..."
            className="w-full bg-transparent text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#9A9E9D] hover:text-white"
            >
              清除
            </button>
          )}
        </div>

        {/* Reservations Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-[#9A9E9D]">
              <Calendar size={28} className="mx-auto mb-2 opacity-40" />
              <p className="font-serif text-sm">目前尚無符合的預約記錄</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-serif text-xs">
                <thead>
                  <tr className="border-b border-[rgba(197,206,203,0.15)] text-[#9A9E9D] text-[11px] uppercase tracking-wider">
                    <th className="pb-3 pl-2">預約日期</th>
                    <th className="pb-3">時段</th>
                    <th className="pb-3">預約款式</th>
                    <th className="pb-3">貴賓尊稱</th>
                    <th className="pb-3">LINE ID / 電話</th>
                    <th className="pb-3">提交時間</th>
                    <th className="pb-3 text-right pr-2">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(197,206,203,0.08)]">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 pl-2 text-[#E2E6E5] font-normal whitespace-nowrap">
                        {b.dateStr}
                      </td>

                      {/* Slot */}
                      <td className="py-3.5 whitespace-nowrap">
                        <span className="italic text-[#F2F5F4] px-2 py-0.5 rounded bg-black/40 border border-[rgba(197,206,203,0.2)]">
                          {b.slot}
                        </span>
                      </td>

                      {/* Design Name */}
                      <td className="py-3.5 whitespace-nowrap text-[#C5CECB]">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-[rgba(197,206,203,0.15)] text-[11px]">
                          {b.selectedDesign || '客製高訂款'}
                        </span>
                      </td>

                      {/* Guest Name */}
                      <td className="py-3.5 text-[#F2F5F4] font-medium whitespace-nowrap">
                        {b.guestName}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 text-[#C5CECB] font-sans text-xs whitespace-nowrap">
                        {b.contactInfo}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 text-[#9A9E9D] font-sans text-[11px] whitespace-nowrap">
                        {b.createdAt}
                      </td>

                      {/* Cancel / Release Action */}
                      <td className="py-3.5 text-right pr-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (window.confirm(`確定取消 ${b.guestName} 的預約 (${b.dateStr} · ${b.slot}) 並釋出該時段嗎？`)) {
                              onCancelBooking(b.id)
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/40 hover:border-rose-700/60 transition-colors"
                          title="取消此預約並將該時段釋出為可預約狀態"
                        >
                          <Trash2 size={11} />
                          <span>取消/釋出時段</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 border-t border-[rgba(197,206,203,0.12)] bg-black/30 flex items-center justify-between text-[11px] text-[#9A9E9D]">
          <span>Ekuo NAILS 私人訂製工坊 · 主理人專屬後台</span>
          <button
            onClick={onClose}
            className="text-[#E2E6E5] hover:underline font-serif italic"
          >
            返回日曆
          </button>
        </div>
      </div>
    </div>
  )
}
