<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { request } from '@/api/client'
import type { Claim } from '@/types/simbg'

const route = useRoute(); const router = useRouter(); const id = computed(() => String(route.params.id || '')); const editing = computed(() => Boolean(id.value))
const form = reactive({ claimDate: '', description: '' }); const error = ref(''); const saving = ref(false)
onMounted(async () => { if (!editing.value) return; try { const claim = await request<Claim>(`/claim/${id.value}`); form.claimDate = claim.claimDate; form.description = claim.description || '' } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal memuat claim.' } })
async function submit() { saving.value = true; error.value = ''; try { const result = await request<Claim>(`/claim${editing.value ? `/${id.value}` : ''}`, { method: editing.value ? 'PUT' : 'POST', body: JSON.stringify(form) }); await router.push(`/claim/${result.id}`) } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Gagal menyimpan claim.' } finally { saving.value = false } }
</script>

<template><main class="page narrow"><RouterLink class="back-link" :to="editing ? `/claim/${id}` : '/claim'">← Kembali</RouterLink><header class="page-header"><div><p class="eyebrow">Pertanggungjawaban</p><h1>{{ editing ? 'Ubah Claim' : 'Tambah Claim' }}</h1><p class="subtitle">{{ editing ? 'Perubahan hanya tersedia untuk claim berstatus draft.' : 'Buat claim baru untuk mulai mencatat item belanja.' }}</p></div></header><form class="form-card" @submit.prevent="submit"><label>Tanggal claim<input v-model="form.claimDate" type="date" required></label><label>Deskripsi (opsional)<textarea v-model="form.description" rows="3"></textarea></label><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="form-actions"><RouterLink class="button button-secondary" :to="editing ? `/claim/${id}` : '/claim'">Batal</RouterLink><button class="button" :disabled="saving">{{ saving ? 'Menyimpan…' : 'Simpan Claim' }}</button></div></form></main></template>
