<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatRupiah } from '@/utils/format'
import type { BudgetComponent } from '@/types/simbg'

const route = useRoute(); const item = ref<BudgetComponent | null>(null); const loading = ref(true); const error = ref('')
onMounted(async () => {
  try { item.value = await request<BudgetComponent>(`/anggaran/${route.params.id}/komponen/${route.params.componentId}`) }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat detail komponen.' }
  finally { loading.value = false }
})
</script>

<template><main class="page"><RouterLink class="back-link" :to="`/anggaran/${route.params.id}`">← Kembali ke detail anggaran</RouterLink><LoadingState :loading="loading" :error="error"><template v-if="item"><header class="page-header"><div><p class="eyebrow">Detail Komponen · {{ item.id }}</p><h1>{{ item.componentName }}</h1><p class="subtitle">Rincian alokasi dan penggunaan dana.</p></div><RouterLink class="button button-secondary" :to="`/anggaran/${route.params.id}/komponen/${item.id}/ubah`">Ubah Komponen</RouterLink></header><section class="summary-grid"><article class="summary-card"><span>Alokasi</span><strong>{{ formatRupiah(item.allocatedAmount) }}</strong></article><article class="summary-card"><span>Terpakai</span><strong>{{ formatRupiah(item.usedAmount) }}</strong></article><article class="summary-card"><span>Sisa alokasi</span><strong>{{ formatRupiah(item.remainingAmount) }}</strong></article><article class="summary-card"><span>Tarif maksimum · {{ item.rateBasis.replaceAll('_', ' ') }}</span><strong>{{ formatRupiah(item.maxRate) }}</strong></article></section><section class="detail-card"><h2>Informasi komponen</h2><dl><div><dt>ID</dt><dd>{{ item.id }}</dd></div><div><dt>Deskripsi</dt><dd>{{ item.description || '—' }}</dd></div><div><dt>Anggaran</dt><dd>{{ item.anggaranId || route.params.id }}</dd></div></dl></section></template></LoadingState></main></template>
