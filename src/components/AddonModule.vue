<template>
  <div class="gov-card">
    <div class="gov-card-head">
      <div>
        <span class="mod-name">模块{{ module.code }}：{{ module.name }}</span>
        <span class="mod-tag">增值可选加购</span>
      </div>
    </div>
    <div class="gov-card-body">
      <div class="gov-hint" v-if="module.standardHint">{{ module.standardHint }}</div>
      <div class="gov-addon-item" v-for="ad in addons" :key="ad.id" :class="{ 'is-active': isSelected(ad) }">
        <div class="gov-addon-head">
          <label class="opt">
            <input type="checkbox" class="gov-checkbox" :checked="isSelected(ad)" @change="onToggle(ad, $event.target.checked)" />
            <span style="font-weight:bold;">{{ ad.name }}</span>
          </label>
          <template v-if="isSelected(ad)">
            <label>单价(元)：<input class="gov-input w-sm" type="number" min="0" step="0.01" :value="getPrice(ad)" @input="s.setAddonPrice(ad.id, Number($event.target.value))" /></label>
            <label>数量：<input class="gov-input w-sm" type="number" min="0" step="1" :value="getQty(ad)" @input="s.setAddonQty(ad.id, Number($event.target.value))" /></label>
            <span class="gov-subtotal">小计：<b>¥{{ (s.addonSubtotals[ad.id] || 0).toFixed(2) }}</b></span>
          </template>
        </div>
        <div class="gov-addon-desc" v-if="isSelected(ad)">{{ ad.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSchemeStore } from '@/stores/scheme'

const props = defineProps({
  module: { type: Object, required: true },
  addons: { type: Array, required: true }
})

const s = useSchemeStore()

function isSelected(ad) {
  return !!s.current.addons[ad.id]?.selected
}
function getPrice(ad) {
  return s.current.addons[ad.id]?.price ?? 0
}
function getQty(ad) {
  return s.current.addons[ad.id]?.qty ?? 1
}
function onToggle(ad, checked) {
  s.toggleAddon(ad.id, checked)
}
</script>