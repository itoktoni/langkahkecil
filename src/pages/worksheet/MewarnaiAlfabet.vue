<template>
  <div ref="container" class="ws-container">
    <div v-for="(pair, i) in letterPairs" :key="pair.upper" class="ws-page">
      <div class="ws-header">
        <div class="ws-header-box title-box">
          <span class="ws-title">Mewarnai Huruf</span>
        </div>
        <div class="ws-header-box name-box">
          <span class="ws-label">Nama:</span>
          <div class="ws-name-line"></div>
        </div>
      </div>
      <div class="ws-letter-area">
        <span class="ws-letter ws-upper">{{ pair.upper }}</span>
        <span class="ws-letter ws-lower">{{ pair.lower }}</span>
      </div>
      <div class="ws-footer">
        <span class="ws-page-num">{{ i + 1 }} / {{ letterPairs.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const letterPairs = alphabets.map(u => ({ upper: u, lower: u.toLowerCase() }))
const container = ref(null)

defineExpose({ container })
</script>

<style scoped>
.ws-container {
  position: fixed;
  left: -9999px;
  top: 0;
}

.ws-page {
  width: 210mm;
  height: 297mm;
  padding: 12mm 15mm;
  background: white;
  display: flex;
  flex-direction: column;
  font-family: 'Fredoka', sans-serif;
  border: 3px solid #B7D9BC;
  page-break-after: always;
}

.ws-header {
  display: flex;
  gap: 8px;
  margin-bottom: 6mm;
}

.ws-header-box {
  flex: 1;
  border: 2.5px solid #222;
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
}

.title-box { justify-content: center; }
.ws-title { font-size: 20px; font-weight: 700; color: #222; }
.name-box { gap: 10px; }
.ws-label { font-size: 18px; font-weight: 700; color: #222; white-space: nowrap; }
.ws-name-line { flex: 1; border-bottom: 2.5px dashed #aaa; min-height: 22px; }

.ws-letter-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10mm;
}

.ws-letter {
  font-weight: 900;
  color: white;
  -webkit-text-stroke: 3px #222;
  paint-order: stroke fill;
  line-height: 1;
  user-select: none;
}

.ws-upper { font-size: 220px; }
.ws-lower { font-size: 180px; }

.ws-footer {
  text-align: center;
  padding-top: 4mm;
  border-top: 1.5px solid #ddd;
}

.ws-page-num { font-size: 10px; color: #999; }
</style>
