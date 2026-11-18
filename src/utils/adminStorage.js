/**
 * Ekuo NAILS - Studio Admin Storage Utility
 * Manages custom schedule days, slots, and client bookings using localStorage
 */

const STORAGE_KEYS = {
  SCHEDULE: 'ekuo_admin_schedule_v2',
  BOOKINGS: 'ekuo_admin_bookings_v2',
  PORTFOLIO: 'ekuo_admin_portfolio_v4',
  LINE_CONFIG: 'ekuo_admin_line_config_v1',
}

// Initial realistic default schedule overrides
const DEFAULT_SCHEDULE = {
  // Nov 17: Today fully booked
  '2026-11-17': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'booked' },
      { time: '14:00', status: 'booked' },
      { time: '17:30', status: 'booked' },
    ],
  },
  '2026-11-18': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'available' },
      { time: '14:00', status: 'booked' },
      { time: '17:30', status: 'booked' },
    ],
  },
  '2026-11-19': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '17:30', status: 'booked' },
    ],
  },
  '2026-11-20': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '17:30', status: 'available' },
    ],
  },
  '2026-11-21': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '17:30', status: 'booked' },
    ],
  },
  '2026-11-22': {
    isRest: false,
    slots: [
      { time: '11:00', status: 'booked' },
      { time: '14:00', status: 'booked' },
      { time: '17:30', status: 'booked' },
    ],
  },
}

// Initial realistic default client reservations
const DEFAULT_BOOKINGS = [
  {
    id: 'res-101',
    dateStr: '2026年 11月 18日 (週三)',
    rawDate: '2026-11-18',
    slot: '14:00',
    guestName: '陳語晴 小姐',
    contactInfo: '0928-881-234 (LINE: yuching_c)',
    createdAt: '2026/11/16 14:22',
  },
  {
    id: 'res-102',
    dateStr: '2026年 11月 19日 (週四)',
    rawDate: '2026-11-19',
    slot: '17:30',
    guestName: '林曼筠 總監',
    contactInfo: '0912-765-432 (LINE: manchun_lin)',
    createdAt: '2026/11/16 18:05',
  },
  {
    id: 'res-103',
    dateStr: '2026年 11月 21日 (週六)',
    rawDate: '2026-11-21',
    slot: '17:30',
    guestName: '張雅筑 設計師',
    contactInfo: '0933-219-876',
    createdAt: '2026/11/17 10:15',
  },
]

// Get all schedule data from localStorage
export function getScheduleStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse schedule store:', err)
  }
  return DEFAULT_SCHEDULE
}

// Save all schedule data
export function saveScheduleStore(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data))
    window.dispatchEvent(new Event('ekuo_schedule_updated'))
  } catch (err) {
    console.error('Failed to save schedule store:', err)
  }
}

// Helper to format date key: YYYY-MM-DD
export function getDateKey(year, month, day) {
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// Get day config: isRest, slots array
export function getDayConfig(year, month, day, isMondayDefault) {
  const store = getScheduleStore()
  const key = getDateKey(year, month, day)
  if (store[key]) {
    return store[key]
  }

  // Default values
  return {
    isRest: isMondayDefault,
    slots: [
      { time: '11:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '17:30', status: 'available' },
    ],
  }
}

// Toggle day rest status
export function toggleDayRest(year, month, day, isMondayDefault) {
  const store = { ...getScheduleStore() }
  const key = getDateKey(year, month, day)
  const current = getDayConfig(year, month, day, isMondayDefault)

  store[key] = {
    ...current,
    isRest: !current.isRest,
  }
  saveScheduleStore(store)
  return store[key]
}

// Toggle slot status: 'available' <-> 'booked'
export function toggleSlotStatus(year, month, day, slotTime, isMondayDefault) {
  const store = { ...getScheduleStore() }
  const key = getDateKey(year, month, day)
  const current = getDayConfig(year, month, day, isMondayDefault)

  const updatedSlots = current.slots.map((s) => {
    if (s.time === slotTime) {
      return {
        ...s,
        status: s.status === 'booked' ? 'available' : 'booked',
      }
    }
    return s
  })

  store[key] = {
    ...current,
    slots: updatedSlots,
  }
  saveScheduleStore(store)
  return store[key]
}

// Add a custom slot to a day
export function addSlotToDay(year, month, day, newTime, isMondayDefault) {
  const store = { ...getScheduleStore() }
  const key = getDateKey(year, month, day)
  const current = getDayConfig(year, month, day, isMondayDefault)

  if (current.slots.some((s) => s.time === newTime)) {
    return current
  }

  const updatedSlots = [...current.slots, { time: newTime, status: 'available' }].sort(
    (a, b) => a.time.localeCompare(b.time)
  )

  store[key] = {
    ...current,
    isRest: false,
    slots: updatedSlots,
  }
  saveScheduleStore(store)
  return store[key]
}

// Remove a slot from a day
export function removeSlotFromDay(year, month, day, slotTime, isMondayDefault) {
  const store = { ...getScheduleStore() }
  const key = getDateKey(year, month, day)
  const current = getDayConfig(year, month, day, isMondayDefault)

  const updatedSlots = current.slots.filter((s) => s.time !== slotTime)

  store[key] = {
    ...current,
    slots: updatedSlots,
  }
  saveScheduleStore(store)
  return store[key]
}

// ==========================================
// CLIENT BOOKINGS MANAGEMENT
// ==========================================

export function getBookingsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse bookings store:', err)
  }
  return DEFAULT_BOOKINGS
}

