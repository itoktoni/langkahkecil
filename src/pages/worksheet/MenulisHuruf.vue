<template>
  <div class="ws-wrapper">
    <div class="ws-toolbar">
      <button class="ws-btn-close" @click="$emit('close')">✕</button>
      <div class="ws-toolbar-title">✍️ Menulis Huruf (A-Z)</div>
      <div class="ws-toolbar-options">
        <select v-model="letterCase" class="ws-select">
          <option value="upper">Huruf Besar (A)</option>
          <option value="lower">Huruf Kecil (a)</option>
          <option value="both">Keduanya (A a)</option>
          <option value="group4">Gabungan 4 Huruf</option>
        </select>
      </div>
      <div class="ws-toolbar-actions">
        <button class="ws-btn" @click="downloadPDF" :disabled="generating">
          {{ generating ? 'Membuat PDF...' : '⬇️ Download PDF' }}
        </button>
      </div>
    </div>

    <div class="ws-container">
      <template v-if="letterCase !== 'group4'">
        <div v-for="(pair, i) in letterPairs" :key="pair.upper" class="ws-page">
          <div class="ws-header">
            <div class="ws-header-box title-box">
              <span class="ws-title">Menulis Huruf {{ displayLetter(pair) }}</span>
            </div>
            <div class="ws-header-box name-box">
              <span class="ws-label">Nama:</span>
              <div class="ws-name-line"></div>
            </div>
          </div>
          <div class="ws-guide-section">
            <div class="ws-guide-label">Contoh:</div>
            <div class="ws-guide-box">
              <span class="ws-guide-letter" :style="guideStyle">{{ displayLetter(pair) }}</span>
            </div>
          </div>
          <div class="ws-practice-section">
            <div class="ws-practice-label">Latihan:</div>
            <div v-for="n in 5" :key="n" class="ws-practice-row">
              <span class="ws-practice-hint" :style="hintStyle">{{ displayLetter(pair) }}</span>
              <div class="ws-practice-line"></div>
            </div>
          </div>
          <div class="ws-footer">
            <span class="ws-page-num">{{ i + 1 }} / {{ letterPairs.length }}</span>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(group, gi) in groupedLetters" :key="gi" class="ws-page">
          <div class="ws-header">
            <div class="ws-header-box title-box">
              <span class="ws-title">Menulis Huruf {{ group.map(p => p.upper).join(' ') }}</span>
            </div>
            <div class="ws-header-box name-box">
              <span class="ws-label">Nama:</span>
              <div class="ws-name-line"></div>
            </div>
          </div>
          <div v-for="(pair, pi) in group" :key="pair.upper" class="ws-group-item">
            <div class="ws-guide-section ws-guide-compact">
              <div class="ws-guide-label">{{ pair.upper }} {{ pair.lower }}:</div>
              <div class="ws-guide-box ws-guide-box-compact">
                <span class="ws-guide-letter ws-guide-letter-compact">{{ pair.upper }} {{ pair.lower }}</span>
              </div>
            </div>
            <div class="ws-practice-section ws-practice-compact">
              <div v-for="n in 3" :key="n" class="ws-practice-row ws-practice-row-compact">
                <span class="ws-practice-hint ws-practice-hint-compact">{{ pair.upper }} {{ pair.lower }}</span>
                <div class="ws-practice-line"></div>
              </div>
            </div>
          </div>
          <div class="ws-footer">
            <span class="ws-page-num">{{ gi + 1 }} / {{ groupedLetters.length }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'

const emit = defineEmits(['close'])

const letterPairs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(u => ({ upper: u, lower: u.toLowerCase() }))
const generating = ref(false)
const letterCase = ref('upper')

const groupedLetters = computed(() => {
  const groups = []
  for (let i = 0; i < letterPairs.length; i += 4) {
    groups.push(letterPairs.slice(i, i + 4))
  }
  return groups
})

function displayLetter(pair) {
  if (letterCase.value === 'upper') return pair.upper
  if (letterCase.value === 'lower') return pair.lower
  return `${pair.upper} ${pair.lower}`
}

const guideStyle = computed(() => {
  if (letterCase.value === 'both') return { fontSize: '160px' }
  return {}
})

const hintStyle = computed(() => {
  if (letterCase.value === 'both') return { fontSize: '36px' }
  return {}
})

function downloadPDF() {
  generating.value = true

  setTimeout(() => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const W = 210, H = 297, M = 15, CW = W - M * 2

    if (letterCase.value === 'upper') {
      for (let i = 0; i < 26; i++) {
        if (i > 0) doc.addPage()
        drawBorder(doc, W, H)
        const pair = letterPairs[i]
        const letter = pair.upper

        drawTitleBox(doc, M, CW, `Menulis Huruf ${letter}`)
        drawGuideBox(doc, M, CW, W, H - 100, letter, 250)
        drawPracticeLines(doc, M, CW, W, H, letter, 120, 5)
        drawPageNum(doc, W, H, i + 1, 26)
      }
      doc.save('Worksheet_MenulisHuruf_Kapital.pdf')
    }

    if (letterCase.value === 'lower') {
      for (let i = 0; i < 26; i++) {
        if (i > 0) doc.addPage()
        drawBorder(doc, W, H)
        const pair = letterPairs[i]
        const letter = pair.lower

        drawTitleBox(doc, M, CW, `Menulis Huruf ${letter}`)
        drawGuideBox(doc, M, CW, W, H, letter, 350)
        drawPracticeLines(doc, M, CW, W, H, letter, 120, 5)
        drawPageNum(doc, W, H, i + 1, 26)
      }
      doc.save('Worksheet_MenulisHuruf_Kecil.pdf')
    }

    if (letterCase.value === 'both') {
      for (let i = 0; i < 26; i++) {
        if (i > 0) doc.addPage()
        drawBorder(doc, W, H)
        const pair = letterPairs[i]
        const letter = `${pair.upper} ${pair.lower}`

        drawTitleBox(doc, M, CW, `Menulis Huruf ${letter}`)
        drawGuideBox(doc, M, CW, W, H, letter, 200)
        drawPracticeLines(doc, M, CW, W, H, letter, 80, 5)
        drawPageNum(doc, W, H, i + 1, 26)
      }
      doc.save('Worksheet_MenulisHuruf_Kapital-Kecil.pdf')
    }

    if (letterCase.value === 'group4') {
      const groups = groupedLetters.value
      for (let gi = 0; gi < groups.length; gi++) {
        if (gi > 0) doc.addPage()
        drawBorder(doc, W, H)

        const group = groups[gi]
        const titleLetters = group.map(p => `${p.upper}${p.lower}`).join(' ')
        drawTitleBox(doc, M, CW, `Menulis Huruf ${titleLetters}`)

        const startY = 44
        const itemH = (H - startY - 20) / group.length

        for (let pi = 0; pi < group.length; pi++) {
          const pair = group[pi]
          const letter = `${pair.upper} ${pair.lower}`
          const baseY = startY + pi * itemH

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(10)
          doc.setTextColor(100, 100, 100)
          doc.text(`${pair.upper} ${pair.lower}:`, M + 2, baseY + 6)

          doc.setFont('helvetica', 'bold')
          doc.setFontSize(80)
          doc.setTextColor(230, 230, 230)
          doc.text(letter, M + CW - 5, baseY + itemH * 0.45, { align: 'right' })

          const lineStartY = baseY + 12
          const lineSpacing = (itemH - 16) / 3
          for (let n = 0; n < 3; n++) {
            const ly = lineStartY + n * lineSpacing

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(40)
            doc.setTextColor(215, 215, 215)
            doc.text(letter, M + 30, ly + lineSpacing * 0.55, { align: 'center' })

            doc.setDrawColor(183, 217, 188)
            doc.setLineWidth(0.5)
            doc.setLineDashPattern([3, 3], 0)
            doc.line(M + 60, ly + lineSpacing * 0.5, M + CW - 5, ly + lineSpacing * 0.5)
            doc.setLineDashPattern([], 0)

            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(0.3)
            doc.line(M + 60, ly + lineSpacing * 0.85, M + CW - 5, ly + lineSpacing * 0.85)
          }

          if (pi < group.length - 1) {
            doc.setDrawColor(220, 220, 220)
            doc.setLineWidth(0.3)
            doc.line(M, baseY + itemH, M + CW, baseY + itemH)
          }
        }

        drawPageNum(doc, W, H, gi + 1, groups.length)
      }
      doc.save('Worksheet_MenulisHuruf_Gabungan4.pdf')
    }

    generating.value = false
  }, 100)
}

