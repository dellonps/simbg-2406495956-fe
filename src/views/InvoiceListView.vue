<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Invoice } from '@/types/simbg'

const rows = ref<Invoice[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')

const totalAmount = computed(() => rows.value.reduce((sum, invoice) => sum + invoice.totalAmount, 0))
const unpaidCount = computed(() => rows.value.filter((invoice) => invoice.status === 'BELUM_DIBAYAR').length)
const filteredRows = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('id-ID')
  if (!query) return rows.value
  return rows.value.filter((invoice) =>
    invoice.invoiceNumber.toLocaleLowerCase('id-ID').includes(query) ||
    invoice.claimId.toLocaleLowerCase('id-ID').includes(query),
  )
})

onMounted(async () => {
  try {
    rows.value = await request<Invoice[]>('/invoice')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat invoice.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="page invoice-page">
    <header class="page-header"><div><p class="eyebrow">Pembayaran Program</p><h1>Invoice pembayaran</h1><p class="subtitle">Pantau tagihan dan administrasi pencairan bantuan sekolah.</p></div><div class="header-actions"><RouterLink class="button button-secondary" to="/invoice/statistik">Statistik Claim Invoice</RouterLink><RouterLink class="button" to="/invoice/terbitkan">+ Terbitkan Invoice</RouterLink></div></header>
    <LoadingState :loading="loading" :error="error">
      <section class="summary-grid invoice-summary" aria-label="Ringkasan invoice">
        <article class="summary-card"><span>Total invoice</span><strong>{{ rows.length.toLocaleString('id-ID') }}</strong><small>Seluruh invoice terdaftar</small></article>
        <article class="summary-card"><span>Total nilai tagihan</span><strong>{{ formatRupiah(totalAmount) }}</strong><small>Nilai keseluruhan invoice</small></article>
        <article class="summary-card unpaid-card"><span>Belum dibayar</span><strong>{{ unpaidCount.toLocaleString('id-ID') }}</strong><small>Menunggu penyelesaian pembayaran</small></article>
      </section>

      <section class="section-block history-block">
        <header class="history-heading"><h2>Riwayat invoice</h2><label class="search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg><input v-model="search" type="search" placeholder="Cari nomor invoice…" aria-label="Cari nomor invoice"></label></header>
        <div class="table-wrap"><table><thead><tr><th>Nomor invoice</th><th>Tanggal terbit</th><th>Jatuh tempo</th><th>ID claim</th><th>Nilai tagihan</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="invoice in filteredRows" :key="invoice.invoiceNumber"><td class="mono strong">{{ invoice.invoiceNumber }}</td><td>{{ formatDate(invoice.invoiceDate) }}</td><td>{{ formatDate(invoice.dueDate) }}</td><td class="mono">{{ invoice.claimId }}</td><td class="strong">{{ formatRupiah(invoice.totalAmount) }}</td><td><span class="pill" :class="invoice.status === 'DIBAYAR' ? 'pill-green' : invoice.status === 'BELUM_DIBAYAR' ? 'pill-amber' : ''">{{ invoice.status.replaceAll('_', ' ') }}</span></td><td><RouterLink class="text-link" :to="`/invoice/${encodeURIComponent(invoice.invoiceNumber)}`">Detail →</RouterLink></td></tr><tr v-if="!filteredRows.length"><td colspan="7" class="empty">{{ search ? 'Invoice tidak ditemukan.' : 'Belum ada invoice.' }}</td></tr></tbody></table></div>
      </section>
    </LoadingState>
  </main>
</template>

<style scoped>
.invoice-summary { grid-template-columns:repeat(3,minmax(0,1fr)); }.invoice-summary .summary-card { min-height:7.2rem; }.summary-card small { color:#94a3b8; font-size:.73rem; }.unpaid-card { border-color:#f6e5d8; background:#fffaf6; }.unpaid-card strong { color:#c76c45; }.pill-amber { color:#a86817; background:#fff1d7; }
.history-block { margin-top:1.5rem; }.history-heading { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:.75rem; padding:1.1rem 1.25rem; border:1px solid #e5eaf1; border-bottom:0; border-radius:.875rem .875rem 0 0; background:#fff; }.history-heading h2 { margin:0; color:#172554; font-size:1.05rem; }.search-box { display:flex; width:min(280px,45%); min-height:2.5rem; align-items:center; gap:.55rem; padding:0 .7rem; border:1px solid #dbe3ef; border-radius:.6rem; background:#fff; }.search-box:focus-within { border-color:#60a5fa; outline:3px solid rgb(96 165 250 / 16%); }.search-box svg { width:1rem; height:1rem; flex:none; fill:none; stroke:#94a3b8; stroke-linecap:round; stroke-width:2; }.search-box input { min-height:2rem; padding:.25rem 0; border:0; outline:0; box-shadow:none; font-size:.78rem; }.search-box input:focus { outline:0; }.history-block .table-wrap { border-top-left-radius:0; border-top-right-radius:0; }
@media(max-width:700px) { .invoice-page>.page-header { align-items:flex-start; }.invoice-summary { grid-template-columns:1fr; }.history-heading { align-items:flex-start; flex-direction:column; }.search-box { width:100%; } }
</style>
