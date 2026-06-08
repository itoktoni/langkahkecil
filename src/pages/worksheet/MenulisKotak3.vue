<template>
  <div class="ws-wrapper">
    <div class="ws-toolbar">
      <button class="ws-btn-close" @click="$emit('close')">✕</button>
      <div class="ws-toolbar-title">✍️ Menulis Huruf di Kotak (html2canvas)</div>
      <div class="ws-toolbar-options">
        <select v-model="letterCase" class="ws-select">
          <option value="upper">Huruf Besar (A)</option>
          <option value="lower">Huruf Kecil (a)</option>
          <option value="both">Keduanya (A a)</option>
        </select>
      </div>
      <div class="ws-toolbar-actions">
        <button class="ws-btn" @click="downloadPDF" :disabled="generating">
          {{ generating ? 'Membuat PDF...' : '⬇️ Download PDF' }}
        </button>
      </div>
    </div>

    <div ref="printArea" class="ws-container">
      <div v-for="(page, pi) in pages" :key="pi" ref="pageRefs" class="ws-page">
        <div class="ws-header">
          <div class="ws-header-box title-box">
            <span class="ws-title">Menulis Huruf di Kotak</span>
          </div>
          <div class="ws-header-box name-box">
            <span class="ws-label">Nama:</span>
            <div class="ws-name-line"></div>
          </div>
        </div>
        <div class="ws-grid">
          <template v-for="(item, i) in page" :key="i">
            <span class="ws-grid-letter">{{ letterCase === 'both' ? item.display : displayLetter(item) }}</span>
            <span v-for="n in 4" :key="n" class="ws-grid-box"></span>
          </template>
        </div>
        <div class="ws-footer">
          <span class="ws-page-num">{{ pi + 1 }} / {{ pages.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'

const emit = defineEmits(['close'])

const letterPairs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(u => ({ upper: u, lower: u.toLowerCase() }))
const generating = ref(false)
const letterCase = ref('upper')
const printArea = ref(null)
const pageRefs = ref([])

function displayLetter(pair) {
  if (letterCase.value === 'upper') return pair.upper
  if (letterCase.value === 'lower') return pair.lower
  return `${pair.upper}${pair.lower}`
}

const pages = computed(() => {
  const chunk = (arr, size) => {
    const result = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  if (letterCase.value === 'both') {
    const expanded = []
    for (const pair of letterPairs) {
      expanded.push({ upper: pair.upper, lower: pair.lower, display: pair.upper })
      expanded.push({ upper: pair.upper, lower: pair.lower, display: pair.lower })
    }
    return chunk(expanded, 8)
  }
  return chunk(letterPairs, 4)
})

async function downloadPDF() {
  generating.value = true

  try {
    await new Promise(r => setTimeout(r, 300))

    const elements = pageRefs.value
    if (!elements.length) return

    const doc = new jsPDF('p', 'mm', 'a4')
    const W = 210, H = 297

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      if (!el) continue

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const imgW = W
      const imgH = (canvas.height * imgW) / canvas.width

      if (i > 0) doc.addPage()
      doc.addImage(imgData, 'JPEG', 0, 0, imgW, Math.min(imgH, H))
    }

    const suffix = letterCase.value === 'upper' ? 'Kapital' : letterCase.value === 'lower' ? 'Kecil' : 'Kapital-Kecil'
    doc.save(`Worksheet_MenulisKotak_html2canvas_${suffix}.pdf`)
  } catch (e) {
    console.error(e)
    alert('Gagal membuat PDF.')
  } finally {
    generating.value = false
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: #e8e8e8; font-family: 'helvetica', sans-serif; }

.ws-wrapper { padding-top: 60px; }

.ws-toolbar {
  position: fixed; top: 0; left: 0; right: 0;
  background: linear-gradient(135deg, #E65100, #FB8C00);
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
  background: white; color: #E65100; border: none;
  padding: 8px 12px; border-radius: 10px;
  font-weight: 700; font-size: 13px; cursor: pointer;
  font-family: 'helvetica', sans-serif;
}
.ws-toolbar-actions { display: flex; gap: 8px; }

.ws-btn {
  background: white; color: #E65100; border: none;
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

.ws-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  gap: 6px 8px;
  align-content: start;
}
.ws-grid-letter {
  font-weight: 900;
  font-size: 28px;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.ws-grid-box {
  border: 2px solid #ccc;
  border-radius: 6px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 28px;
  color: #e0e0e0;
  user-select: none;
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
