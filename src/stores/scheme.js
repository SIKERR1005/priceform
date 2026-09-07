import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listSchemes, getScheme, saveScheme, deleteScheme, duplicateScheme, genSchemeNo } from '@/api/scheme'
import { toChineseAmount, round2 } from '@/utils/money'

function todayStr() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function emptyScheme() {
  return {
    id: null,
    schemeNo: genSchemeNo(),
    status: 'draft',
    createdAt: null,
    updatedAt: null,
    baseInfo: {
      customer: '',
      meetingName: '',
      attendees: null,
      meetingDate: '',
      budgetRange: '',
      meetingMode: '',
      makeDate: todayStr()
    },
    selections: {},
    addons: {},
    remark: ''
  }
}

export const useSchemeStore = defineStore('scheme', () => {
  const current = ref(emptyScheme())
  const list = ref([])

  const moduleSubtotals = computed(() => {
    const map = {}
    for (const key in current.value.selections) {
      const sel = current.value.selections[key]
      if (sel && sel.level) {
        map[key] = round2((Number(sel.price) || 0) * (Number(sel.qty) || 0))
      } else {
        map[key] = 0
      }
    }
    return map
  })

  const addonSubtotals = computed(() => {
    const map = {}
    for (const key in current.value.addons) {
      const a = current.value.addons[key]
      if (a && a.selected) {
        map[key] = round2((Number(a.price) || 0) * (Number(a.qty) || 0))
      } else {
        map[key] = 0
      }
    }
    return map
  })

  const totalAmount = computed(() => {
    let total = 0
    for (const k in moduleSubtotals.value) total += moduleSubtotals.value[k]
    for (const k in addonSubtotals.value) total += addonSubtotals.value[k]
    return round2(total)
  })

  const totalChinese = computed(() => toChineseAmount(totalAmount.value))

  function newScheme() {
    current.value = emptyScheme()
  }

  async function loadScheme(id) {
    if (!id) {
      newScheme()
      return
    }
    const s = await getScheme(id)
    if (s) current.value = s
    else newScheme()
  }

  async function save(status) {
    if (status) current.value.status = status
    current.value = await saveScheme(current.value)
  }

  function ensureModule(moduleId) {
    if (!current.value.selections[moduleId]) {
      current.value.selections[moduleId] = { level: '', price: 0, qty: 1, subOption: '' }
    }
    return current.value.selections[moduleId]
  }

  function ensureAddon(addonId) {
    if (!current.value.addons[addonId]) {
      current.value.addons[addonId] = { selected: false, price: 0, qty: 1 }
    }
    return current.value.addons[addonId]
  }

  function setModuleLevel(moduleId, level) {
    const sel = ensureModule(moduleId)
    sel.level = level
    if (!level) {
      sel.price = 0
      sel.qty = 1
      sel.subOption = ''
    }
  }

  function setModulePrice(moduleId, price) {
    ensureModule(moduleId).price = price
  }

  function setModuleQty(moduleId, qty) {
    ensureModule(moduleId).qty = qty
  }

  function setTeaSubOption(moduleId, subOption) {
    ensureModule(moduleId).subOption = subOption
  }

  function toggleAddon(addonId, selected) {
    const a = ensureAddon(addonId)
    a.selected = selected
    if (!selected) {
      a.price = 0
      a.qty = 1
    }
  }

  function setAddonPrice(addonId, price) {
    ensureAddon(addonId).price = price
  }

  function setAddonQty(addonId, qty) {
    ensureAddon(addonId).qty = qty
  }

  function setBaseInfo(patch) {
    current.value.baseInfo = { ...current.value.baseInfo, ...patch }
  }

  function setRemark(remark) {
    current.value.remark = remark
  }

  async function fetchList() {
    list.value = await listSchemes()
  }

  async function remove(id) {
    await deleteScheme(id)
    await fetchList()
  }

  async function duplicate(id) {
    const s = await duplicateScheme(id)
    await fetchList()
    return s
  }

  return {
    current,
    list,
    moduleSubtotals,
    addonSubtotals,
    totalAmount,
    totalChinese,
    newScheme,
    loadScheme,
    save,
    setModuleLevel,
    setModulePrice,
    setModuleQty,
    setTeaSubOption,
    toggleAddon,
    setAddonPrice,
    setAddonQty,
    setBaseInfo,
    setRemark,
    fetchList,
    remove,
    duplicate,
    ensureModule,
    ensureAddon
  }
})