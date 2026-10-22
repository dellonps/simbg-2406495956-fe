<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/api/client'
import type { School } from '@/types/simbg'

const router = useRouter()
const schools = ref<School[]>([])
const error = ref('')
const saving = ref(false)
const form = reactive({ sekolahId: '', startPeriod: '', endPeriod: '', totalAnggaran: 0, status: 'AKTIF', description: '' })
onMounted(async () => {
  try { schools.value = await request<School[]>('/sekolah') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat sekolah.' }
})
async function submit() {
  error.value = ''
  if (form.endPeriod < form.startPeriod) { error.value = 'Tanggal akhir harus setelah tanggal mulai.'; return }
  if (form.totalAnggaran <= 0) { error.value = 'Total anggaran harus lebih dari 0.'; return }
  saving.value = true
  try {
    const budget = await request<{ id: string }>('/anggaran', { method: 'POST', body: JSON.stringify(form) })
    await router.push(`/anggaran/${budget.id}`)
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal menyimpan anggaran.' }
  finally { saving.value = false }
}
</script>

<template>
  <main class="page narrow"><RouterLink class="back-link" to="/anggaran">← Kembali ke Anggaran</RouterLink><header class="page-header"><div><p class="eyebrow">Perencanaan Dana</p><h1>Tambah Anggaran</h1><p class="subtitle">Tentukan periode dan pagu anggaran sekolah.</p></div></header>
    <form class="form-card" @submit.prevent="submit"><label>Sekolah<select v-model="form.sekolahId" required><option value="" disabled>Pilih sekolah</option><option v-for="school in schools" :key="school.id" :value="school.id">{{ school.id }} — {{ school.nama }}</option></select></label><div class="form-grid"><label>Mulai periode<input v-model="form.startPeriod" type="date" required></label><label>Akhir periode<input v-model="form.endPeriod" type="date" :min="form.startPeriod" required></label></div><label>Total anggaran (Rp)<input v-model.number="form.totalAnggaran" type="number" min="1" step="1" required></label><label>Status<select v-model="form.status"><option>AKTIF</option><option>NONAKTIF</option></select></label><label>Deskripsi (opsional)<textarea v-model="form.description" rows="3" placeholder="Catatan anggaran"></textarea></label><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="form-actions"><RouterLink class="button button-secondary" to="/anggaran">Batal</RouterLink><button class="button" :disabled="saving">{{ saving ? 'Menyimpan…' : 'Simpan Anggaran' }}</button></div></form>
  </main>
</template>
