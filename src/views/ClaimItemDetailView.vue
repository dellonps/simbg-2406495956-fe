<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatRupiah } from '@/utils/format'
import type { ClaimItem } from '@/types/simbg'

const route = useRoute(); const item = ref<ClaimItem | null>(null); const loading = ref(true); const error = ref('')
onMounted(async () => { try { item.value = await request<ClaimItem>(`/claim/${route.params.id}/item/${route.params.itemId}`) } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat item claim.' } finally { loading.value = false } })
</script>

<template><main class="page"><RouterLink class="back-link" :to="`/claim/${route.params.id}`">← Kembali ke detail claim</RouterLink><LoadingState :loading="loading" :error="error"><template v-if="item"><header class="page-header"><div><p class="eyebrow">Detail Claim Item · {{ item.id }}</p><h1>{{ item.description }}</h1><p class="subtitle">Komponen {{ item.componentName }}</p></div><RouterLink class="button button-secondary" :to="`/claim/${route.params.id}/item/${item.id}/ubah`">Ubah Item</RouterLink></header><section class="summary-grid"><article class="summary-card"><span>Kuantitas</span><strong>{{ item.quantity }}</strong></article><article class="summary-card"><span>Harga satuan</span><strong>{{ formatRupiah(item.unitPrice) }}</strong></article><article class="summary-card"><span>Jumlah</span><strong>{{ formatRupiah(item.amount) }}</strong></article><article class="summary-card"><span>Batas tarif · {{ item.rateBasis.replaceAll('_', ' ') }}</span><strong>{{ formatRupiah(item.maxRate) }}</strong></article></section></template></LoadingState></main></template>
