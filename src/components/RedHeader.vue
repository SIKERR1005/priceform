<template>
  <div>
    <div class="gov-redheader">
      <h1 class="red-title">{{ header.title }}</h1>
      <div class="red-subtitle">{{ header.subtitle }}</div>
    </div>
    <hr class="gov-redline" />
    <div class="gov-doc-no">
      <span>方案编号：{{ schemeNo }}</span>
      <span>制作日期：{{ makeDate }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  header: { type: Object, required: true },
  schemeNo: { type: String, default: '' },
  makeDate: { type: String, default: '' }
})
</script>