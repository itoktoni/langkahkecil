<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-6xl mx-auto pb-8">
    <div class="flex items-center justify-between mb-stack-lg">
      <h2 class="font-headline-md text-headline-md">Alat Bantu Bunda</h2>
      <AnakSelector :anak-list="anakList" v-model="selectedAnakId" />
    </div>

    <HafalanPage :hafalan="data.hafalan" :hafalan-history="data.hafalanHistory" @add-hafalan="onAddHafalan" @add-point="onAddPoint" @remove-point="onRemovePoint" @edit-hafalan="onEditHafalan" />
    <JadwalPage :schedules="data.schedules" />
    <ChecklistPage :checklist="data.checklist" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { hafalanByAnak, defaultHafalan } from '../data/hafalan.js'
import HafalanPage from './HafalanPage.vue'
import JadwalPage from './JadwalPage.vue'
import ChecklistPage from './ChecklistPage.vue'
import AnakSelector from '../components/AnakSelector.vue'

const props = defineProps({
  anakList: { type: Array, default: () => [] }
})

const selectedAnakId = ref(null)
const anakData = ref({})

const toolsDataByAnak = {
  1: {
    ...JSON.parse(JSON.stringify(hafalanByAnak[1] || defaultHafalan)),
    schedules: [
      { time: '07:00', label: 'Sarapan & Persiapan Sekolah', done: true },
      { time: '08:00', label: 'Belajar Membaca', done: true },
      { time: '16:00', label: 'Waktu Bermain Bebas', done: false },
      { time: '20:00', label: 'Membaca Buku', done: false }
    ],
    checklist: [
      { label: 'Membaca buku sebelum tidur', done: true },
      { label: 'Merapiikan mainan sendiri', done: false },
      { label: 'Minum air putih cukup', done: false },
      { label: 'Sholat 5 waktu', done: true }
    ]
  },
  2: {
    ...JSON.parse(JSON.stringify(hafalanByAnak[2] || defaultHafalan)),
    schedules: [
      { time: '07:30', label: 'Sarapan & Bermain', done: true },
      { time: '10:00', label: 'Belajar Menggambar', done: false },
      { time: '15:00', label: 'Tidur Siang', done: true }
    ],
    checklist: [
      { label: 'Sikat Gigi Sendiri', done: true },
      { label: 'Membereskan Mainan', done: false },
      { label: 'Makan Sendiri', done: true }
    ]
  }
}

const defaultData = {
  hafalan: [],
  hafalanHistory: [],
  schedules: [
    { time: '07:00', label: 'Sarapan', done: false },
    { time: '20:00', label: 'Tidur', done: false }
  ],
  checklist: [
    { label: 'Membaca buku', done: false }
  ]
}

function getData(anakId) {
  if (!anakData.value[anakId]) {
    anakData.value[anakId] = JSON.parse(JSON.stringify(toolsDataByAnak[anakId] || defaultData))
  }
  return anakData.value[anakId]
}

const data = computed(() => getData(selectedAnakId.value))

function onAddHafalan(item) {
  data.value.hafalan.push(item)
}

function onAddPoint({ id, amount }) {
  const h = data.value.hafalan.find(h => h.id === id)
  if (h) {
    h.points = Math.min(h.maxPoints, h.points + amount)
  }
}

function onFinishHafalan({ id }) {
  const idx = data.value.hafalan.findIndex(h => h.id === id)
  if (idx > -1) {
    const h = data.value.hafalan.splice(idx, 1)[0]
    data.value.hafalanHistory.unshift({
      id: h.id, title: h.title, category: h.category,
      emoji: h.emoji, bg: h.bg, maxPoints: h.maxPoints
    })
  }
}

function onRemovePoint({ id }) {
  const h = data.value.hafalan.find(h => h.id === id)
  if (h) {
    h.points = Math.max(0, h.points - 1)
  }
}

function onEditHafalan(editData) {
  const h = data.value.hafalan.find(h => h.id === editData.id)
  if (h) {
    h.category = editData.category
    h.title = editData.title
    h.notes = editData.notes
    h.emoji = editData.emoji
    h.bg = editData.bg
    h.color = editData.color
    h.maxPoints = editData.maxPoints
  }
}

watch(() => props.anakList, (list) => {
  if (list.length && !selectedAnakId.value) {
    selectedAnakId.value = list[list.length - 1].id
  }
}, { immediate: true })
</script>
