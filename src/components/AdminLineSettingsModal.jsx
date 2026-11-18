import React, { useState } from 'react'
import { X, Send, CheckCircle2, AlertCircle, MessageSquare, MessageCircle, ExternalLink } from 'lucide-react'
import { getLineConfig, saveLineConfig } from '../utils/adminStorage'
import { sendLineReservationNotification, getLineDeepLink, formatReservationText } from '../utils/lineMessagingApi'

export default function AdminLineSettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(() => getLineConfig())
  const [statusMsg, setStatusMsg] = useState(null)
  const [isTesting, setIsTesting] = useState(false)

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    saveLineConfig(config)
    setStatusMsg({ type: 'success', text: 'LINE 官方配置已成功儲存！' })
    setTimeout(() => {
      setStatusMsg(null)
      onClose()
    }, 900)
  }

  // 方案 B：直接開啟 LINE 官方帳號並帶入預約憑證（免伺服器、100% 成功）
  const handleTestDeepLink = () => {
    saveLineConfig(config) // 自動儲存最新輸入，防止未按儲存導致仍使用舊連結
    const mockBooking = {
      id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      guestName: '測試貴賓 (王小姐)',
      dateStr: '2026年 11月 18日 (週三)',
      slot: '14:00',
      selectedDesign: '翠微夜宴 (Nocturne Emerald)',
      contactInfo: '0988-123-456 (LINE: test_client)',
    }
    try {
      const text = formatReservationText({ booking: mockBooking })
      navigator.clipboard?.writeText(text)
    } catch (e) {}

    const url = getLineDeepLink({ booking: mockBooking, config })
    window.open(url, '_blank')
    setStatusMsg({ type: 'success', text: '已自動儲存最新配置並開啟 LINE！預約單文字亦已同步複製到剪貼簿。' })
  }

  const handleTestSend = async () => {
    if (!config.channelAccessToken.trim()) {
      setStatusMsg({ type: 'error', text: '請先輸入 LINE Channel Access Token！' })
      return
    }
    if (!config.adminNotifyTargetId.trim()) {
      setStatusMsg({ type: 'error', text: '請輸入接收通知的 LINE User ID（格式如：U123456...）' })
      return
    }

    setIsTesting(true)
    setStatusMsg({ type: 'info', text: '正在發送測試 Flex Message 憑證...' })

    const mockBooking = {
      id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      guestName: '測試貴賓 (王小姐)',
      dateStr: '2026年 11月 18日 (週三)',
      slot: '14:00',
      selectedDesign: '翠微夜宴 (Nocturne Emerald)',
      contactInfo: '0988-123-456 (LINE: test_client)',
    }

    const result = await sendLineReservationNotification({
      booking: mockBooking,
      config,
    })

    setIsTesting(false)
    if (result.success) {
      setStatusMsg({ type: 'success', text: '測試憑證已成功推播至您的 LINE！' })
    } else {
      const is405 = result.error && (result.error.includes('405') || result.error.includes('Not Allowed'))
      if (is405) {
        setStatusMsg({
          type: 'info',
          text: '目前網站部署於靜態 GitHub Pages，靜態伺服器無法直接轉發 API POST 請求（405）。日常營運請使用左側綠色「測試開啟 LINE 官方帳號」（方案 B），直接開啟 LINE 帶入預約單，100% 穩定且無需架設後端！'
        })
      } else {
        setStatusMsg({ type: 'error', text: `推播反饋：${result.error || result.reason}` })
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-[18px] max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#0c120f',
          border: '1px solid rgba(197, 206, 203, 0.25)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#9A9E9D] hover:text-[#E2E6E5] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#12241b] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#F4F7F6] font-normal tracking-wide">
              LINE 官方帳號與預約配置
            </h3>
            <span className="font-sans text-xs text-[#8E9A96]">
              支援 LINE 官方帳號一鍵預約直通（方案 B）與 Messaging API
            </span>
          </div>
        </div>

        {/* Option B Active Mode Announcement */}
        <div className="mb-5 p-3.5 rounded-[10px] bg-emerald-950/25 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#06C755] text-white font-medium">方案 B 啟用中</span>
            <span className="text-xs text-emerald-200 font-serif tracking-wide">LINE 官方帳號預約直通（零伺服器·100% 穩定）</span>
          </div>
          <p className="text-[11px] text-[#A2B3AE] leading-relaxed">
            客人於官網預約完成後，系統會引導客人一鍵開啟 LINE 官方帳號（<span className="text-emerald-300 font-mono font-bold">@{config.officialAccountId?.replace(/^@/, '') || '060knwhx'}</span>），自動帶入預約單號、指定款式與個人電話傳送給您。完全不受 GitHub Pages 靜態環境限制！
          </p>
        </div>

        {/* Feedback Message */}
        {statusMsg && (
          <div
            className={`p-3 rounded-[8px] mb-4 text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                : statusMsg.type === 'error'
                ? 'bg-red-950/40 border border-red-500/30 text-red-300'
                : 'bg-stone-900 border border-stone-700 text-stone-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Channel Access Token */}
          <div>
            <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
              LINE Channel Access Token (Long-lived)
            </label>
            <input
              type="password"
              value={config.channelAccessToken}
              onChange={(e) => setConfig({ ...config, channelAccessToken: e.target.value })}
              placeholder="貼上 LINE Developers 後台的長期 Token"
              className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-base sm:text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-mono"
            />
            <span className="block font-sans text-[11px] text-[#6B7A75] mt-1">
              可在 LINE Developers Console &gt; Messaging API &gt; Channel access token 複製
            </span>
          </div>

          {/* Official Account ID or Add-Friend Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
                LINE 官方帳號 ID / 加好友連結
              </label>
              <input
                type="text"
                value={config.officialAccountId}
                onChange={(e) => setConfig({ ...config, officialAccountId: e.target.value })}
                placeholder="@060knwhx 或 https://lin.ee/..."
                className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-base sm:text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-sans"
              />
              <span className="block font-sans text-[11px] text-[#6B7A75] mt-1">
                支援輸入官方 ID（如 @060knwhx）或官方加好友連結（如 https://lin.ee/...）
              </span>
            </div>

            {/* Admin Target User ID */}
            <div>
              <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
                主理人 LINE User ID (接收通知)
              </label>
              <input
                type="text"
                value={config.adminNotifyTargetId}
                onChange={(e) => setConfig({ ...config, adminNotifyTargetId: e.target.value })}
                placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-base sm:text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Salon Address */}
          <div>
            <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
              工坊工作室地址（顯示於 Flex 憑證）
            </label>
            <input
              type="text"
              value={config.salonAddress}
              onChange={(e) => setConfig({ ...config, salonAddress: e.target.value })}
              placeholder="台北市大安區敦化南路一段 (高訂預約制私享空間)"
              className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] outline-none transition-colors font-sans"
            />
          </div>

          {/* Salon Notice */}
          <div>
            <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
              主理人到店溫馨須知（預設回覆說明）
            </label>
            <textarea
              rows={3}
              value={config.salonNotice}
              onChange={(e) => setConfig({ ...config, salonNotice: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] outline-none transition-colors font-sans leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[rgba(197,206,203,0.15)]">
            <div className="flex items-center gap-2">
              {/* Option B: Direct LINE Deep Link Button (100% Reliable, Zero Backend) */}
              <button
                type="button"
                onClick={handleTestDeepLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-serif tracking-wider transition-colors shadow-sm cursor-pointer"
                title="立即在電腦或手機打開 LINE 測試自動帶入預約單"
              >
                <MessageCircle size={13} />
                <span>測試開啟 LINE 官方帳號</span>
              </button>

              {/* Advanced API push test button */}
              <button
                type="button"
                onClick={handleTestSend}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white text-xs font-serif tracking-wider transition-colors disabled:opacity-50"
                title="使用 Messaging API 推播（需本地 Vite 代理或伺服端環境）"
              >
                <Send size={11} />
                <span>{isTesting ? '發送中...' : 'API 推播測試'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[8px] border border-[rgba(197,206,203,0.22)] text-[#9A9E9D] hover:text-[#E2E6E5] text-xs font-serif transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[8px] font-serif text-xs tracking-wider text-[#070b09] font-medium transition-all hover:brightness-110 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #E2E6E5 0%, #A9B5B2 100%)',
                }}
              >
                儲存配置
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
