<template>
  <div class="ws-wrapper">
    <div class="ws-toolbar">
      <button class="ws-btn-close" @click="$emit('close')">✕</button>
      <div class="ws-toolbar-title">✍️ Menulis Angka (1-10)</div>
      <div class="ws-toolbar-actions">
        <button class="ws-btn" @click="downloadPDF" :disabled="generating">
          {{ generating ? 'Membuat PDF...' : '⬇️ Download PDF' }}
        </button>
      </div>
    </div>

    <div class="ws-container">
      <div v-for="(num, i) in numbers" :key="num" class="ws-page">
        <div class="ws-header">
          <div class="ws-header-box title-box">
            <span class="ws-title">Menulis Angka {{ num }}</span>
          </div>
          <div class="ws-header-box name-box">
            <span class="ws-label">Nama:</span>
            <div class="ws-name-line"></div>
          </div>
        </div>
        <div class="ws-guide-section">
          <div class="ws-guide-label">Contoh:</div>
          <div class="ws-guide-box">
            <span class="ws-guide-letter">{{ num }}</span>
          </div>
        </div>
        <div class="ws-practice-section">
          <div class="ws-practice-label">Latihan:</div>
          <div v-for="n in 5" :key="n" class="ws-practice-row">
            <span class="ws-practice-hint">{{ num }}</span>
            <div class="ws-practice-line"></div>
          </div>
        </div>
        <div class="ws-footer">
          <span class="ws-page-num">{{ i + 1 }} / {{ numbers.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'

const emit = defineEmits(['close'])

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const generating = ref(false)

function downloadPDF() {
  generating.value = true

  setTimeout(() => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const W = 210, H = 297, M = 15, CW = W - M * 2

    for (let i = 0; i < numbers.length; i++) {
      if (i > 0) doc.addPage()
      const num = numbers[i]

      drawBorder(doc, W, H)
      drawTitleBox(doc, M, CW, `Menulis Angka ${num}`)
      drawGuideBox(doc, M, CW, W, String(num), 250)
      drawPracticeLines(doc, M, CW, W, H, String(num), 50, 5)
      drawPageNum(doc, W, H, i + 1, numbers.length)
    }

    doc.save('Worksheet_MenulisAngka_1-10.pdf')
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

function drawGuideBox(doc, M, CW, W, letter, fontSize) {
  const guideY = 40
  const guideH = 90
  const adjustY = 115

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
  doc.text(letter, W / 2, adjustY, { align: 'center' })
}

function drawPracticeLines(doc, M, CW, W, H, letter, fontSize, numLines) {
  const practiceY = 148
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Latihan:', M + 4, practiceY)

  const lineStartY = practiceY
  const lineSpacing = 23
  const hintX = M + 10
  const hintDraw = M + 30

  for (let n = 0; n < numLines; n++) {
    const ly = lineStartY + n * lineSpacing
    if (ly + lineSpacing > H - 26) break

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(fontSize)
    doc.setTextColor(215, 215, 215)
    doc.text(letter, hintX, ly + 80 * 0.3, { align: 'center' })

    doc.setDrawColor(183, 217, 188)
    doc.setLineWidth(0.5)
    doc.setLineDashPattern([3, 3], 0)
    doc.line(hintDraw, ly + 10, M + CW - 10, ly + 10)
    doc.setLineDashPattern([], 0)

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(hintDraw, ly + 24, M + CW - 10, ly + 24)
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
  background: linear-gradient(135deg, #6A1B9A, #8E24AA);
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
.ws-toolbar-actions { display: flex; gap: 8px; }

.ws-btn {
  background: white; color: #6A1B9A; border: none;
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

.ws-footer { text-align: center; padding-top: 4mm; border-top: unset; }
.ws-page-num { font-size: 10px; color: #999; }

@media print {
  html, body { background: white; }
  .ws-toolbar { display: none; }
  .ws-wrapper { padding-top: 0; }
  .ws-container { padding: 0; gap: 0; }
  .ws-page {
    box-shadow: none;
    border: none;
    page-break-after: always;
    width: 100%;
    min-height: 0;
    height: 297mm;
    padding: 12mm 15mm;
    overflow: hidden;
  }
  .ws-page:last-child { page-break-after: auto; }
}
</style>
