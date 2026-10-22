<script setup lang="ts">
defineProps<{ loading: boolean; error?: string }>()
</script>

<template>
  <p v-if="loading" class="notice" role="status">Memuat data…</p>
  <p v-else-if="error" class="notice notice-error" role="alert">{{ error }}</p>
  <slot v-else />
</template>
