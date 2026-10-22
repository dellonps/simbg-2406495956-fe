<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import type { School } from '@/types/simbg'

const rows = ref<School[]>([])
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  try { rows.value = await request<School[]>('/sekolah') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat sekolah.' }
  finally { loading.value = false }
})
</script>

<template>
  <main class="page">
    <header class="page-header"><div><p class="eyebrow">Data Referensi</p><h1>Sekolah</h1><p class="subtitle">Daftar sekolah penerima program MBG.</p></div><span class="count-chip">{{ rows.length }} sekolah</span></header>
    <LoadingState :loading="loading" :error="error">
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Nama Sekolah</th><th>Jenjang</th><th>Alamat</th></tr></thead><tbody><tr v-for="school in rows" :key="school.id"><td class="mono">{{ school.id }}</td><td class="strong">{{ school.nama }}</td><td><span class="pill">{{ school.educationLevel }}</span></td><td>{{ school.address }}</td></tr><tr v-if="!rows.length"><td colspan="4" class="empty">Belum ada data sekolah.</td></tr></tbody></table></div>
    </LoadingState>
  </main>
</template>
