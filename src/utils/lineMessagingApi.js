/**
 * Ekuo NAILS - LINE Messaging API & Deep Link Engine
 * Connects to LINE Official Account and pushes Haute Couture Flex Message reservation tickets.
 */

/**
 * Builds an ultra-luxury Obsidian & Gold Flex Message Ticket
 */
export function buildReservationFlexMessage({ booking, config }) {
  const brandName = 'Ekuo NAILS'
  const bookingId = booking.id || `RES-${Date.now().toString().slice(-4)}`
  const guestName = booking.guestName || '貴賓'
  const dateStr = booking.dateStr || '2026年 11月 18日'
  const slot = booking.slot || '14:00'
  const design = booking.selectedDesign || '客製高訂款'
  const contact = booking.contactInfo || '已提交'
  const notice = config.salonNotice || '✦ 請提前 5-10 分鐘抵達工坊。\n✦ 建議保留甲床自然長度 2mm 以上。'
  const address = config.salonAddress || '台北市大安區敦化南路一段 (高訂預約制私享空間)'
  const mapUrl = config.salonMapUrl || 'https://maps.google.com/?q=Taipei+DaAn'

  return {
    type: 'flex',
    altText: `【${brandName}】高訂預約憑證 - ${guestName} 席位確認`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#070b09',
        paddingAll: '20px',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: brandName,
                weight: 'bold',
                color: '#F4F7F6',
                size: 'lg',
                flex: 1,
              },
              {
                type: 'text',
                text: `#${bookingId}`,
                color: '#8BB0A5',
                size: 'xs',
                align: 'end',
                gravity: 'center',
              },
            ],
          },
          {
            type: 'text',
            text: '✦ HAUTE COUTURE APPOINTMENT ✦',
            color: '#8E9A96',
            size: 'xxs',
            margin: 'sm',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0c120f',
        paddingAll: '22px',
        contents: [
          {
            type: 'text',
            text: `尊貴的 ${guestName} 您好`,
            weight: 'bold',
            color: '#F4F7F6',
            size: 'md',
          },
          {
            type: 'text',
            text: '您的專屬沙龍時段已完成預留，詳細憑證如下：',
            color: '#A9B5B2',
            size: 'xs',
            margin: 'xs',
          },
          {
            type: 'separator',
            margin: 'lg',
            color: '#1a2923',
          },
          // Booking Details Key-Value Rows (Flex 2 : Flex 5 ratio)
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '預約時段', color: '#6B7A75', size: 'xs', flex: 2 },
                  { type: 'text', text: `${dateStr} · ${slot}`, color: '#E2E6E5', size: 'xs', weight: 'bold', flex: 5 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '預約款式', color: '#6B7A75', size: 'xs', flex: 2 },
                  { type: 'text', text: design, color: '#F4F7F6', size: 'xs', weight: 'bold', flex: 5 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '貴賓聯絡', color: '#6B7A75', size: 'xs', flex: 2 },
                  { type: 'text', text: contact, color: '#C5CECB', size: 'xs', flex: 5 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '工坊地點', color: '#6B7A75', size: 'xs', flex: 2 },
                  { type: 'text', text: address, color: '#C5CECB', size: 'xs', wrap: true, flex: 5 },
                ],
              },
            ],
          },
          {
            type: 'separator',
            margin: 'lg',
            color: '#1a2923',
          },
          // Salon Rules & Notice
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            backgroundColor: '#070b09',
            paddingAll: '12px',
            cornerRadius: '6px',
            contents: [
              {
                type: 'text',
                text: '【主理人到店溫馨須知】',
                color: '#8BB0A5',
                size: 'xxs',
                weight: 'bold',
              },
              {
                type: 'text',
                text: notice,
                color: '#8E9A96',
                size: 'xxs',
                wrap: true,
                margin: 'xs',
                lineSpacing: '3px',
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#070b09',
        paddingAll: '16px',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#2d4239',
            height: 'sm',
            action: {
              type: 'uri',
              label: '導航至工坊地圖',
              uri: mapUrl,
            },
          },
          {
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: '聯繫主理人客服',
              uri: `https://line.me/R/ti/p/${config.officialAccountId || '@ekuo_nails'}`,
            },
          },
        ],
      },
    },
  }
}

