<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Budget, BudgetComponent } from '@/types/simbg'

const route = useRoute()
const budget = ref<Budget | null>(null)
const components = ref<BudgetComponent[]>([])
const loading = ref(true)
const error = ref('')
async function load() {
  loading.value = true; error.value = ''
  try {
    const id = String(route.params.id)
    const [budgetData, componentData] = await Promise.all([request<Budget>(`/anggaran/${id}`), request<BudgetComponent[]>(`/anggaran/${id}/komponen`)])
    budget.value = budgetData; components.value = componentData
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat detail anggaran.' }
  finally { loading.value = false }
}
onMounted(load); watch(() => route.params.id, load)
</script>

<template>
  <main class="page"><RouterLink class="back-link" to="/anggaran">← Kembali ke Anggaran</RouterLink><LoadingState :loading="loading" :error="error"><template v-if="budget"><header class="page-header"><div><p class="eyebrow">Detail Anggaran · {{ budget.id }}</p><h1>{{ budget.namaSekolah || budget.id }}</h1><p class="subtitle">{{ formatDate(budget.startPeriod) }} – {{ formatDate(budget.endPeriod) }}</p></div><RouterLink class="button" :to="`/anggaran/${budget.id}/komponen/tambah`">+ Tambah Komponen</RouterLink></header><section class="summary-grid"><article class="summary-card"><span>Total Anggaran</span><strong>{{ formatRupiah(budget.totalAnggaran) }}</strong></article><article class="summary-card"><span>Total Alokasi</span><strong>{{ formatRupiah(budget.totalAllocated) }}</strong></article><article class="summary-card"><span>Sisa Anggaran</span><strong>{{ formatRupiah(budget.remainingAmount) }}</strong></article><article class="summary-card"><span>Status</span><strong><span class="pill pill-green">{{ budget.status }}</span></strong></article></section><section class="section-block"><header class="section-heading"><div><h2>Komponen Anggaran</h2><p>Alokasi anggaran berdasarkan komponen belanja.</p></div></header><div class="table-wrap"><table><thead><tr><th>ID</th><th>Komponen</th><th>Alokasi</th><th>Basis tarif</th><th>Tarif maksimum</th><th>Sisa alokasi</th><th></th></tr></thead><tbody><tr v-for="component in components" :key="component.id"><td class="mono">{{ component.id }}</td><td class="strong">{{ component.componentName }}</td><td>{{ formatRupiah(component.allocatedAmount) }}</td><td>{{ component.rateBasis.replaceAll('_', ' ') }}</td><td>{{ formatRupiah(component.maxRate) }}</td><td>{{ formatRupiah(component.remainingAmount) }}</td><td class="row-actions component-actions"><RouterLink class="text-link" :to="`/anggaran/${budget.id}/komponen/${component.id}`">Detail</RouterLink><RouterLink class="text-link" :to="`/anggaran/${budget.id}/komponen/${component.id}/ubah`">Ubah</RouterLink></td></tr><tr v-if="!components.length"><td colspan="7" class="empty">Belum ada komponen untuk anggaran ini.</td></tr></tbody></table></div></section></template></LoadingState></main>
</template>

<style scoped>
.component-actions { gap:1.2rem; transform:translateX(1.25rem); }
</style>
