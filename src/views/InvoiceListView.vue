<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Invoice } from '@/types/simbg'

const rows = ref<Invoice[]>([]); const loading = ref(true); const error = ref('')
onMounted(async () => { try { rows.value = await request<Invoice[]>('/invoice') } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat invoice.' } finally { loading.value = false } })
</script>

<template><main class="page"><header class="page-header"><div><p class="eyebrow">Pembayaran Program</p><h1>Invoice</h1><p class="subtitle">Daftar tagihan yang diterbitkan dari claim disetujui.</p></div><div class="header-actions"><RouterLink class="button button-secondary" to="/invoice/statistik">Statistik Claim Invoice</RouterLink><RouterLink class="button" to="/invoice/terbitkan">+ Penerbitan Invoice</RouterLink></div></header><LoadingState :loading="loading" :error="error"><div class="table-wrap"><table><thead><tr><th>Nomor Invoice</th><th>Tanggal Invoice</th><th>Jatuh Tempo</th><th>Total Tagihan</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="invoice in rows" :key="invoice.invoiceNumber"><td class="mono strong">{{ invoice.invoiceNumber }}</td><td>{{ formatDate(invoice.invoiceDate) }}</td><td>{{ formatDate(invoice.dueDate) }}</td><td>{{ formatRupiah(invoice.totalAmount) }}</td><td><span class="pill" :class="invoice.status === 'DIBAYAR' ? 'pill-green' : ''">{{ invoice.status.replaceAll('_', ' ') }}</span></td><td><RouterLink class="text-link" :to="`/invoice/${invoice.invoiceNumber}`">Detail →</RouterLink></td></tr><tr v-if="!rows.length"><td colspan="6" class="empty">Belum ada invoice.</td></tr></tbody></table></div></LoadingState></main></template>
