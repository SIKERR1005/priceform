<template>
  <div class="gov-summary">
    <div class="gov-summary-head">报价汇总</div>
    <div class="gov-summary-body">
      <div class="gov-summary-row" v-for="row in rows" :key="row.key">
        <span class="label">{{ row.label }}</span>
        <span class="value">¥{{ row.amount.toFixed(2) }}</span>
      </div>
      <div class="gov-empty" v-if="!rows.length">尚未勾选任何模块或增值项</div>
      <div class="gov-summary-total">
        <span class="t-label">合计总金额：</span>
        <span class="t-value">¥{{ s.totalAmount.toFixed(2) }}</span>
      </div>
      <div class="gov-summary-cn">{{ s.totalChinese }}</div>
      <div style="margin-top:16px;">
        <label style="font-size:13px;color:var(--gov-text-soft);">备注说明：</label>
        <textarea
          class="gov-input w-full"
          rows="3"
          v-model="s.current.remark"
          placeholder="特殊需求说明、合同补充说明等"
          style="margin-top:6px;resize:vertical;"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchemeStore } from '@/stores/scheme'
import { useDictStore } from '@/stores/dict'

const s = useSchemeStore()
const dict = useDictStore()

const rows = computed(() => {
  const r = []
  for (const m of dict.levelModules) {
    const sel = s.current.selections[m.id]
    if (sel && sel.level) {
      const lv = m.levels.find((l) => l.level === sel.level)
      let label = `模块${m.code}·${m.name}（${sel.level}档`
      if (lv) label += `·${lv.name}`
      if (m.hasSubOption && sel.subOption) {
        const sub = dict.teaSubOptions.find((o) => o.id === sel.subOption)
        if (sub) label += `·${sub.name}`
      }
      label += '）'
      r.push({ key: m.id, label, amount: s.moduleSubtotals[m.id] || 0 })
    }
  }
  for (const ad of dict.addons) {
    if (s.current.addons[ad.id]?.selected) {
      r.push({ key: ad.id, label: `增值·${ad.name}`, amount: s.addonSubtotals[ad.id] || 0 })
    }
  }
  return r
})
</script>