<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import type { DashboardData } from '@/types/dashboard'
import { formatRupiah } from '@/utils/format'

const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const error = ref('')
const today = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date())

const metrics = computed(() => dashboard.value ? [
  { label: 'Total anggaran', value: formatRupiah(dashboard.value.totalAnggaran), note: 'Pagu seluruh sekolah', to: '/anggaran', tone: 'blue', icon: 'budget' },
  { label: 'Sekolah terdaftar', value: dashboard.value.jumlahSekolah.toLocaleString('id-ID'), note: 'Penerima manfaat program', to: '/sekolah', tone: 'green', icon: 'school' },
  { label: 'Invoice diterbitkan', value: dashboard.value.jumlahInvoice.toLocaleString('id-ID'), note: formatRupiah(dashboard.value.totalNominalInvoice), to: '/invoice', tone: 'violet', icon: 'invoice' },
] : [])

onMounted(async () => {
  try {
    dashboard.value = await request<DashboardData>('/home')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat data beranda.'
  } finally {
  loading.value = false
  }
})
</script>

<template>
  <main class="home page">
    <header class="welcome">
      <div><p class="eyebrow">VERIFIKASI PENGAJUAN</p><h1>Ringkasan program</h1><p class="subtitle">Pantau anggaran, sekolah, dan perkembangan pengajuan bantuan.</p></div>
      <div class="date-text">{{ today }}</div>
    </header>

    <p v-if="loading" class="notice" role="status">Memuat data beranda…</p>
    <p v-else-if="error" class="notice notice-error" role="alert">Data beranda gagal dimuat: {{ error }}</p>

    <template v-if="dashboard">
      <section class="metrics" aria-label="Ringkasan program">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card" :class="`tone-${metric.tone}`">
          <div class="metric-top"><span>{{ metric.label }}</span><span class="metric-icon" aria-hidden="true">
            <span v-if="metric.icon === 'budget'">Rp</span>
            <svg v-else-if="metric.icon === 'school'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-6 9 6v11H3z"/><path d="M8 20v-6h8v6M7 10h.01M12 10h.01M17 10h.01"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h5M9 13h6M9 17h6"/></svg>
          </span></div>
          <strong>{{ metric.value }}</strong>
          <div class="metric-bottom"><span>{{ metric.note }}</span><RouterLink :to="metric.to">Lihat <span aria-hidden="true">↗</span></RouterLink></div>
        </article>
      </section>

    </template>
  </main>
</template>

<style scoped>
.home { padding-top:2.5rem; }
.welcome { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; margin-bottom:1.4rem; }
.welcome h1 { font-size:clamp(1.8rem,3vw,2.25rem); letter-spacing:-.04em; }
.welcome .subtitle { margin-top:.4rem; }
.date-text { color:#64748b; font-size:.82rem; font-weight:600; white-space:nowrap; }
.panel-link { color:#2563eb; font-size:.8rem; font-weight:650; text-decoration:none; white-space:nowrap; }
.metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }
.metric-card,.panel { border:1px solid #e5eaf1; border-radius:.9rem; background:#fff; box-shadow:0 5px 20px rgb(15 23 42 / 3%); }
.metric-card { min-width:0; padding:1.15rem 1.25rem 1rem; }
.metric-top,.metric-bottom { display:flex; align-items:center; justify-content:space-between; gap:.6rem; }
.metric-top { color:#64748b; font-size:.83rem; font-weight:650; }
.metric-icon { display:grid; width:2.1rem; height:2.1rem; place-items:center; border-radius:.65rem; font-size:.8rem; font-weight:800; }
.metric-icon svg { width:1.2rem; height:1.2rem; }
.tone-blue .metric-icon { color:#2563eb; background:#eff6ff; }.tone-green .metric-icon { color:#059669; background:#ecfdf5; }.tone-violet .metric-icon { color:#7c3aed; background:#f5f3ff; }
.metric-card>strong { display:block; overflow:hidden; margin:1rem 0; color:#172554; font-size:clamp(1.2rem,2vw,1.65rem); letter-spacing:-.035em; text-overflow:ellipsis; white-space:nowrap; }
.metric-bottom { padding-top:.8rem; border-top:1px solid #f1f5f9; color:#94a3b8; font-size:.73rem; }.metric-bottom a { color:#2563eb; font-weight:650; text-decoration:none; white-space:nowrap; }
@media(max-width:760px) { .welcome { align-items:flex-start; flex-direction:column; } }
@media(max-width:560px) { .home { padding-top:1.75rem; }.metrics { grid-template-columns:1fr; }.metric-card { padding:1rem; } }
</style>
