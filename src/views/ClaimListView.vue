<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Claim } from '@/types/simbg'

const rows = ref<Claim[]>([]); const loading = ref(true); const error = ref('')
onMounted(async () => { try { rows.value = await request<Claim[]>('/claim') } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat claim.' } finally { loading.value = false } })
</script>

<template><main class="page"><header class="page-header"><div><p class="eyebrow">Pertanggungjawaban</p><h1>Claim</h1><p class="subtitle">Pantau pengajuan dan status pertanggungjawaban anggaran.</p></div><RouterLink class="button" to="/claim/tambah">+ Tambah Claim</RouterLink></header><LoadingState :loading="loading" :error="error"><div class="table-wrap"><table><thead><tr><th>ID</th><th>Tanggal</th><th>Total Claim</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="claim in rows" :key="claim.id"><td class="mono">{{ claim.id }}</td><td>{{ formatDate(claim.claimDate) }}</td><td>{{ formatRupiah(claim.totalClaim) }}</td><td><span class="pill" :class="claim.status === 'DISETUJUI' ? 'pill-green' : ''">{{ claim.status.replaceAll('_', ' ') }}</span></td><td><RouterLink class="text-link" :to="`/claim/${claim.id}`">Detail →</RouterLink></td></tr><tr v-if="!rows.length"><td colspan="5" class="empty">Belum ada claim.</td></tr></tbody></table></div></LoadingState></main></template>