export function saveBookingsStore(bookings) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
    window.dispatchEvent(new Event('ekuo_bookings_updated'))
  } catch (err) {
    console.error('Failed to save bookings store:', err)
  }
}

// Add a new client booking and automatically mark that slot as booked
export function addClientBooking(bookingData) {
  const bookings = getBookingsStore()
  const newBooking = {
    id: 'res-' + Date.now(),
    dateStr: `${bookingData.year}年 ${bookingData.month}月 ${bookingData.day}日 (${bookingData.weekday})`,
    rawDate: getDateKey(bookingData.year, bookingData.month, bookingData.day),
    slot: bookingData.slot,
    selectedDesign: bookingData.selectedDesign || '客製高訂款',
    guestName: bookingData.guestName,
    contactInfo: bookingData.contactInfo,
    createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
  }

  const updatedList = [newBooking, ...bookings]
  saveBookingsStore(updatedList)

  // Mark the slot as booked in schedule
  const store = { ...getScheduleStore() }
  const key = newBooking.rawDate
  const current = getDayConfig(bookingData.year, bookingData.month, bookingData.day, false)

  const updatedSlots = current.slots.map((s) => {
    if (s.time === bookingData.slot) {
      return { ...s, status: 'booked' }
    }
    return s
  })

  store[key] = {
    ...current,
    slots: updatedSlots,
  }
  saveScheduleStore(store)

  return newBooking
}

// Cancel a booking and release its time slot back to available
export function cancelClientBooking(bookingId) {
  const bookings = getBookingsStore()
  const target = bookings.find((b) => b.id === bookingId)
  const remaining = bookings.filter((b) => b.id !== bookingId)
  saveBookingsStore(remaining)

  if (target && target.rawDate) {
    const [y, m, d] = target.rawDate.split('-').map(Number)
    const store = { ...getScheduleStore() }
    const key = target.rawDate
    const current = getDayConfig(y, m, d, false)

    const updatedSlots = current.slots.map((s) => {
      if (s.time === target.slot) {
        return { ...s, status: 'available' }
      }
      return s
    })

    store[key] = {
      ...current,
      slots: updatedSlots,
    }
    saveScheduleStore(store)
  }

  return remaining
}

