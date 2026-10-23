<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Claim } from '@/types/simbg'

const rows = ref<Claim[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')

const totalClaims = computed(() => rows.value.length)
const approvedClaims = computed(() => rows.value.filter((claim) => claim.status === 'DISETUJUI').length)
const draftClaims = computed(() => rows.value.filter((claim) => claim.status === 'DRAFT').length)
const submittedClaims = computed(() => rows.value.filter((claim) => claim.status === 'DIAJUKAN').length)
const waitingClaims = computed(() => draftClaims.value + submittedClaims.value)
const rejectedClaims = computed(() => rows.value.filter((claim) => claim.status === 'DITOLAK').length)

const filteredRows = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('id-ID')
  if (!query) return rows.value
  return rows.value.filter((claim) =>
    [claim.id, claim.anggaranId, claim.description, claim.status]
      .some((value) => value?.toLocaleLowerCase('id-ID').includes(query)),
  )
})

onMounted(async () => {
  try {
    rows.value = await request<Claim[]>('/claim')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat claim.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="page">
    <header class="page-header"><div><p class="eyebrow">Pertanggungjawaban</p><h1>Claim</h1><p class="subtitle">Pantau pengajuan dan status pertanggungjawaban anggaran.</p></div><RouterLink class="button" to="/claim/tambah">+ Tambah Claim</RouterLink></header>
    <LoadingState :loading="loading" :error="error">
      <section class="summary-grid claim-summary" aria-label="Ringkasan jumlah claim">
        <article class="summary-card"><span>Total claim</span><strong>{{ totalClaims.toLocaleString('id-ID') }}</strong><small>Semua pengajuan</small></article>
        <article class="summary-card approved-card"><span>Disetujui</span><strong>{{ approvedClaims.toLocaleString('id-ID') }}</strong><small>Claim telah disetujui</small></article>
        <article class="summary-card waiting-card"><span>Menunggu tinjauan</span><strong>{{ waitingClaims.toLocaleString('id-ID') }}</strong><small>Draft {{ draftClaims }} · Diajukan {{ submittedClaims }}</small></article>
        <article class="summary-card rejected-card"><span>Ditolak</span><strong>{{ rejectedClaims.toLocaleString('id-ID') }}</strong><small>Perlu ditinjau kembali</small></article>
      </section>
      <section class="claim-history">
        <header class="history-heading"><h2>Daftar claim</h2><label class="search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg><input v-model="search" type="search" placeholder="Cari ID, anggaran, deskripsi…" aria-label="Cari claim"></label></header>
        <div class="table-wrap"><table><thead><tr><th>ID</th><th>Tanggal</th><th>Total Claim</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="claim in filteredRows" :key="claim.id"><td class="mono">{{ claim.id }}</td><td>{{ formatDate(claim.claimDate) }}</td><td>{{ formatRupiah(claim.totalClaim) }}</td><td><span class="pill" :class="claim.status === 'DISETUJUI' ? 'pill-green' : claim.status === 'DITOLAK' ? 'pill-red' : ''">{{ claim.status.replaceAll('_', ' ') }}</span></td><td><RouterLink class="text-link" :to="`/claim/${claim.id}`">Detail →</RouterLink></td></tr><tr v-if="!filteredRows.length"><td colspan="5" class="empty">{{ search ? 'Claim tidak ditemukan.' : 'Belum ada claim.' }}</td></tr></tbody></table></div>
      </section>
    </LoadingState>
  </main>
</template>

<style scoped>
.claim-history { overflow:hidden; border:1px solid #e5eaf1; border-radius:.875rem; background:#fff; box-shadow:0 6px 24px rgb(15 23 42 / 4%); }
.claim-summary { margin-bottom:1.25rem; }.claim-summary .summary-card { min-height:6.5rem; }.claim-summary small { color:#94a3b8; font-size:.72rem; }.approved-card strong { color:#16805e; }.waiting-card strong { color:#b7791f; }.rejected-card strong { color:#c2413a; }
.history-heading { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem 1.15rem; border-bottom:1px solid #edf0f5; }
.history-heading h2 { margin:0; color:#172554; font-size:1rem; }
.search-box { display:flex; width:min(320px,48%); min-height:2.5rem; align-items:center; gap:.55rem; padding:0 .7rem; border:1px solid #dbe3ef; border-radius:.6rem; background:#fff; }
.search-box:focus-within { border-color:#60a5fa; outline:3px solid rgb(96 165 250 / 16%); }.search-box svg { width:1rem; height:1rem; flex:none; fill:none; stroke:#94a3b8; stroke-linecap:round; stroke-width:2; }
.search-box input { min-height:2rem; padding:.25rem 0; border:0; outline:0; box-shadow:none; font-size:.78rem; }.search-box input:focus { outline:0; }
.pill-red { color:#b91c1c; background:#fee2e2; }
@media(max-width:620px) { .history-heading { align-items:flex-start; flex-direction:column; }.search-box { width:100%; } }
</style>
