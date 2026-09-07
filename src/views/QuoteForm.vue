<template>
  <PrintToolbar />
  <div class="gov-page">
    <RedHeader
      :header="dict.header"
      :scheme-no="s.current.schemeNo"
      :make-date="s.current.baseInfo.makeDate"
    />

    <BaseInfoForm />

    <div class="gov-section-title">二、八大模块选配区</div>
    <ModuleCard v-for="m in dict.levelModules" :key="m.id" :module="m" />
    <AddonModule v-if="dict.addonModule" :module="dict.addonModule" :addons="dict.addons" />

    <div class="gov-section-title">三、报价汇总</div>
    <SummaryPanel />

    <div class="gov-section-title">四、选配规则与IP交付保障</div>
    <RulesPanel :rules="dict.rules" />

    <div class="gov-section-title">五、签章确认</div>
    <SignaturePanel :signatures="dict.signatures" />

    <div class="gov-footer">本确认单由系统自动生成，经双方签字盖章后生效。</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDictStore } from '@/stores/dict'
import { useSchemeStore } from '@/stores/scheme'
import PrintToolbar from '@/components/PrintToolbar.vue'
import RedHeader from '@/components/RedHeader.vue'
import BaseInfoForm from '@/components/BaseInfoForm.vue'
import ModuleCard from '@/components/ModuleCard.vue'
import AddonModule from '@/components/AddonModule.vue'
import SummaryPanel from '@/components/SummaryPanel.vue'
import RulesPanel from '@/components/RulesPanel.vue'
import SignaturePanel from '@/components/SignaturePanel.vue'

const route = useRoute()
const dict = useDictStore()
const s = useSchemeStore()

onMounted(async () => {
  await dict.load()
  await s.loadScheme(route.query.id)
})
</script>