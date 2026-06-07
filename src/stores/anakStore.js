import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAnakList, saveAnak as dbSaveAnak, removeAnak as dbRemoveAnak } from '../db.js'

export const useAnakStore = defineStore('anak', () => {
  const anakList = ref([])

  const allHistory = computed(() => {
    return anakList.value
      .flatMap(a => (a.history || []).map(h => ({ ...h, anakNama: a.nama, anakEmoji: a.emoji })))
      .sort((a, b) => {
        const parse = s => {
          const [d, m, y] = s.split(' ')
          const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 }
          return new Date(y, months[m], d)
        }
        return parse(b.date) - parse(a.date)
      })
  })

  async function loadAnakList() {
    anakList.value = await getAnakList()
  }

  async function addAnak(anak) {
    const id = await dbSaveAnak(anak)
    anak.id = id
    anakList.value.push(anak)
    return id
  }

  async function updateAnak(anak) {
    await dbSaveAnak(anak)
  }

  async function deleteAnak(id) {
    await dbRemoveAnak(id)
    const idx = anakList.value.findIndex(a => a.id === id)
    if (idx > -1) anakList.value.splice(idx, 1)
  }

  function resetSubpilar({ anak, subpilar }) {
    const idx = anak.completedSubpilars.findIndex(s => s.key === subpilar.key)
    if (idx > -1) {
      anak.completedSubpilars.splice(idx, 1)
      anak.subpilars.push({ ...subpilar, progress: 0 })
    }
  }

  return {
    anakList, allHistory,
    loadAnakList, addAnak, updateAnak, deleteAnak, resetSubpilar
  }
})
