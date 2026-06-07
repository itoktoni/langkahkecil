import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getChallenges, saveChallenge as dbSaveChallenge, removeChallenge as dbRemoveChallenge,
  getChallengeHistory, saveChallengeHistory as dbSaveChallengeHistory,
  getChecklists, saveChecklist as dbSaveChecklist, removeChecklist as dbRemoveChecklist,
  getSchedules, saveSchedule as dbSaveSchedule, removeSchedule as dbRemoveSchedule,
  getWorksheets, saveWorksheet as dbSaveWorksheet, removeWorksheet as dbRemoveWorksheet
} from '../db.js'

export const useToolsStore = defineStore('tools', () => {
  const anakToolsData = ref({})
  const toolsAnakId = ref(null)

  const emptyToolsData = { challenges: [], challengeHistory: [], checklists: [], schedules: [], worksheets: [] }

  function getAnakToolsData(anakId) {
    if (!anakToolsData.value[anakId]) {
      anakToolsData.value[anakId] = JSON.parse(JSON.stringify(emptyToolsData))
    }
    return anakToolsData.value[anakId]
  }

  const toolsData = computed(() => getAnakToolsData(toolsAnakId.value))

  async function loadToolsData(anakList) {
    for (const anak of anakList) {
      const challenges = await getChallenges(anak.id)
      const challengeHistory = await getChallengeHistory(anak.id)
      const checklists = await getChecklists(anak.id)
      const schedules = await getSchedules(anak.id)
      const worksheets = await getWorksheets(anak.id)
      anakToolsData.value[anak.id] = { challenges, challengeHistory, checklists, schedules, worksheets }
    }
    if (anakList.length && !toolsAnakId.value) {
      toolsAnakId.value = anakList[0].id
    }
  }

  // Challenge
  function addChallenge(item) {
    toolsData.value.challenges.push(item)
    dbSaveChallenge({ ...item, anakId: toolsAnakId.value })
  }

  function addPoint({ id, amount }) {
    const c = toolsData.value.challenges.find(c => c.id === id)
    if (c) {
      c.points = Math.min(c.maxPoints, c.points + amount)
      dbSaveChallenge({ ...c, anakId: toolsAnakId.value })
    }
  }

  function removePoint({ id }) {
    const c = toolsData.value.challenges.find(c => c.id === id)
    if (c) {
      c.points = Math.max(0, c.points - 1)
      dbSaveChallenge({ ...c, anakId: toolsAnakId.value })
    }
  }

  function editChallenge(data) {
    const c = toolsData.value.challenges.find(c => c.id === data.id)
    if (c) {
      Object.assign(c, data)
      dbSaveChallenge({ ...c, anakId: toolsAnakId.value })
    }
  }

  function deleteChallenge({ id }) {
    const idx = toolsData.value.challenges.findIndex(c => c.id === id)
    if (idx > -1) {
      toolsData.value.challenges.splice(idx, 1)
      dbRemoveChallenge(id)
    }
  }

  // Challenge History
  function addChallengeHistory(item) {
    toolsData.value.challengeHistory.push(item)
    dbSaveChallengeHistory({ ...item, anakId: toolsAnakId.value })
  }

  // Checklist
  function addChecklist(item) {
    toolsData.value.checklists.push(item)
    dbSaveChecklist({ ...item, anakId: toolsAnakId.value })
  }

  function removeChecklist(index) {
    const removed = toolsData.value.checklists.splice(index, 1)[0]
    if (removed?.id) dbRemoveChecklist(removed.id)
  }

  function addChecklistItem({ checklistId, item }) {
    const cl = toolsData.value.checklists.find(c => c.id === checklistId)
    if (cl) {
      cl.items.push(item)
      dbSaveChecklist({ ...cl, anakId: toolsAnakId.value })
    }
  }

  function removeChecklistItem({ checklistId, itemIndex }) {
    const cl = toolsData.value.checklists.find(c => c.id === checklistId)
    if (cl) {
      cl.items.splice(itemIndex, 1)
      dbSaveChecklist({ ...cl, anakId: toolsAnakId.value })
    }
  }

  // Schedule
  function addSchedule(item) {
    toolsData.value.schedules.push(item)
    dbSaveSchedule({ ...item, anakId: toolsAnakId.value })
  }

  function removeSchedule(item) {
    const idx = toolsData.value.schedules.indexOf(item)
    if (idx > -1) {
      toolsData.value.schedules.splice(idx, 1)
      if (item.id) dbRemoveSchedule(item.id)
    }
  }

  // Worksheet
  async function addWorksheet(item) {
    const id = await dbSaveWorksheet({ ...item, anakId: toolsAnakId.value })
    item.id = id
    toolsData.value.worksheets.push(item)
    return id
  }

  function removeWorksheetItem(id) {
    const idx = toolsData.value.worksheets.findIndex(w => w.id === id)
    if (idx > -1) {
      toolsData.value.worksheets.splice(idx, 1)
      dbRemoveWorksheet(id)
    }
  }

  return {
    toolsAnakId, toolsData,
    loadToolsData,
    addChallenge, addPoint, removePoint, editChallenge, deleteChallenge, addChallengeHistory,
    addChecklist, removeChecklist, addChecklistItem, removeChecklistItem,
    addSchedule, removeSchedule,
    addWorksheet, removeWorksheetItem
  }
})
