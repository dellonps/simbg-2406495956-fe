<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import type { School } from '@/types/simbg'

const rows = ref<School[]>([])
const loading = ref(true)
const error = ref('')
function levelClass(level: string) {
  return `level-${level.toUpperCase().replace(/[^A-Z]/g, '')}`
}
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
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Nama Sekolah</th><th>Jenjang</th><th>Alamat</th></tr></thead><tbody><tr v-for="school in rows" :key="school.id"><td class="mono">{{ school.id }}</td><td class="strong">{{ school.nama }}</td><td><span class="pill level-pill" :class="levelClass(school.educationLevel)">{{ school.educationLevel }}</span></td><td>{{ school.address }}</td></tr><tr v-if="!rows.length"><td colspan="4" class="empty">Belum ada data sekolah.</td></tr></tbody></table></div>
    </LoadingState>
  </main>
</template>

<style scoped>
.level-pill { border:1px solid transparent; font-weight:750; letter-spacing:.025em; }
.level-SD { color:#9b4545; border-color:#efd3d3; background:#f7e7e7; }
.level-SMP { color:#344a78; border-color:#d4dced; background:#e7ecf6; }
.level-SMA { color:#525c66; border-color:#dce0e4; background:#eceff1; }
.level-SMK { color:#76563d; border-color:#e6d8ca; background:#f1e8df; }
</style>
