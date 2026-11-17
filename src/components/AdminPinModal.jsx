import React, { useState } from 'react'
import { Lock, X, KeyRound } from 'lucide-react'

export default function AdminPinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // Default PIN: 8888
    if (pin === '8888') {
      setError(false)
      setPin('')
      onSuccess()
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xs p-6 rounded-[18px] text-center"
        style={{
          backgroundColor: 'rgba(14, 18, 16, 0.98)',
          border: '1px solid rgba(197, 206, 203, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-[#9A9E9D] hover:text-[#E2E6E5] transition-colors"
        >
          <X size={15} />
        </button>

        {/* Lock Icon */}
        <div className="w-10 h-10 rounded-full border border-[rgba(197,206,203,0.3)] bg-black/40 flex items-center justify-center mx-auto mb-3 text-[#E2E6E5]">
          <KeyRound size={18} />
        </div>

        <span className="block font-serif italic text-xs tracking-widest text-[#9A9E9D] uppercase mb-0.5">
          Ekuo NAILS Studio
        </span>
        <h3 className="font-serif text-lg text-[#E2E6E5] font-normal tracking-wide mb-1">
          主理人管理模式
        </h3>
        <p className="font-sans text-[11px] text-[#9A9E9D]/80 mb-4 font-light">
          請輸入專屬管理密碼 (預設: 8888)
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError(false)
            }}
            placeholder="••••"
            className="w-full text-center tracking-[0.5em] text-lg py-2.5 rounded-[8px] bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F2F5F4] placeholder:text-[#9A9E9D]/30 outline-none transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-[11px] text-rose-300/90 font-light pt-0.5">
              密碼錯誤，請重新輸入
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 rounded-[8px] border border-[rgba(197,206,203,0.2)] text-[#9A9E9D] hover:text-[#E2E6E5] font-serif text-xs transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 rounded-[8px] font-serif text-xs tracking-wider font-medium text-[#070b09] transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #E2E6E5 0%, #A9B5B2 100%)',
              }}
            >
              登入管理
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
