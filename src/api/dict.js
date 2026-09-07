import dictData from '@/data/dict.json'

const USE_REMOTE = false
const BASE_URL = import.meta.env.VITE_API_BASE || '/api'

async function remoteGet(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API ${path} ${res.status}`)
  return res.json()
}

async function remotePost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`API ${path} ${res.status}`)
  return res.json()
}

export async function getDict() {
  if (USE_REMOTE) return remoteGet('/dict')
  return dictData
}

export async function saveDict(dict) {
  if (USE_REMOTE) return remotePost('/dict', dict)
  localStorage.setItem('priceform_dict', JSON.stringify(dict))
  return { ok: true }
}

export async function getModules() {
  const dict = await getDict()
  return dict.modules
}

export async function getAddons() {
  const dict = await getDict()
  return dict.addons
}

export async function getRules() {
  const dict = await getDict()
  return dict.rules
}