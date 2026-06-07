async function generateImage(challenge, isComplete) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0, '#1B5E20')
  grad.addColorStop(1, '#2E7D32')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.arc(200 + i * 180, 300 + (i % 2) * 200, 120 + i * 30, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 72px Nunito Sans, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(isComplete ? 'Challenge Selesai!' : 'Progress Challenge', canvas.width / 2, 400)

  ctx.font = '200px Nunito Sans, sans-serif'
  ctx.fillText(challenge.emoji || '🏆', canvas.width / 2, 680)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 64px Nunito Sans, sans-serif'
  ctx.fillText(challenge.title, canvas.width / 2, 850)

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '40px Nunito Sans, sans-serif'
  ctx.fillText(challenge.category, canvas.width / 2, 920)

  const percent = Math.min(100, Math.round((challenge.points / challenge.maxPoints) * 100))
  const barY = 1050
  const barW = 700
  const barH = 50
  const barX = (canvas.width - barW) / 2

  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW, barH, 25)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW * (percent / 100), barH, 25)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 80px Nunito Sans, sans-serif'
  ctx.fillText(`${challenge.points} / ${challenge.maxPoints} Poin`, canvas.width / 2, 1230)

  if (challenge.notes) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '36px Nunito Sans, sans-serif'
    const lines = wrapText(ctx, challenge.notes, 800)
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, 1340 + i * 50)
    })
  }

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '36px Nunito Sans, sans-serif'
  ctx.fillText('Halo Bunda - Aplikasi Pengembangan Anak', canvas.width / 2, 1800)

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

async function doShare(challenge, isComplete) {
  const blob = await generateImage(challenge, isComplete)
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

export async function shareChecklistImage(title, items, checkedCount, percent) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0, '#0D47A1')
  grad.addColorStop(1, '#1976D2')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.arc(200 + i * 180, 300 + (i % 2) * 200, 120 + i * 30, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 72px Nunito Sans, sans-serif'
  ctx.fillText('Checklist Harian', canvas.width / 2, 350)

  ctx.font = 'bold 64px Nunito Sans, sans-serif'
  ctx.fillText(title, canvas.width / 2, 470)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 80px Nunito Sans, sans-serif'
  ctx.fillText(`${checkedCount} / ${items.length}`, canvas.width / 2, 620)

  const barY = 700
  const barW = 700
  const barH = 50
  const barX = (canvas.width - barW) / 2

  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW, barH, 25)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(barX, barY, barW * (percent / 100), barH, 25)
  ctx.fill()

  const startY = 860
  ctx.textAlign = 'left'
  ctx.font = '44px Nunito Sans, sans-serif'
  items.forEach((item, i) => {
    const y = startY + i * 70
    const icon = item.done ? '✅' : '⬜'
    ctx.fillStyle = item.done ? '#FFFFFF' : 'rgba(255,255,255,0.6)'
    ctx.fillText(`${icon}  ${item.label}`, 180, y)
  })

  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '36px Nunito Sans, sans-serif'
  ctx.fillText('Halo Bunda - Aplikasi Pengembangan Anak', canvas.width / 2, 1800)

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
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
