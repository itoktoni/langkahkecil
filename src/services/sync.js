import { supabase } from '../supabase.js'
import db from '../db.js'

const SYNC_TABLES = ['anak', 'challenges', 'challengeHistory', 'checklists', 'schedules']

const TABLE_MAP = {
  anak: 'anak',
  challenges: 'challenges',
  challengeHistory: 'challenge_history',
  checklists: 'checklists',
  schedules: 'schedules'
}

function toSnakeCase(obj) {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    result[snakeKey] = value
  }
  return result
}

function toCamelCase(obj) {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    result[camelKey] = value
  }
  return result
}

function cleanForSync(record) {
  const { _synced, ...rest } = record
  return rest
}

let syncInProgress = false
let syncQueued = false
let lastSyncTime = null

export async function pushToSupabase(userId) {
  if (!userId) return

  for (const table of SYNC_TABLES) {
    const unsynced = await db[table].where('_synced').equals(0).toArray()
    if (unsynced.length === 0) continue

    const supabaseTable = TABLE_MAP[table]
    const rows = unsynced.map(r => {
      const cleaned = cleanForSync(r)
      const snake = toSnakeCase(cleaned)
      snake.user_id = userId
      snake.updated_at = new Date().toISOString()
      if (table === 'challengeHistory') {
        snake.anak_id = snake.anak_id || cleaned.anakId
      }
      return snake
    })

    const { error } = await supabase
      .from(supabaseTable)
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      console.error(`[sync] push ${table} failed:`, error.message)
      continue
    }

    const ids = unsynced.map(r => r.id)
    await db[table].where('id').anyOf(ids).modify({ _synced: 1 })
  }
}

export async function pullFromSupabase(userId) {
  if (!userId) return

  const since = lastSyncTime || new Date(0).toISOString()

  for (const table of SYNC_TABLES) {
    const supabaseTable = TABLE_MAP[table]

    const { data, error } = await supabase
      .from(supabaseTable)
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .gte('updated_at', since)

    if (error) {
      console.error(`[sync] pull ${table} failed:`, error.message)
      continue
    }

    if (!data || data.length === 0) continue

    for (const row of data) {
      const camel = toCamelCase(row)
      camel.id = row.id
      camel._synced = 1
      delete camel.userId
      delete camel.deleted

      const existing = await db[table].get(camel.id)
      if (!existing || (existing._synced === 1)) {
        await db[table].put(camel)
      }
    }
  }

  lastSyncTime = new Date().toISOString()
}

export async function pullDeleted(userId) {
  if (!userId) return

  for (const table of SYNC_TABLES) {
    const supabaseTable = TABLE_MAP[table]

    const { data, error } = await supabase
      .from(supabaseTable)
      .select('id')
      .eq('user_id', userId)
      .eq('deleted', true)

    if (error || !data) continue

    for (const row of data) {
      await db[table].delete(row.id)
    }
  }
}

export async function syncNow(userId) {
  if (!userId) return
  if (syncInProgress) {
    syncQueued = true
    return
  }

  syncInProgress = true

  try {
    if (!navigator.onLine) return

    await pushToSupabase(userId)
    await pullFromSupabase(userId)
    await pullDeleted(userId)
  } catch (e) {
    console.error('[sync] error:', e.message)
  } finally {
    syncInProgress = false

    if (syncQueued) {
      syncQueued = false
      setTimeout(() => syncNow(userId), 1000)
    }
  }
}

let debounceTimer = null
export function scheduleSync(userId) {
  if (!userId) return
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => syncNow(userId), 2000)
}

export function setupAutoSync(userId) {
  if (!userId) return

  const handleOnline = () => syncNow(userId)
  window.addEventListener('online', handleOnline)

  syncNow(userId)

  return () => {
    window.removeEventListener('online', handleOnline)
    clearTimeout(debounceTimer)
  }
}
