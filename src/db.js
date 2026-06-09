import Dexie from 'dexie'

const DB_NAME = 'HaloBunda'

async function initDB() {
  try {
    const db = new Dexie(DB_NAME)
    db.version(3).stores({
      anak: 'id, nama, _synced',
      challenges: 'id, anakId, category, _synced',
      challengeHistory: 'id, anakId, category, _synced',
      checklists: 'id, anakId, _synced',
      schedules: 'id, anakId, _synced',
      worksheets: '++id, anakId',
      settings: 'key'
    })
    await db.open()
    return db
  } catch (e) {
    if (e.name === 'UpgradeError') {
      await new Dexie(DB_NAME).delete()
      location.reload()
    }
    throw e
  }
}

const db = await initDB()

export default db

function markUnsynced(record) {
  return { ...record, _synced: 0, updated_at: new Date().toISOString() }
}

export async function getAnakList() {
  return db.anak.toArray()
}

export async function saveAnak(anak) {
  if (!anak.id) anak.id = crypto.randomUUID()
  const data = markUnsynced(anak)
  await db.anak.put(data)
  return data.id
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
  if (!item.id) item.id = crypto.randomUUID()
  const data = markUnsynced(item)
  await db.challenges.put(data)
  return data.id
}

export async function removeChallenge(id) {
  return db.challenges.delete(id)
}

export async function getChallengeHistory(anakId) {
  return db.challengeHistory.where('anakId').equals(anakId).toArray()
}

export async function saveChallengeHistory(item) {
  if (!item.id) item.id = crypto.randomUUID()
  const data = markUnsynced(item)
  return db.challengeHistory.add(data)
}

export async function getChecklists(anakId) {
  const lists = await db.checklists.where('anakId').equals(anakId).toArray()
  for (const cl of lists) cl.items = cl.items || []
  return lists
}

export async function saveChecklist(item) {
  if (!item.id) item.id = crypto.randomUUID()
  const data = markUnsynced(item)
  await db.checklists.put(data)
  return data.id
}

export async function removeChecklist(id) {
  return db.checklists.delete(id)
}

export async function getSchedules(anakId) {
  return db.schedules.where('anakId').equals(anakId).toArray()
}

export async function saveSchedule(item) {
  if (!item.id) item.id = crypto.randomUUID()
  const data = markUnsynced(item)
  await db.schedules.put(data)
  return data.id
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
