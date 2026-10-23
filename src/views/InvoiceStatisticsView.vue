<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatRupiah } from '@/utils/format'
import type { Statistics } from '@/types/simbg'

const statistics = ref<Statistics | null>(null)
const loading = ref(true)
const error = ref('')

const claimStatuses = computed(() => {
  const rows = statistics.value?.claimStatistics ?? []
  return [
    { key: 'DIAJUKAN', label: 'Menunggu tinjauan', color: 'amber' },
    { key: 'DISETUJUI', label: 'Disetujui', color: 'green' },
    { key: 'DITOLAK', label: 'Ditolak', color: 'red' },
    { key: 'DIBATALKAN', label: 'Dibatalkan', color: 'gray' },
  ].map((status) => ({
    ...status,
    jumlah: rows.find((row) => row.status === status.key)?.jumlah ?? 0,
    totalNominal: rows.find((row) => row.status === status.key)?.totalNominal ?? 0,
  }))
})

const invoiceMonths = computed(() => {
  const rows = [...(statistics.value?.invoiceStatistics ?? [])].sort((a, b) => a.status.localeCompare(b.status))
  const max = Math.max(...rows.map((row) => row.totalNominal), 0)
  return rows.map((row) => ({
    ...row,
    label: monthLabel(row.status),
    height: max ? Math.max((row.totalNominal / max) * 100, row.totalNominal ? 8 : 0) : 0,
  }))
})

const totalClaims = computed(() => claimStatuses.value.reduce((sum, row) => sum + row.jumlah, 0))
const totalInvoices = computed(() => invoiceMonths.value.reduce((sum, row) => sum + row.jumlah, 0))
const totalInvoiceAmount = computed(() => invoiceMonths.value.reduce((sum, row) => sum + row.totalNominal, 0))

function monthLabel(value: string) {
  const match = value.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/)
  if (!match) return value
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1)
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date)
}

function statusPercent(count: number) {
  return totalClaims.value ? Math.round((count / totalClaims.value) * 100) : 0
}

