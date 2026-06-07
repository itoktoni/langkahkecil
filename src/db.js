import Dexie from 'dexie'

const db = new Dexie('HaloBunda')

db.version(2).stores({
  anak: '++id, nama',
  challenges: '++id, anakId, category',
  challengeHistory: '++id, anakId, category',
  checklists: '++id, anakId',
  schedules: '++id, anakId',
  worksheets: '++id, anakId',
  settings: 'key'
})

export default db

export async function getAnakList() {
  return db.anak.toArray()
}

export async function saveAnak(anak) {
  return db.anak.put(anak)
}

export async function removeAnak(id) {
  await db.transaction('rw', db.anak, db.challenges, db.challengeHistory, db.checklists, db.schedules, async () => {
    await db.anak.delete(id)
    await db.challenges.where('anakId').equals(id).delete()
    await db.challengeHistory.where('anakId').equals(id).delete()
    await db.checklists.where('anakId').equals(id).delete()
    await db.schedules.where('anakId').equals(id).delete()
  })
}

export async function getChallenges(anakId) {
  return db.challenges.where('anakId').equals(anakId).toArray()
}

export async function saveChallenge(item) {
  return db.challenges.put(item)
}

export async function removeChallenge(id) {
  return db.challenges.delete(id)
}

export async function getChallengeHistory(anakId) {
  return db.challengeHistory.where('anakId').equals(anakId).toArray()
}

export async function saveChallengeHistory(item) {
  return db.challengeHistory.add(item)
}

export async function getChecklists(anakId) {
  const lists = await db.checklists.where('anakId').equals(anakId).toArray()
  for (const cl of lists) cl.items = cl.items || []
  return lists
}

export async function saveChecklist(item) {
  return db.checklists.put(item)
}

export async function removeChecklist(id) {
  return db.checklists.delete(id)
}

export async function getSchedules(anakId) {
  return db.schedules.where('anakId').equals(anakId).toArray()
}

export async function saveSchedule(item) {
  return db.schedules.put(item)
}

export async function removeSchedule(id) {
  return db.schedules.delete(id)
}

export async function getSetting(key) {
  const row = await db.settings.get(key)
  return row?.value
}

export async function saveSetting(key, value) {
  return db.settings.put({ key, value })
}

export async function getWorksheets(anakId) {
  return db.worksheets.where('anakId').equals(anakId).toArray()
}

export async function saveWorksheet(item) {
  return db.worksheets.put(item)
}

export async function removeWorksheet(id) {
  return db.worksheets.delete(id)
}
