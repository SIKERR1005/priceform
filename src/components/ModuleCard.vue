<template>
  <div class="gov-card">
    <div class="gov-card-head">
      <div>
        <span class="mod-name">模块{{ module.code }}：{{ module.name }}</span>
        <span class="mod-tag" v-if="module.element">五行·{{ module.element }}｜{{ module.elementDesc }}</span>
      </div>
    </div>
    <div class="gov-card-body">
      <div class="gov-hint" v-if="module.standardHint">{{ module.standardHint }}</div>

      <div class="gov-level-options">
        <label class="opt"><input type="radio" class="gov-radio" :value="''" v-model="level" />本模块不选用</label>
        <label class="opt" v-for="lv in module.levels" :key="lv.level">
          <input type="radio" class="gov-radio" :value="lv.level" v-model="level" />{{ lv.level }}档·{{ lv.name }}
        </label>
      </div>

      <template v-if="level && currentLevel">
        <div class="gov-level-row is-active">
          <div class="gov-level-head">
            <span class="gov-level-label">{{ level }}档·{{ currentLevel.name }}</span>
          </div>
          <div class="gov-level-desc">{{ currentLevel.desc }}</div>
          <div class="gov-input-row">
            <label>单价(元)：<input class="gov-input w-sm" type="number" min="0" step="0.01" v-model.number="price" /></label>
            <label>数量：<input class="gov-input w-sm" type="number" min="0" step="1" v-model.number="qty" /></label>
            <span class="gov-subtotal">小计：<b>¥{{ subtotal.toFixed(2) }}</b></span>
          </div>
        </div>

        <div class="gov-sub-options" v-if="module.hasSubOption">
          <div class="sub-title">茶歇版本（单选）：</div>
          <div style="margin-bottom:4px;">
            <label class="opt" v-for="opt in teaSubOptions" :key="opt.id" style="margin-right:18px;">
              <input type="radio" class="gov-radio" :value="opt.id" v-model="subOption" />{{ opt.name }}
            </label>
          </div>
          <div class="sub-desc" v-if="currentSubOption">{{ currentSubOption.desc }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchemeStore } from '@/stores/scheme'
import { useDictStore } from '@/stores/dict'

const props = defineProps({
  module: { type: Object, required: true }
})

const s = useSchemeStore()
const dict = useDictStore()

const level = computed({
  get: () => s.current.selections[props.module.id]?.level || '',
  set: (v) => s.setModuleLevel(props.module.id, v)
})
const price = computed({
  get: () => s.current.selections[props.module.id]?.price ?? 0,
  set: (v) => s.setModulePrice(props.module.id, v)
})
const qty = computed({
  get: () => s.current.selections[props.module.id]?.qty ?? 1,
  set: (v) => s.setModuleQty(props.module.id, v)
})
const subOption = computed({
  get: () => s.current.selections[props.module.id]?.subOption || '',
  set: (v) => s.setTeaSubOption(props.module.id, v)
})

const currentLevel = computed(() => props.module.levels.find((l) => l.level === level.value))
const teaSubOptions = computed(() => dict.teaSubOptions)
const currentSubOption = computed(() => teaSubOptions.value.find((o) => o.id === subOption.value))
const subtotal = computed(() => s.moduleSubtotals[props.module.id] || 0)
</script>