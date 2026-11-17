import React, { useState } from 'react'
import { X, Sparkles, Check, Shield, Layers, Award } from 'lucide-react'
import { resolveAsset } from '../utils/assetPath'

export default function CraftModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceDate: '',
    preferences: '三層黑金貓眼高訂款式'
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-black/50 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/25 overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-stone-800 text-[#B3B3B8] hover:text-[#F5F3EF] hover:border-[#D4AF37]/40 transition-all"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-stone-600 flex items-center justify-center bg-white/5 mb-6">
              <Check size={32} className="text-[#F5F3EF]" />
            </div>
            <h3 className="font-serif text-2xl text-[#F5F3EF] font-medium tracking-[0.1em] mb-3">
              鑑賞預約已送出
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#B3B3B8] font-light max-w-md leading-[1.8]">
              Ekuo NAILS 高訂美甲顧問將於 24 小時內以專屬通訊聯絡您，為您確認訂製檔期與甲型分析。
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="border-b border-stone-800/80 pb-5 mb-6 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#B3B3B8] text-[11px] tracking-[0.2em] uppercase font-normal mb-1">
                  <span>✦</span>
                  <span className="font-sans">EKUO HAUTE COUTURE APPOINTMENT</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F3EF] font-medium tracking-[0.1em] leading-snug">
                  預約專屬黑金貓眼高訂鑑賞
                </h2>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <img src={resolveAsset('ekuo-logo.png')} alt="Ekuo NAILS" className="h-12 w-auto object-contain mix-blend-screen" />
              </div>
            </div>

            {/* Craft Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="p-3.5 rounded-xl border border-stone-800/80 bg-black/40">
                <div className="font-sans text-[10px] text-[#B3B3B8] tracking-wider uppercase font-light leading-[1.8]">基底膠種</div>
                <div className="font-sans text-xs text-[#F5F3EF] font-light mt-1 leading-[1.8]">日本純植物無酸膠</div>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-800/80 bg-black/40">
                <div className="font-sans text-[10px] text-[#B3B3B8] tracking-wider uppercase font-light leading-[1.8]">光學磁粉</div>
                <div className="font-sans text-xs text-[#F5F3EF] font-light mt-1 leading-[1.8]">極微米高純稀土磁粉</div>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-800/80 bg-black/40 col-span-2 sm:col-span-1">
                <div className="font-sans text-[10px] text-[#B3B3B8] tracking-wider uppercase font-light leading-[1.8]">立體工藝</div>
                <div className="font-sans text-xs text-[#F5F3EF] font-light mt-1 leading-[1.8]">0.1mm 金雕微塑</div>
              </div>
            </div>

            {/* Quick Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[11px] tracking-wider text-[#B3B3B8] uppercase mb-1.5 font-light">
                    貴賓姓名 (Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="請輸入尊稱"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#D4AF37]/50 text-[#F5F3EF] text-xs outline-none transition-colors font-sans font-light"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[11px] tracking-wider text-[#B3B3B8] uppercase mb-1.5 font-light">
                    聯絡電話 / LINE (Contact)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="手機號碼或 LINE ID"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#D4AF37]/50 text-[#F5F3EF] text-xs outline-none transition-colors font-sans font-light"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[11px] tracking-wider text-[#B3B3B8] uppercase mb-1.5 font-light">
                  期望施作檔期 (Preferred Date)
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-stone-800 focus:border-[#D4AF37]/50 text-[#F5F3EF] text-xs outline-none transition-colors font-sans font-light"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-champagne-600 via-champagne-500 to-champagne-400 text-[#070709] font-sans font-medium text-xs tracking-[0.15em] uppercase hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                  確認並送出高訂預約
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
