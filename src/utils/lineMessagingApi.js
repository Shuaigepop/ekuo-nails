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
            letterSpacing: '2px',
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
          // Booking Details Key-Value Rows
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
                  { type: 'text', text: '預約時段', color: '#6B7A75', size: 'xs', width: '70px' },
                  { type: 'text', text: `${dateStr} · ${slot}`, color: '#E2E6E5', size: 'xs', weight: 'bold', flex: 1 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '預約款式', color: '#6B7A75', size: 'xs', width: '70px' },
                  { type: 'text', text: design, color: '#F4F7F6', size: 'xs', weight: 'bold', flex: 1 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '貴賓聯絡', color: '#6B7A75', size: 'xs', width: '70px' },
                  { type: 'text', text: contact, color: '#C5CECB', size: 'xs', flex: 1 },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: '工坊地點', color: '#6B7A75', size: 'xs', width: '70px' },
                  { type: 'text', text: address, color: '#C5CECB', size: 'xs', wrap: true, flex: 1 },
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
                margin: 'none',
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
 * Generates direct LINE deep link pre-filling the message text
 */
export function getLineDeepLink({ booking, config }) {
  const oaId = (config?.officialAccountId || '@ekuo_nails').replace(/^@/, '')
  const bookingId = booking.id || `RES-${Date.now().toString().slice(-4)}`
  const guestName = booking.guestName || '貴賓'
  const dateStr = booking.dateStr || ''
  const slot = booking.slot || ''
  const design = booking.selectedDesign || '客製高訂款'
  const contact = booking.contactInfo || ''

  const prefilledText =
`【Ekuo NAILS 私人高訂預約憑證】
預約單號：#${bookingId}
貴賓尊稱：${guestName}
預約時段：${dateStr} · ${slot}
指定款式：${design}
聯絡資訊：${contact}

我已於官網提交席位預約，請確認我的高訂時段！`

  // Direct line.me URL scheme that opens official account and pre-fills message
  return `https://line.me/R/oaMessage/@${oaId}/?${encodeURIComponent(prefilledText)}`
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
