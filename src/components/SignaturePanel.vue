<template>
  <div class="gov-sign">
    <div class="gov-sign-block" v-for="side in sides" :key="side">
      <div class="sign-title">{{ signatures[side].title }}</div>
      <div class="sign-line" v-for="f in signatures[side].fields" :key="f">
        <span class="sign-cap">{{ f }}：</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  signatures: { type: Object, required: true }
})

const sides = computed(() => Object.keys(props.signatures || {}))
</script>