const STORAGE_KEY = 'priceform_schemes'

const USE_REMOTE = false
const BASE_URL = import.meta.env.VITE_API_BASE || '/api'

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function genSchemeNo() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  const rand = Math.floor(Math.random() * 900 + 100)
  return `HX-${ts}-${rand}`
}

export async function listSchemes() {
  if (USE_REMOTE) {
    const res = await fetch(`${BASE_URL}/schemes`)
    if (!res.ok) throw new Error('listSchemes failed')
    return res.json()
  }
  return readAll().sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

export async function getScheme(id) {
  if (USE_REMOTE) {
    const res = await fetch(`${BASE_URL}/schemes/${id}`)
    if (!res.ok) throw new Error('getScheme failed')
    return res.json()
  }
  const list = readAll()
  return list.find((s) => s.id === id) || null
}

export async function saveScheme(scheme) {
  if (USE_REMOTE) {
    const res = await fetch(`${BASE_URL}/schemes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheme)
    })
    if (!res.ok) throw new Error('saveScheme failed')
    return res.json()
  }
  const list = readAll()
  const now = new Date().toISOString()
  if (!scheme.id) {
    scheme.id = 'S-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    scheme.createdAt = now
  }
  scheme.updatedAt = now
  const idx = list.findIndex((s) => s.id === scheme.id)
  if (idx >= 0) list[idx] = scheme
  else list.push(scheme)
  writeAll(list)
  return scheme
}

export async function deleteScheme(id) {
  if (USE_REMOTE) {
    const res = await fetch(`${BASE_URL}/schemes/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('deleteScheme failed')
    return { ok: true }
  }
  const list = readAll().filter((s) => s.id !== id)
  writeAll(list)
  return { ok: true }
}

export async function duplicateScheme(id) {
  const src = await getScheme(id)
  if (!src) throw new Error('源方案不存在')
  const copy = JSON.parse(JSON.stringify(src))
  copy.id = null
  copy.schemeNo = genSchemeNo()
  copy.baseInfo = { ...src.baseInfo, customer: '', meetingName: '' }
  copy.status = 'draft'
  return saveScheme(copy)
}