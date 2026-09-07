<template>
  <div class="gov-toolbar no-print">
    <span class="tb-title">会务报价选配确认单系统</span>
    <button class="gov-btn" @click="goList">方案列表</button>
    <button class="gov-btn" @click="onSaveDraft">保存草稿</button>
    <button class="gov-btn primary" @click="onSave">保存方案</button>
    <button class="gov-btn" @click="onPrint">打印预览</button>
    <button class="gov-btn dark" @click="onExportAll" :disabled="busy">
      {{ busy ? '生成中...' : '生成交付文件(3份PDF)' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSchemeStore } from '@/stores/scheme'
import { exportAll } from '@/utils/pdf'
import { notify } from '@/utils/notify'

const busy = ref(false)
const router = useRouter()
const s = useSchemeStore()

function goList() {
  router.push('/schemes')
}
async function onSaveDraft() {
  await s.save('draft')
  notify('草稿已保存', 'success')
}
async function onSave() {
  if (!s.current.baseInfo.customer || !s.current.baseInfo.meetingName) {
    notify('请填写客户单位名称与会议活动名称', 'error')
    return
  }
  await s.save('confirmed')
  notify('方案已保存', 'success')
}
function onPrint() {
  window.print()
}
async function onExportAll() {
  if (!s.current.baseInfo.customer) {
    notify('请先填写客户单位名称', 'error')
    return
  }
  busy.value = true
  try {
    await exportAll()
    notify('三份PDF已生成下载', 'success')
  } catch (e) {
    notify('导出失败：' + (e && e.message ? e.message : e), 'error')
  } finally {
    busy.value = false
  }
}
</script>