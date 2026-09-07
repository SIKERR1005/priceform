import { defineStore } from 'pinia'
import { getDict, saveDict } from '@/api/dict'

export const useDictStore = defineStore('dict', {
  state: () => ({
    dict: null,
    loaded: false
  }),
  getters: {
    modules: (s) => s.dict?.modules || [],
    levelModules: (s) => (s.dict?.modules || []).filter((m) => m.type === 'level'),
    addonModule: (s) => (s.dict?.modules || []).find((m) => m.type === 'addon'),
    addons: (s) => s.dict?.addons || [],
    teaSubOptions: (s) => s.dict?.teaSubOptions || [],
    rules: (s) => s.dict?.rules || [],
    header: (s) => s.dict?.header || {},
    signatures: (s) => s.dict?.signatures || {},
    moduleById: (s) => (id) => (s.dict?.modules || []).find((m) => m.id === id)
  },
  actions: {
    async load() {
      if (this.loaded) return
      this.dict = await getDict()
      this.loaded = true
    },
    async persist() {
      if (!this.dict) return
      await saveDict(this.dict)
    }
  }
})