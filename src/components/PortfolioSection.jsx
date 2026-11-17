import React, { useState, useEffect } from 'react'
import { Maximize2, X, Plus, Trash2 } from 'lucide-react'
import { getPortfolioStore, deletePortfolioItem, addPortfolioItem } from '../utils/adminStorage'
import { resolveAsset } from '../utils/assetPath'

/**
 * Ekuo NAILS - Haute Couture Archive (Portfolio)
 * Ultra-Luxury Minimalist Editorial Gallery
 * - Zero card boxes, zero dark-grey backgrounds, zero glowing outlines or drop shadows
 * - All nail art and typography float directly on the seamless matte obsidian-emerald background
 * - Symmetrically balanced 2-column layout (Left: SERIES 01 / 翠微夜宴, Right: SERIES 02 / 浮雕鎏金)
 * - Refined typographic hierarchy matching high-end printed art book aesthetics
 */
export default function PortfolioSection({
  onSelectDesign,
  isAdminMode = false,
}) {
  const [items, setItems] = useState(() => getPortfolioStore())
  const [lightboxItem, setLightboxItem] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New artwork form state (for admin)
  const [newTitle, setNewTitle] = useState('')
  const [newEngTitle, setNewEngTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTags, setNewTags] = useState('立體微雕, 貓眼光影')
  const [newImage, setNewImage] = useState('/frames/emma_001.jpg')

  // Listen to portfolio updates
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getPortfolioStore())
    }
    window.addEventListener('ekuo_portfolio_updated', handleUpdate)
    return () => window.removeEventListener('ekuo_portfolio_updated', handleUpdate)
  }, [])


  const handleDeleteItem = (e, id, title) => {
    e.stopPropagation()
    if (window.confirm(`確定從私藏作品中刪除《${title}》嗎？`)) {
      deletePortfolioItem(id)
    }
  }

  const handleAddNewItem = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const tagsArray = newTags
      .split(/[,，]/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    addPortfolioItem({
      series: `SERIES ${String(items.length + 1).padStart(2, '0')}`,
      title: newTitle.trim(),
      englishTitle: newEngTitle.trim() || 'Custom Haute Design',
      description: newDesc.trim() || '主理人親自一對一量甲訂製款。',
      tags: tagsArray.length > 0 ? tagsArray : ['高訂限定'],
      image: newImage.trim() || '/frames/emma_001.jpg',
      featured: true,
    })

    setNewTitle('')
    setNewEngTitle('')
    setNewDesc('')
    setIsAddModalOpen(false)
  }

  // Handle local image file upload converting to base64 data url
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 select-none bg-transparent">
      {/* ── Section Header: Clean, confident Liquid Silver headline (with clean 64px bottom margin) ── */}
      <div className="flex flex-col items-center text-center mb-16">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#F4F7F6] font-normal tracking-[0.08em] leading-tight select-none"
          style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif TC', serif" }}
        >
          Ekuo 指尖私藏
        </h2>
      </div>

      {/* ── Editorial Gallery: Balanced 2-Column Spread (Zero Boxes, Zero Glows, 100% Symmetrical) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-14 lg:gap-16 items-start">
        {items.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between select-none bg-transparent"
          >
            {/* 1. Nail Art Artwork (Directly on matte obsidian background, zero card box, zero rectangle edges) */}
            <div
              className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer mb-6 flex items-center justify-center bg-transparent"
              onClick={() => setLightboxItem(item)}
            >
              <img
                src={resolveAsset(item.image)}
                alt={item.title}
                className="w-full h-full object-contain transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{
                  mixBlendMode: 'lighten',
                  maskImage: 'radial-gradient(ellipse 94% 82% at 50% 50%, black 55%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 94% 82% at 50% 50%, black 55%, transparent 98%)',
                }}
                loading="lazy"
              />

              {/* Discreet hover zoom hint */}
              <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="font-serif italic text-xs tracking-widest text-[#F4F7F6]/90 bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
                  點擊鑑賞高清細節
                </span>
              </div>

              {/* Admin delete button */}
              {isAdminMode && (
                <button
                  onClick={(e) => handleDeleteItem(e, item.id, item.title)}
                  className="absolute top-3 right-3 p-1.5 rounded bg-black/70 text-red-300 hover:text-red-100 border border-red-500/30 transition-colors z-10"
                  title="刪除此款式"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            {/* 2. Editorial Typography Hierarchy */}
            <div className="flex flex-col flex-1">
              {/* Delicate Series Eyebrow */}
              <span className="font-serif italic text-[11px] tracking-[0.25em] text-[#7FA398] uppercase mb-1.5">
                {item.series || 'HAUTE COUTURE'}
              </span>

              {/* Title & Italic Script Subtitle */}
              <div className="flex items-baseline gap-2.5 mb-2.5 flex-wrap">
                <h3
                  className="text-[24px] text-[#F4F7F6] font-normal tracking-[0.04em] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif TC', serif" }}
                >
                  {item.title}
                </h3>
                {item.englishTitle && (
                  <span className="font-serif italic text-[15px] text-[#7FA398] tracking-wider font-light">
                    {item.englishTitle}
                  </span>
                )}
              </div>

              {/* Editorial Description */}
              <p className="font-sans text-[13px] text-[#8E9A96] font-light leading-[1.8] mb-3.5">
                {item.description}
              </p>

              {/* Flat Un-bordered Tags in #6B7A75 */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7A75] font-light tracking-wide mb-6">
                {item.tags?.map((t, idx) => (
                  <span key={idx}>#{t.replace(/^#/, '')}</span>
                ))}
              </div>

              {/* 3. Natural, Invisible Architectural Booking CTA */}
              <div className="mt-auto pt-1">
                <button
                  onClick={() => onSelectDesign?.(item.title)}
                  className="group/cta inline-flex flex-col items-start cursor-pointer outline-none"
                >
                  <span
                    className="text-[#E2E6E5] group-hover/cta:text-white transition-colors duration-300 text-[13px] tracking-[0.16em] font-normal leading-snug flex items-center gap-1.5"
                    style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif TC', serif" }}
                  >
                    <span>預約此款作品</span>
                    <span className="transform transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </span>
                  {/* Delicate 1px underline spaced generously below, shifting to solid white on hover */}
                  <span className="relative w-full h-[1px] mt-1.5 bg-[rgba(226,230,229,0.3)] overflow-hidden">
                    <span className="absolute inset-0 bg-white transform -translate-x-full group-hover/cta:translate-x-0 transition-transform duration-500 ease-out" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Fullscreen HD Lightbox Modal ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/92 backdrop-blur-md animate-in fade-in duration-300 select-none"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute -top-10 right-0 text-[#9A9E9D] hover:text-[#F4F7F6] transition-colors p-1"
            >
              <X size={22} />
            </button>

            {/* Lightbox Image */}
            <div className="relative w-full max-h-[70vh] overflow-hidden rounded-[4px] border border-[rgba(197,206,203,0.15)] bg-black/60 flex items-center justify-center">
              <img
                src={resolveAsset(lightboxItem.image)}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Bottom info bar */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 px-1">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xl text-[#F4F7F6] font-normal font-serif">
                    {lightboxItem.title}
                  </span>
                  <span className="text-xs font-serif italic text-[#7FA398]">
                    {lightboxItem.englishTitle}
                  </span>
                </div>
                <div className="flex gap-2 text-[11px] text-[#6B7A75] mt-1">
                  {lightboxItem.tags?.map((t, idx) => (
                    <span key={idx}>#{t.replace(/^#/, '')}</span>
                  ))}
                </div>
              </div>

              {/* Direct Booking CTA from Lightbox */}
              <button
                onClick={() => {
                  const title = lightboxItem.title
                  setLightboxItem(null)
                  onSelectDesign?.(title)
                }}
                className="group/lightcta inline-flex flex-col items-start cursor-pointer mt-2 sm:mt-0"
              >
                <span
                  className="text-[#E2E6E5] group-hover/lightcta:text-white transition-colors duration-300 text-xs tracking-[0.16em] font-serif flex items-center gap-1.5"
                >
                  <span>立即預約此款式</span>
                  <span className="transform transition-transform duration-300 group-hover/lightcta:translate-x-1">→</span>
                </span>
                <span className="relative w-full h-[1px] mt-1 bg-[rgba(226,230,229,0.3)] overflow-hidden">
                  <span className="absolute inset-0 bg-white transform -translate-x-full group-hover/lightcta:translate-x-0 transition-transform duration-500 ease-out" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin New Artwork Modal ── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md p-6 rounded-[12px] bg-[#0c1411] border border-[rgba(197,206,203,0.2)] shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#9A9E9D] hover:text-white"
            >
              <X size={16} />
            </button>

            <span className="font-serif italic text-xs tracking-widest text-[#7FA398] uppercase block mb-1">
              Admin Private Archive
            </span>
            <h3 className="font-serif text-xl text-[#F4F7F6] font-normal mb-4">
              新增作品至 EMMA 指尖私藏
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-3 font-serif text-xs">
              <div>
                <label className="block text-[#9A9E9D] mb-1">款式中文名稱 (如: 翠微夜宴) *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="請輸入中文款式名"
                  className="w-full px-3 py-2 rounded bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F4F7F6] outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[#9A9E9D] mb-1">英文名稱 (如: Nocturne Emerald)</label>
                <input
                  type="text"
                  value={newEngTitle}
                  onChange={(e) => setNewEngTitle(e.target.value)}
                  placeholder="請輸入英文名"
                  className="w-full px-3 py-2 rounded bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F4F7F6] outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[#9A9E9D] mb-1">工藝描述 (簡潔雜誌語氣)</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="請輸入工藝特點描述..."
                  className="w-full px-3 py-2 rounded bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F4F7F6] outline-none font-sans resize-none"
                />
              </div>

              <div>
                <label className="block text-[#9A9E9D] mb-1">標籤 (逗號分隔，如: 雙磁推光, 純手工金雕)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="雙磁推光, 純手工金雕, 植物無酸基底"
                  className="w-full px-3 py-2 rounded bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F4F7F6] outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[#9A9E9D] mb-1">作品圖片 (上傳本地或輸入網址)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-[11px] text-[#9A9E9D] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-[#1c2e27] file:text-[#E2E6E5] cursor-pointer mb-2"
                />
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="或直接輸入圖片 URL"
                  className="w-full px-3 py-1.5 rounded bg-black/50 border border-[rgba(197,206,203,0.25)] focus:border-[#E2E6E5] text-[#F4F7F6] outline-none font-sans text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded text-[#9A9E9D] hover:text-white transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#E2E6E5] text-[#070b09] font-medium hover:bg-white transition-colors"
                >
                  儲存並發布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