// Export bookings to UTF-8 BOM CSV (compatible with Excel & Numbers)
export function exportBookingsToCSV() {
  const bookings = getBookingsStore()
  const headers = ['預約編號', '預約日期', '時段', '預約款式', '貴賓尊稱', 'LINE ID / 聯絡電話', '提交時間']

  const rows = bookings.map((b) => [
    `"${b.id}"`,
    `"${b.dateStr}"`,
    `"${b.slot}"`,
    `"${(b.selectedDesign || '客製高訂款').replace(/"/g, '""')}"`,
    `"${b.guestName.replace(/"/g, '""')}"`,
    `"${b.contactInfo.replace(/"/g, '""')}"`,
    `"${b.createdAt}"`,
  ])

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  const now = new Date().toISOString().slice(0, 10)
  link.setAttribute('download', `Ekuo_NAILS_Reservations_${now}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ==========================================
// PORTFOLIO / ARCHIVE MANAGEMENT
// ==========================================

export const DEFAULT_PORTFOLIO = [
  {
    id: 'art-01',
    series: 'SERIES 01',
    title: '翠微夜宴',
    englishTitle: 'Nocturne Emerald',
    description: '深邃祖母綠貓眼微光，交織 0.1mm 純金線條立體手工微雕，呈現如宮廷夜宴般的靜謐貴氣。',
    tags: ['雙磁推光', '純手工金雕', '植物無酸基底'],
    image: '/frames/emma_001.jpg',
    featured: true,
  },
  {
    id: 'art-02',
    series: 'SERIES 02',
    title: '浮雕鎏金',
    englishTitle: 'Relief Gold Carving',
    description: '以極細勾線筆調和日本金箔微粒凝膠，層疊出立體觸感與防氧化的高光飾邊。',
    tags: ['0.1mm堆疊', '日本金箔凝膠', '水晶封層'],
    image: '/frames/emma_001.jpg',
    featured: true,
  },
  {
    id: 'art-03',
    series: 'SERIES 03',
    title: '幻曜星軌',
    englishTitle: 'Celestial Magnetic Orbit',
    description: '特選極微米稀土磁粉於指尖流淌，隨光線多維折射出如銀河懸浮般的幽邃景深。',
    tags: ['雙磁推光', '懸浮景深', '無顆粒流光'],
    image: '/frames/emma_090.jpg',
    featured: true,
  },
  {
    id: 'art-04',
    series: 'SERIES 04',
    title: '月影青嵐',
    englishTitle: 'Moonlit Jade Mist',
    description: '溫潤青玉透光底色，暈染出朦朧月暈，指尖轉折間如清泉流石般自然空靈。',
    tags: ['微弧高點', '透光玉潤', '漸層水光'],
    image: '/frames/emma_135.jpg',
    featured: false,
  },
  {
    id: 'art-05',
    series: 'SERIES 05',
    title: '黑曜玄晶',
    englishTitle: 'Obsidian Crystal Apex',
    description: '純粹暗黑曜石深邃底色，覆以高抗刮澄澈水晶玻璃封層，極致耐看且具現代建築氣度。',
    tags: ['純手工金雕', '深邃黑曜', '高透耐磨'],
    image: '/frames/emma_180.jpg',
    featured: false,
  },
  {
    id: 'art-06',
    series: 'SERIES 06',
    title: '水光極光',
    englishTitle: 'Aurora Glass Seal',
    description: '極致清透的高透極光折射，在室內燈光與日光下變換細膩光澤，純粹百搭。',
    tags: ['高透極光', '微弧高點', '極光折射'],
    image: '/frames/emma_240.jpg',
    featured: false,
  },
]

export function getPortfolioStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse portfolio store:', err)
  }
  return DEFAULT_PORTFOLIO
}

export function savePortfolioStore(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(items))
    window.dispatchEvent(new Event('ekuo_portfolio_updated'))
  } catch (err) {
    console.error('Failed to save portfolio store:', err)
  }
}

export function addPortfolioItem(item) {
  const current = getPortfolioStore()
  const newItem = {
    ...item,
    id: 'art-' + Date.now(),
  }
  const updated = [newItem, ...current]
  savePortfolioStore(updated)
  return newItem
}

export function deletePortfolioItem(id) {
  const current = getPortfolioStore()
  const updated = current.filter((item) => item.id !== id)
  savePortfolioStore(updated)
  return updated
}

// ==========================================
// LINE OFFICIAL & MESSAGING API CONFIGURATION
// ==========================================

export const DEFAULT_LINE_CONFIG = {
  channelAccessToken: '', // LINE Developers Channel Access Token (long-lived)
  officialAccountId: '@060knwhx', // LINE 官方帳號 ID
  adminNotifyTargetId: 'U901b7127c1c3a01098cfcdff1083c941', // 主理人 LINE User ID (格式: Uxxxxxxxx...)
  autoPushEnabled: true,
  salonNotice: '✦ 請提前 5-10 分鐘抵達工坊。\n✦ 建議保留甲床自然長度 2mm 以上，以利立體建構打底。\n✦ 門市備有精緻茶點與氣泡水，請放鬆享受專屬時段。',
  salonAddress: '台北市大安區敦化南路一段 (高訂預約制私享工坊)',
  salonMapUrl: 'https://maps.google.com/?q=Taipei+DaAn',
}

export function getLineConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LINE_CONFIG)
    if (raw) {
      const merged = { ...DEFAULT_LINE_CONFIG, ...JSON.parse(raw) }
      if (!merged.officialAccountId || merged.officialAccountId === '@ekuo_nails') {
        merged.officialAccountId = '@060knwhx'
      }
      if (!merged.adminNotifyTargetId) {
        merged.adminNotifyTargetId = 'U901b7127c1c3a01098cfcdff1083c941'
      }
      return merged
    }
  } catch (err) {
    console.warn('Failed to parse line config store:', err)
  }
  return DEFAULT_LINE_CONFIG
}

export function saveLineConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.LINE_CONFIG, JSON.stringify(config))
    window.dispatchEvent(new Event('ekuo_line_config_updated'))
  } catch (err) {
    console.error('Failed to save line config store:', err)
  }
}