/**
 * Formats standard plain text reservation ticket
 */
export function formatReservationText({ booking }) {
  const bookingId = booking?.id || `RES-${Date.now().toString().slice(-4)}`
  const guestName = booking?.guestName || '貴賓'
  const dateStr = booking?.dateStr || ''
  const slot = booking?.slot || ''
  const design = booking?.selectedDesign || '客製高訂款'
  const contact = booking?.contactInfo || ''

  return `【Ekuo NAILS 私人高訂預約憑證】
預約單號：#${bookingId}
貴賓尊稱：${guestName}
預約時段：${dateStr} · ${slot}
指定款式：${design}
聯絡資訊：${contact}

我已於官網提交席位預約，請確認我的高訂時段！`
}

/**
 * Generates direct LINE deep link pre-filling the message text.
 * Intelligently handles:
 * - OA IDs (e.g. "@060knwhx" or "060knwhx")
 * - lin.ee short links (e.g. "https://lin.ee/xxxxx")
 * - line.me full URLs (e.g. "https://line.me/R/ti/p/@060knwhx")
 * - Personal LINE links (e.g. "https://line.me/ti/p/~...")
 */
export function getLineDeepLink({ booking, config }) {
  const rawInput = (config?.officialAccountId || '@060knwhx').trim()
  const prefilledText = formatReservationText({ booking })
  const encodedText = encodeURIComponent(prefilledText)

  // 1. If it's a lin.ee short link (e.g. https://lin.ee/xxxxx or lin.ee/xxxxx)
  if (rawInput.includes('lin.ee/')) {
    return rawInput.startsWith('http') ? rawInput : `https://${rawInput}`
  }

  // 2. If it's a full URL (e.g. https://line.me/R/ti/p/@060knwhx or https://line.me/ti/p/~someone)
  if (rawInput.startsWith('http://') || rawInput.startsWith('https://')) {
    // If it contains an @ID (like line.me/R/ti/p/@060knwhx or line.me/R/oaMessage/@060knwhx)
    const oaMatch = rawInput.match(/@([a-zA-Z0-9_\-]+)/)
    if (oaMatch && oaMatch[1]) {
      return `https://line.me/R/oaMessage/@${oaMatch[1]}/?${encodedText}`
    }

    // If it contains personal tilde ~ID
    const personalMatch = rawInput.match(/ti\/p\/~([a-zA-Z0-9_\-]+)/)
    if (personalMatch && personalMatch[1]) {
      return rawInput
    }

    // If it's an existing oaMessage link
    if (rawInput.includes('/oaMessage/')) {
      return rawInput.includes('?') ? `${rawInput}&${encodedText}` : `${rawInput}/?${encodedText}`
    }

    // Any other direct URL
    return rawInput
  }

  // 3. If it's an ID (e.g. "@060knwhx", "060knwhx", or legacy "ekuo_nails")
  let cleanId = rawInput.replace(/^@/, '')
  if (!cleanId || cleanId === 'ekuo_nails') {
    cleanId = '060knwhx'
  }

  // Direct line.me URL scheme that opens official account and pre-fills message
  return `https://line.me/R/oaMessage/@${cleanId}/?${encodedText}`
}

/**
 * Sends LINE Push Notification via LINE Messaging API
 */
export async function sendLineReservationNotification({ booking, config }) {
  if (!config || !config.channelAccessToken) {
    console.info('LINE Channel Access Token not configured yet. Skipping direct API push.')
    return { success: false, reason: 'NO_TOKEN' }
  }

  const targetId = config.adminNotifyTargetId
  if (!targetId) {
    console.warn('LINE Admin Target ID not set. Set your LINE User ID in Admin Mode.')
    return { success: false, reason: 'NO_TARGET_ID' }
  }

  const flexMessage = buildReservationFlexMessage({ booking, config })

  try {
    const res = await fetch('/line-api/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: targetId,
        messages: [flexMessage],
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('LINE Messaging API error:', res.status, errText)
      return { success: false, error: errText }
    }

    const data = await res.json()
    console.info('LINE Messaging API push sent successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Failed to send LINE notification:', err)
    return { success: false, error: err.message }
  }
}
