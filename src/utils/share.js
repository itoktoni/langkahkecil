import { createApp, h } from 'vue'
import html2canvas from 'html2canvas-pro'
import ShareCard from '../components/ShareCard.vue'
import ShareChecklistCard from '../components/ShareChecklistCard.vue'

function generateRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

async function renderToCanvas(component, props) {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.zIndex = '-1'
  document.body.appendChild(container)

  const app = createApp({ render: () => h(component, props) })
  app.mount(container)

  await new Promise(r => setTimeout(r, 300))

  const el = container.firstElementChild
  const canvas = await html2canvas(el, {
    width: el.scrollWidth,
    height: el.scrollHeight,
    scale: 2,
    useCORS: true,
    backgroundColor: null
  })

  app.unmount()
  document.body.removeChild(container)

  return canvas
}

async function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

async function doShare(challenge, isComplete) {
  const refCode = challenge.referralCode || generateRefCode()
  const canvas = await renderToCanvas(ShareCard, {
    emoji: challenge.emoji || '🏆',
    challengeTitle: challenge.title,
    category: challenge.category,
    color: challenge.color || '#2e7d32',
    points: challenge.points,
    maxPoints: challenge.maxPoints,
    notes: challenge.notes || '',
    isComplete,
    childName: challenge.childName || 'Anak',
    referralCode: refCode
  })

  const blob = await canvasToBlob(canvas)
  const label = isComplete ? 'selesai' : 'progress'
  const file = new File([blob], `challenge-${challenge.title}-${label}.png`, { type: 'image/png' })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `Challenge: ${challenge.title}`,
        text: isComplete
          ? `Aku sudah menyelesaikan challenge "${challenge.title}" dengan ${challenge.maxPoints} poin! 🏆`
          : `Progress challenge "${challenge.title}": ${challenge.points}/${challenge.maxPoints} poin! 💪`,
        files: [file]
      })
      return
    } catch (e) {
      if (e.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `challenge-${challenge.title}-${label}.png`
  a.click()
  URL.revokeObjectURL(url)
}

export function shareChallenge(challenge) {
  return doShare(challenge, true)
}

export function shareProgress(challenge) {
  return doShare(challenge, false)
}

export async function shareChecklistImage(title, items, checkedCount, percent, options = {}) {
  const refCode = options.referralCode || generateRefCode()
  const canvas = await renderToCanvas(ShareChecklistCard, {
    title,
    items,
    checkedCount,
    percent,
    referralCode: refCode
  })

  const blob = await canvasToBlob(canvas)
  const file = new File([blob], `checklist-${title}.png`, { type: 'image/png' })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `Checklist: ${title}`,
        text: `Checklist "${title}": ${checkedCount}/${items.length} selesai! ✅`,
        files: [file]
      })
      return
    } catch (e) {
      if (e.name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `checklist-${title}.png`
  a.click()
  URL.revokeObjectURL(url)
}
