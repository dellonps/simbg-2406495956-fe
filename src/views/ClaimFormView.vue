<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { request } from '@/api/client'
import type { Budget, Claim } from '@/types/simbg'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id || ''))
const editing = computed(() => Boolean(id.value))
const form = reactive({ anggaranId: '', claimDate: '', description: '' })
const budgets = ref<Budget[]>([])
const error = ref('')
const saving = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    const [availableBudgets, claim] = await Promise.all([
      request<Budget[]>('/anggaran'),
      editing.value ? request<Claim>(`/claim/${id.value}`) : Promise.resolve(null),
    ])
    budgets.value = availableBudgets
    if (claim) {
      form.anggaranId = claim.anggaranId || ''
      form.claimDate = claim.claimDate
      form.description = claim.description || ''
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat data anggaran atau claim.'
  } finally {
    loading.value = false
  }
})

async function submit() {
  error.value = ''
  saving.value = true
  try {
    const result = await request<Claim>(`/claim${editing.value ? `/${id.value}` : ''}`, {
      method: editing.value ? 'PUT' : 'POST',
      body: JSON.stringify(form),
    })
    await router.push(`/claim/${result.id}`)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal menyimpan claim.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="page narrow">
    <RouterLink class="back-link" :to="editing ? `/claim/${id}` : '/claim'">← Kembali</RouterLink>
    <header class="page-header"><div><p class="eyebrow">Pertanggungjawaban</p><h1>{{ editing ? 'Ubah Claim' : 'Tambah Claim' }}</h1><p class="subtitle">{{ editing ? 'Perbarui data claim dan anggaran terkait.' : 'Buat claim baru untuk mulai mencatat item belanja.' }}</p></div></header>
    <p v-if="loading" class="notice" role="status">Memuat data anggaran…</p>
    <form v-else class="form-card" @submit.prevent="submit">
      <label>Anggaran<select v-model="form.anggaranId" required><option value="" disabled>Pilih anggaran</option><option v-for="budget in budgets" :key="budget.id" :value="budget.id">{{ budget.id }} · {{ budget.namaSekolah || budget.sekolahId || 'Sekolah' }} · {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(budget.totalAnggaran) }}</option></select></label>
      <p v-if="!budgets.length" class="helper-text">Belum ada anggaran. Buat anggaran terlebih dahulu sebelum menambahkan claim.</p>
      <label>Tanggal claim<input v-model="form.claimDate" type="date" required></label>
      <label>Deskripsi (opsional)<textarea v-model="form.description" rows="3"></textarea></label>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="form-actions"><RouterLink class="button button-secondary" :to="editing ? `/claim/${id}` : '/claim'">Batal</RouterLink><button class="button" :disabled="saving || !budgets.length">{{ saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Simpan Claim' }}</button></div>
    </form>
  </main>
</template>