function drawBorder(doc, W, H) {
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(1.5)
  doc.roundedRect(10, 10, W - 20, H - 20, 4, 4)
}

function drawTitleBox(doc, M, CW, title) {
  doc.setDrawColor(34, 34, 34)
  doc.setLineWidth(0.8)
  doc.roundedRect(M, 16, CW / 2 - 3, 18, 3, 3)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(34, 34, 34)
  doc.text(title, M + CW / 4 - 1.5, 28, { align: 'center' })

  doc.roundedRect(M + CW / 2 + 3, 16, CW / 2 - 3, 18, 3, 3)
  doc.setFontSize(16)
  doc.text('Nama:', M + CW / 2 + 9, 28)
}

function drawGuideBox(doc, M, CW, W, H, letter, fontSize) {
  const guideY = 48
  const guideH = 90
  doc.setDrawColor(34, 34, 34)
  doc.setLineWidth(0.5)
  doc.roundedRect(M, guideY, CW, guideH, 3, 3)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Contoh:', M + 4, guideY + 8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(fontSize)
  doc.setTextColor(230, 230, 230)
  doc.text(letter, W / 2, 125, { align: 'center' })
}

function drawPracticeLines(doc, M, CW, W, H, letter, fontSize, numLines) {
  const practiceY = 148
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Latihan:', M + 4, practiceY)

  const lineStartY = practiceY
  const lineSpacing = 38
  const hintX = M + 25

  for (let n = 0; n < numLines; n++) {
    const ly = lineStartY + n * lineSpacing
    if (ly + lineSpacing > H - 26) break

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(fontSize)
    doc.setTextColor(215, 215, 215)
    doc.text(letter, hintX, ly + fontSize * 0.3, { align: 'center' })

    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(0.5)
    doc.setLineDashPattern([3, 3], 0)
    doc.line(M + 50, ly + 7, M + CW - 10, ly + 7)
    doc.setLineDashPattern([], 0)

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(M + 50, ly + 36, M + CW - 10, ly + 36)
  }
}

