<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatRupiah } from '@/utils/format'
import type { Statistics } from '@/types/simbg'

const statistics = ref<Statistics | null>(null); const loading = ref(true); const error = ref('')
onMounted(async () => { try { statistics.value = await request<Statistics>('/invoice/statistik') } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat statistik.' } finally { loading.value = false } })
</script>

<template><main class="page"><RouterLink class="back-link" to="/invoice">← Kembali ke Invoice</RouterLink><header class="page-header"><div><p class="eyebrow">Laporan</p><h1>Statistik Claim Invoice</h1><p class="subtitle">Ringkasan jumlah dan nominal claim serta invoice.</p></div></header><LoadingState :loading="loading" :error="error"><template v-if="statistics"><section class="section-block"><header class="section-heading"><div><h2>Statistik Claim</h2><p>Jumlah dan nominal berdasarkan status claim.</p></div></header><div class="table-wrap"><table><thead><tr><th>Status</th><th>Jumlah Claim</th><th>Total Nominal</th></tr></thead><tbody><tr v-for="row in statistics.claimStatistics" :key="row.status"><td><span class="pill">{{ row.status.replaceAll('_', ' ') }}</span></td><td>{{ row.jumlah }}</td><td>{{ formatRupiah(row.totalNominal) }}</td></tr></tbody></table></div></section><section class="section-block"><header class="section-heading"><div><h2>Statistik Invoice</h2><p>Jumlah invoice dan total nominal per bulan penerbitan.</p></div></header><div class="table-wrap"><table><thead><tr><th>Bulan</th><th>Jumlah Invoice</th><th>Total Nominal</th></tr></thead><tbody><tr v-for="row in statistics.invoiceStatistics" :key="row.status"><td>{{ row.status }}</td><td>{{ row.jumlah }}</td><td>{{ formatRupiah(row.totalNominal) }}</td></tr><tr v-if="!statistics.invoiceStatistics.length"><td colspan="3" class="empty">Belum ada statistik invoice.</td></tr></tbody></table></div></section></template></LoadingState></main></template>
