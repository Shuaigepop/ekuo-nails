import React, { useState } from 'react'
import { X, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import { getLineConfig, saveLineConfig } from '../utils/adminStorage'
import { sendLineReservationNotification } from '../utils/lineMessagingApi'

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
      setStatusMsg({ type: 'error', text: `推播失敗：${result.error || result.reason}` })
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#12241b] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#F4F7F6] font-normal tracking-wide">
              LINE 官方帳號與自動推播配置
            </h3>
            <span className="font-sans text-xs text-[#8E9A96]">
              設定 LINE Messaging API，客人預約時自動推播黑曜翡翠電子憑證
            </span>
          </div>
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
              className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-mono"
            />
            <span className="block font-sans text-[11px] text-[#6B7A75] mt-1">
              可在 LINE Developers Console &gt; Messaging API &gt; Channel access token 複製
            </span>
          </div>

          {/* Official Account ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-serif text-xs text-[#C5CECB] tracking-wide mb-1">
                LINE 官方帳號 ID
              </label>
              <input
                type="text"
                value={config.officialAccountId}
                onChange={(e) => setConfig({ ...config, officialAccountId: e.target.value })}
                placeholder="@ekuo_nails"
                className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-sans"
              />
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
                className="w-full px-3.5 py-2 rounded-[8px] bg-black/40 border border-[rgba(197,206,203,0.22)] focus:border-[#E2E6E5] text-xs text-[#F2F5F4] placeholder:text-[#9A9E9D]/40 outline-none transition-colors font-mono"
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
            <button
              type="button"
              onClick={handleTestSend}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-serif tracking-wider transition-colors disabled:opacity-50"
            >
              <Send size={12} />
              <span>{isTesting ? '發送中...' : '發送測試憑證'}</span>
            </button>

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
