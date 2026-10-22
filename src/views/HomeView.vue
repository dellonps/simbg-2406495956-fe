<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { request } from '@/api/client'
import type { DashboardData } from '@/types/dashboard'

const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const error = ref('')

const metrics = (data: DashboardData) => [
  { label: 'Jumlah Sekolah', value: data.jumlahSekolah.toLocaleString('id-ID') },
  {
    label: 'Total Anggaran',
    value: `Rp ${data.totalAnggaran.toLocaleString('id-ID')}`,
  },
  { label: 'Jumlah Invoice', value: data.jumlahInvoice.toLocaleString('id-ID') },
  {
    label: 'Total Nominal Invoice',
    value: `Rp ${data.totalNominalInvoice.toLocaleString('id-ID')}`,
  },
]

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
  <main class="home">
    <header class="page-heading">
      <p class="eyebrow">Ringkasan</p>
      <h1>Beranda</h1>
      <p class="subtitle">Pantau data sekolah, anggaran, dan invoice.</p>
    </header>

    <p v-if="loading" class="status" role="status">Memuat data beranda…</p>
    <p v-else-if="error" class="status error" role="alert">Data beranda gagal dimuat: {{ error }}</p>
    <section v-else-if="dashboard" class="metrics" aria-label="Ringkasan dashboard">
      <article v-for="metric in metrics(dashboard)" :key="metric.label" class="metric-card">
        <h2>{{ metric.label }}</h2>
        <p>{{ metric.value }}</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.home {
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.page-heading {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #172554;
  font-size: 2rem;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #64748b;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.metric-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  background: #fff;
  box-shadow: 0 4px 14px rgb(15 23 42 / 5%);
}

.metric-card h2 {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
}

.metric-card p {
  margin: 0.875rem 0 0;
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 700;
}

.status {
  color: #475569;
}

.error {
  color: #b91c1c;
}

@media (max-width: 600px) {
  .home {
    padding: 2rem 1rem;
  }
}
</style>
