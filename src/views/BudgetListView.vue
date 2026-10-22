<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Budget } from '@/types/simbg'

const rows = ref<Budget[]>([])
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  try { rows.value = await request<Budget[]>('/anggaran') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat anggaran.' }
  finally { loading.value = false }
})
</script>

<template>
  <main class="page">
    <header class="page-header"><div><p class="eyebrow">Perencanaan Dana</p><h1>Anggaran</h1><p class="subtitle">Kelola anggaran program dan alokasinya.</p></div><RouterLink class="button" to="/anggaran/tambah">+ Tambah Anggaran</RouterLink></header>
    <LoadingState :loading="loading" :error="error">
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Sekolah</th><th>Periode</th><th>Total Anggaran</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="budget in rows" :key="budget.id"><td class="mono">{{ budget.id }}</td><td class="strong">{{ budget.namaSekolah || budget.sekolahId || '—' }}</td><td>{{ formatDate(budget.startPeriod) }} – {{ formatDate(budget.endPeriod) }}</td><td>{{ formatRupiah(budget.totalAnggaran) }}</td><td><span class="pill" :class="budget.status === 'AKTIF' ? 'pill-green' : ''">{{ budget.status }}</span></td><td><RouterLink class="text-link" :to="`/anggaran/${budget.id}`">Detail →</RouterLink></td></tr><tr v-if="!rows.length"><td colspan="6" class="empty">Belum ada anggaran.</td></tr></tbody></table></div>
    </LoadingState>
  </main>
</template>
