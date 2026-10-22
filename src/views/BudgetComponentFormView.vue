<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { request } from '@/api/client'
import type { BudgetComponent } from '@/types/simbg'

const route = useRoute(); const router = useRouter()
const budgetId = computed(() => String(route.params.id))
const componentId = computed(() => route.params.componentId ? String(route.params.componentId) : '')
const editing = computed(() => Boolean(componentId.value))
const error = ref(''); const saving = ref(false)
const form = reactive({ componentName: '', allocatedAmount: 0, rateBasis: 'PER_PORSI', maxRate: 0, description: '' })
onMounted(async () => {
  if (!editing.value) return
  try {
    const component = await request<BudgetComponent>(`/anggaran/${budgetId.value}/komponen/${componentId.value}`)
    form.componentName = component.componentName
    form.allocatedAmount = component.allocatedAmount
    form.rateBasis = component.rateBasis
    form.maxRate = component.maxRate
    form.description = component.description || ''
  }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat komponen.' }
})
async function submit() {
  error.value = ''
  if (form.allocatedAmount <= 0 || form.maxRate <= 0) { error.value = 'Alokasi dan tarif maksimum harus lebih dari 0.'; return }
  saving.value = true
  try {
    const path = `/anggaran/${budgetId.value}/komponen${editing.value ? `/${componentId.value}` : ''}`
    const component = await request<BudgetComponent>(path, { method: editing.value ? 'PUT' : 'POST', body: JSON.stringify(form) })
    await router.push(`/anggaran/${budgetId.value}/komponen/${component.id}`)
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal menyimpan komponen.' }
  finally { saving.value = false }
}
</script>

<template>
  <main class="page narrow"><RouterLink class="back-link" :to="`/anggaran/${budgetId}`">← Kembali ke detail anggaran</RouterLink><header class="page-header"><div><p class="eyebrow">Komponen Anggaran</p><h1>{{ editing ? 'Ubah Komponen' : 'Tambah Komponen' }}</h1><p class="subtitle">Atur alokasi dan batas biaya komponen.</p></div></header><form class="form-card" @submit.prevent="submit"><label>Nama komponen<input v-model.trim="form.componentName" required placeholder="Contoh: Bahan pangan"></label><label>Alokasi (Rp)<input v-model.number="form.allocatedAmount" type="number" min="1" required></label><div class="form-grid"><label>Basis tarif<select v-model="form.rateBasis"><option value="PER_PORSI">Per porsi</option><option value="PER_HARI">Per hari</option><option value="PER_TOTAL">Total</option></select></label><label>Tarif maksimum (Rp)<input v-model.number="form.maxRate" type="number" min="1" required></label></div><label>Deskripsi (opsional)<textarea v-model="form.description" rows="3"></textarea></label><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="form-actions"><RouterLink class="button button-secondary" :to="`/anggaran/${budgetId}`">Batal</RouterLink><button class="button" :disabled="saving">{{ saving ? 'Menyimpan…' : 'Simpan Komponen' }}</button></div></form></main>
</template>