onMounted(async () => {
  try {
    statistics.value = await request<Statistics>('/invoice/statistik')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat statistik.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="page">
    <RouterLink class="back-link" to="/invoice">← Kembali ke Invoice</RouterLink>
    <header class="page-header"><div><p class="eyebrow">LAPORAN</p><h1>Statistik Claim &amp; Invoice</h1><p class="subtitle">Pantau status pengajuan dan penerbitan invoice per bulan.</p></div></header>
    <LoadingState :loading="loading" :error="error">
      <template v-if="statistics">
        <section class="summary-grid" aria-label="Ringkasan statistik invoice">
          <article class="summary-card"><span>Total claim</span><strong>{{ totalClaims.toLocaleString('id-ID') }}</strong><small>Semua status pengajuan</small></article>
          <article class="summary-card"><span>Claim disetujui</span><strong>{{ claimStatuses.find((row) => row.key === 'DISETUJUI')?.jumlah ?? 0 }}</strong><small>{{ formatRupiah(claimStatuses.find((row) => row.key === 'DISETUJUI')?.totalNominal ?? 0) }}</small></article>
          <article class="summary-card"><span>Total invoice</span><strong>{{ totalInvoices.toLocaleString('id-ID') }}</strong><small>{{ invoiceMonths.length }} periode penerbitan</small></article>
          <article class="summary-card"><span>Nominal invoice</span><strong class="small-value">{{ formatRupiah(totalInvoiceAmount) }}</strong><small>Akumulasi seluruh periode</small></article>
        </section>

        <section class="section-block">
          <header class="section-heading"><div><h2>Invoice per bulan</h2><p>Jumlah dan total nominal invoice berdasarkan tanggal penerbitan.</p></div></header>
          <article class="chart-card">
            <div v-if="invoiceMonths.length" class="chart" role="img" :aria-label="`Grafik batang nominal invoice bulanan untuk ${invoiceMonths.length} periode`">
              <div class="axis-labels"><span>{{ formatRupiah(Math.max(...invoiceMonths.map((row) => row.totalNominal))) }}</span><span>{{ formatRupiah(Math.round(Math.max(...invoiceMonths.map((row) => row.totalNominal)) / 2)) }}</span><span>Rp0</span></div>
              <div class="plot">
                <div v-for="month in invoiceMonths" :key="month.status" class="bar-column" :title="`${month.label}: ${month.jumlah} invoice · ${formatRupiah(month.totalNominal)}`">
                  <span class="bar-value">{{ formatRupiah(month.totalNominal) }}</span>
                  <div class="bar-track"><div class="bar" :style="{ height: `${month.height}%` }"></div></div>
                  <span class="month-label">{{ month.label }}</span>
                  <span class="month-count">{{ month.jumlah }} invoice</span>
                </div>
              </div>
            </div>
            <div v-else class="chart-empty">Belum ada data invoice per bulan.</div>
          </article>
        </section>

        <section class="section-block">
          <header class="section-heading"><div><h2>Status claim</h2><p>Jumlah pengajuan, persentase, dan nominal per status.</p></div></header>
          <article class="status-card">
            <div v-for="status in claimStatuses" :key="status.key" class="status-row">
              <span class="status-name"><i :class="`dot ${status.color}`"></i>{{ status.label }}</span>
              <div class="progress-track" role="progressbar" :aria-valuenow="statusPercent(status.jumlah)" aria-valuemin="0" aria-valuemax="100" :aria-label="status.label"><div class="progress-fill" :class="status.color" :style="{ width: `${statusPercent(status.jumlah)}%` }"></div></div>
              <strong>{{ status.jumlah }}</strong><span class="status-amount">{{ formatRupiah(status.totalNominal) }}</span>
            </div>
          </article>
        </section>
      </template>
    </LoadingState>
  </main>
</template>

<style scoped>
.summary-card { gap:.45rem; }.summary-card > span { color:#64748b; font-size:.78rem; font-weight:600; }.summary-card strong { color:#172554; font-size:1.35rem; }.summary-card .small-value { font-size:1rem; }.summary-card small { color:#94a3b8; font-size:.72rem; }
.section-block { margin-top:1.5rem; }.section-heading { margin-bottom:.8rem; }.section-heading h2 { margin:0; color:#172554; font-size:1.05rem; }.section-heading p { margin:.35rem 0 0; color:#64748b; font-size:.82rem; }
.chart-card,.status-card { padding:1.25rem; border:1px solid #e5eaf1; border-radius:.875rem; background:#fff; box-shadow:0 6px 24px rgb(15 23 42 / 4%); }
.chart { display:flex; height:250px; gap:1rem; }.axis-labels { display:flex; width:5rem; flex:none; flex-direction:column; justify-content:space-between; padding:0 0 2.7rem; color:#94a3b8; font-size:.68rem; text-align:right; }.plot { position:relative; display:flex; flex:1; align-items:stretch; justify-content:space-around; gap:.6rem; padding:0 .5rem 2.7rem; background:repeating-linear-gradient(to bottom,transparent 0,transparent calc(50% - 1px),#f1f5f9 calc(50% - 1px),#f1f5f9 50%,transparent calc(50% + 1px)); }
.bar-column { position:relative; display:flex; min-width:2.6rem; flex:1; flex-direction:column; align-items:center; justify-content:flex-end; }.bar-value { max-width:100%; overflow:hidden; height:1.15rem; color:#64748b; font-size:.65rem; text-overflow:ellipsis; white-space:nowrap; }.bar-track { display:flex; width:min(38px,72%); height:calc(100% - 1.15rem); align-items:flex-end; }.bar { width:100%; min-height:3px; border-radius:.4rem .4rem .12rem .12rem; background:linear-gradient(180deg,#60a5fa,#2563eb); transition:height .25s ease; }.month-label,.month-count { position:absolute; overflow:hidden; max-width:100%; color:#64748b; font-size:.67rem; text-overflow:ellipsis; white-space:nowrap; }.month-label { bottom:-1.2rem; }.month-count { bottom:-2.25rem; color:#94a3b8; font-size:.62rem; }.chart-empty { display:grid; min-height:180px; place-items:center; color:#94a3b8; font-size:.85rem; }
.status-card { display:grid; gap:1rem; }.status-row { display:grid; grid-template-columns:minmax(150px,1fr) minmax(120px,2fr) 2.5rem minmax(100px,.9fr); align-items:center; gap:1rem; }.status-name { display:flex; align-items:center; gap:.55rem; color:#52616a; font-size:.8rem; }.dot { width:.55rem; height:.55rem; border-radius:50%; }.amber { background:#e6aa54; }.green { background:#68aa88; }.red { background:#df8875; }.gray { background:#b7c2c6; }.progress-track { overflow:hidden; height:.55rem; border-radius:2rem; background:#edf3ef; }.progress-fill { height:100%; border-radius:inherit; transition:width .25s ease; }.progress-fill.amber { background:#e8b25f; }.progress-fill.green { background:#68aa88; }.progress-fill.red { background:#df8875; }.progress-fill.gray { background:#b7c2c6; }.status-row strong { color:#334155; font-size:.8rem; text-align:right; }.status-amount { color:#64748b; font-size:.76rem; text-align:right; white-space:nowrap; }
@media(max-width:650px) { .chart-card,.status-card { padding:.85rem; }.chart { height:220px; gap:.45rem; }.axis-labels { width:3.2rem; font-size:.6rem; }.bar-column { min-width:1.9rem; }.bar-value { font-size:.56rem; }.month-label { font-size:.6rem; }.status-row { grid-template-columns:minmax(120px,1fr) 2rem minmax(80px,.8fr); gap:.55rem .7rem; }.status-name { grid-column:1; }.status-row strong { grid-column:2; }.status-row .progress-track { grid-column:1/3; }.status-amount { grid-column:3; grid-row:2; } }
</style>