function drawPageNum(doc, W, H, current, total) {
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(15, H - 20, W - 15, H - 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text(`${current} / ${total}`, W / 2, H - 14, { align: 'center' })
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: #e8e8e8; font-family: 'helvetica', sans-serif; }

.ws-wrapper { padding-top: 60px; }

.ws-toolbar {
  position: fixed; top: 0; left: 0; right: 0;
  background: linear-gradient(135deg, #1565C0, #1E88E5);
  color: white; padding: 12px 20px;
  display: flex; align-items: center; gap: 12px;
  z-index: 9999; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  font-family: 'helvetica', sans-serif;
}

.ws-btn-close {
  background: rgba(255,255,255,0.2); color: white; border: none;
  width: 36px; height: 36px; border-radius: 50%;
  font-size: 18px; cursor: pointer; font-weight: 700;
}

.ws-toolbar-title { font-size: 15px; font-weight: 700; flex: 1; }
.ws-toolbar-options { display: flex; gap: 8px; align-items: center; }
.ws-select {
  background: white; color: #1565C0; border: none;
  padding: 8px 12px; border-radius: 10px;
  font-weight: 700; font-size: 13px; cursor: pointer;
  font-family: 'helvetica', sans-serif;
}
.ws-toolbar-actions { display: flex; gap: 8px; }

.ws-btn {
  background: white; color: #1565C0; border: none;
  padding: 8px 16px; border-radius: 10px;
  font-weight: 700; font-size: 13px; cursor: pointer;
  font-family: 'helvetica', sans-serif;
}

.ws-btn:hover { transform: scale(1.03); }
.ws-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.ws-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.ws-page {
  width: 210mm;
  min-height: 297mm;
  padding: 12mm 15mm;
  background: white;
  display: flex;
  flex-direction: column;
  font-family: 'helvetica', sans-serif;
  border: 4px solid #000;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.ws-header { display: flex; gap: 8px; margin-bottom: 6mm; }
.ws-header-box {
  flex: 1; border: 2.5px solid #222; border-radius: 12px;
  padding: 10px 16px; display: flex; align-items: center;
}
.title-box { justify-content: center; }
.ws-title { font-size: 20px; font-weight: 700; color: #222; }
.name-box { gap: 10px; }
.ws-label { font-size: 18px; font-weight: 700; color: #222; white-space: nowrap; }
.ws-name-line { flex: 1; border-bottom: 2.5px dashed #aaa; min-height: 22px; }

.ws-guide-section {
  margin-bottom: 8mm;
  border: 2px solid #222;
  border-radius: 12px;
  padding: 4mm 6mm;
  flex-shrink: 0;
}
.ws-guide-label { font-size: 14px; font-weight: 700; color: #666; margin-bottom: 2mm; }
.ws-guide-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80mm;
  padding-bottom: 3rem;
}
.ws-guide-letter {
  font-weight: 900;
  color: #e6e6e6;
  font-size: 400px;
  line-height: 0;
  user-select: none;
}

.ws-practice-section { flex: 1; display: flex; flex-direction: column; }
.ws-practice-label { font-size: 14px; font-weight: 700; color: #666; margin-bottom: 3mm; }
.ws-practice-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6mm;
  position: relative;
  height: 28mm;
}
.ws-practice-hint {
  font-weight: 900;
  color: #e0e0e0;
  font-size: 100px;
  line-height: 1;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
  user-select: none;
}
.ws-practice-line {
  flex: 1;
  border-top: 2px dotted #ccc;
  border-bottom: 2px solid #ccc;
  height: 70px;
  margin-left: 50px;
}

.ws-group-item {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.ws-guide-compact {
  margin-bottom: 2mm;
  padding: 2mm 4mm;
}
.ws-guide-box-compact {
  min-height: 30mm;
}
.ws-guide-letter-compact {
  font-size: 80px;
}
.ws-practice-compact {
  flex: none;
}
.ws-practice-row-compact {
  height: 16mm;
  margin-bottom: 2mm;
}
.ws-practice-hint-compact {
  font-size: 30px;
  width: 60px;
}

.ws-footer { text-align: center; padding-top: 4mm; border-top: unset; }
.ws-page-num { font-size: 10px; color: #999; }

@media print {
  html, body { background: white; }
  .ws-toolbar { display: none; }
  .ws-wrapper { padding-top: 0; }
  .ws-container { padding: 0; gap: 0; }
  .ws-page { box-shadow: none; page-break-after: always; }
}
</style>
