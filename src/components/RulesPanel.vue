<template>
  <div class="gov-rules">
    <div class="rule-item" v-for="r in rules" :key="r.title">
      <div class="rule-title">{{ r.title }}</div>
      <div class="rule-content">{{ r.content }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rules: { type: Array, required: true }
})
</script>