<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { request } from '@/api/client'
import LoadingState from '@/components/LoadingState.vue'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Claim } from '@/types/simbg'

const route = useRoute()
const claim = ref<Claim | null>(null)
const loading = ref(true)
const error = ref('')
const status = ref('')
const rejectedReason = ref('')
const approvedBy = ref('')
const updating = ref(false)
const actionError = ref('')
const maxResubmissions = 3

const nextStatuses = computed(() => {
  if (
    claim.value?.status === 'DITOLAK' &&
    (claim.value.resubmitCount || 0) >= maxResubmissions
  ) {
    return []
  }

  return (
    {
      DRAFT: ['DIAJUKAN', 'DIBATALKAN'],
      DIAJUKAN: ['DIVERIFIKASI', 'DIBATALKAN'],
      DIVERIFIKASI: ['DISETUJUI', 'DITOLAK'],
      DITOLAK: ['DIAJUKAN'],
    } as Record<string, string[]>
  )[claim.value?.status || ''] || []
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    claim.value = await request<Claim>(`/claim/${route.params.id}`)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Gagal memuat claim.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.id, load)

async function updateStatus(nextStatus?: string) {
  if (!claim.value) return
  if (nextStatus) status.value = nextStatus
  if (!status.value) return

  actionError.value = ''
  updating.value = true
  try {
    await request<Claim>(`/claim/${claim.value.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status.value,
        rejectedReason: rejectedReason.value,
        approvedBy: approvedBy.value,
      }),
    })
    status.value = ''
    await load()
  } catch (cause) {
    actionError.value =
      cause instanceof Error ? cause.message : 'Gagal mengubah status claim.'
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <main class="page">
    <RouterLink class="back-link" to="/claim">← Kembali ke Claim</RouterLink>
    <LoadingState :loading="loading" :error="error">
      <template v-if="claim">
        <header class="page-header">
          <div>
            <p class="eyebrow">Detail Claim · {{ claim.id }}</p>
            <h1>Claim {{ claim.id }}</h1>
            <p class="subtitle">
              Tanggal {{ formatDate(claim.claimDate) }} · Anggaran {{ claim.anggaranId || '—' }}
            </p>
          </div>
          <RouterLink
            v-if="claim.status === 'DRAFT' || claim.status === 'DITOLAK'"
            class="button button-secondary"
            :to="`/claim/${claim.id}/ubah`"
          >
            Ubah Claim
          </RouterLink>
        </header>

        <section class="summary-grid">
          <article class="summary-card">
            <span>Total Claim</span>
            <strong>{{ formatRupiah(claim.totalClaim) }}</strong>
          </article>
          <article class="summary-card">
            <span>Status</span>
            <strong>
            <span class="pill" :class="claim.status === 'DISETUJUI' ? 'pill-green' : claim.status === 'DITOLAK' ? 'pill-red' : ''">
                {{ claim.status.replaceAll('_', ' ') }}
              </span>
            </strong>
          </article>
          <article class="summary-card">
            <span>Tanggal diajukan</span>
            <strong class="small-value">{{ claim.submittedAt ? formatDate(claim.submittedAt) : 'Belum diajukan' }}</strong>
          </article>
          <article class="summary-card">
            <span>Disetujui</span>
            <strong class="small-value">{{ formatDate(claim.approvedAt) }}</strong>
          </article>
        </section>

        <div v-if="claim.description" class="description-box claim-description">
          <strong>Deskripsi claim</strong>
          <p>{{ claim.description }}</p>
        </div>
        <section v-if="claim.status === 'DITOLAK'" class="rejection-card" aria-label="Informasi penolakan claim">
          <div><strong>Alasan penolakan</strong><p>{{ claim.rejectedReason || 'Tidak ada keterangan.' }}</p></div>
          <span v-if="nextStatuses.length">Pengajuan ulang berikutnya {{ (claim.resubmitCount || 0) + 1 }}/{{ maxResubmissions }}</span>
          <span v-else>Batas pengajuan ulang {{ maxResubmissions }}/{{ maxResubmissions }}</span>
        </section>

        <section class="section-block">
          <header class="section-heading">
            <div>
              <h2>Claim Item</h2>
              <p>Rincian penggunaan anggaran pada claim ini.</p>
            </div>
            <div class="header-actions">
              <RouterLink
                v-if="claim.status === 'DRAFT' || claim.status === 'DITOLAK'"
                class="button"
                :to="`/claim/${claim.id}/item/tambah`"
              >
                + Tambah Item
              </RouterLink>
              <button
                v-if="claim.status === 'DITOLAK' && nextStatuses.length"
                class="button button-secondary"
                type="button"
                :disabled="updating"
                @click="updateStatus('DIAJUKAN')"
              >
                {{ updating ? 'Mengajukan…' : `Ajukan ulang (${(claim.resubmitCount || 0) + 1}/${maxResubmissions})` }}
              </button>
              <span v-else-if="claim.status === 'DITOLAK'" class="helper-text retry-limit">
                Batas pengajuan ulang tercapai
              </span>
            </div>
          </header>
          <p v-if="claim.status === 'DITOLAK' && actionError" class="form-error" role="alert">{{ actionError }}</p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deskripsi</th>
                  <th>Komponen</th>
                  <th>Qty</th>
                  <th>Harga satuan</th>
                  <th>Jumlah</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in claim.claimItems || []" :key="item.id">
                  <td class="mono">{{ item.id }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.componentName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatRupiah(item.unitPrice) }}</td>
                  <td>{{ formatRupiah(item.amount) }}</td>
                  <td class="row-actions claim-item-actions">
                    <RouterLink class="text-link" :to="`/claim/${claim.id}/item/${item.id}`">
                      Detail
                    </RouterLink>
                    <RouterLink
                      v-if="claim.status === 'DRAFT' || claim.status === 'DITOLAK'"
                      class="text-link"
                      :to="`/claim/${claim.id}/item/${item.id}/ubah`"
                    >
                      Ubah
                    </RouterLink>
                  </td>
                </tr>
                <tr v-if="!claim.claimItems?.length">
                  <td colspan="7" class="empty">Belum ada item claim.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="5">Total</th>
                  <th>{{ formatRupiah(claim.totalClaim) }}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section v-if="claim.status !== 'DITOLAK' && nextStatuses.length" class="section-block status-action">
          <header class="section-heading">
            <div>
              <h2>Ubah Status Claim</h2>
              <p>Status berikutnya yang tersedia: {{ nextStatuses.join(', ') }}.</p>
            </div>
          </header>
          <form class="inline-form" @submit.prevent="updateStatus()">
            <label>
              Status
              <select v-model="status" required>
                <option value="" disabled>Pilih status</option>
                <option v-for="next in nextStatuses" :key="next" :value="next">
                  {{ next }}
                </option>
              </select>
            </label>
            <label v-if="status === 'DITOLAK'">
              Alasan penolakan
              <textarea v-model="rejectedReason" rows="3" required placeholder="Jelaskan alasan penolakan"></textarea>
            </label>
            <label v-if="status === 'DISETUJUI'">
              Disetujui oleh
              <input v-model="approvedBy" required>
            </label>
            <p v-if="status === 'DIAJUKAN' && !claim.claimItems?.length" class="helper-text">Tambahkan minimal satu item sebelum mengajukan claim.</p>
            <button class="button" :disabled="updating || (status === 'DIAJUKAN' && !claim.claimItems?.length)">
              {{ updating ? 'Memproses…' : 'Simpan Status' }}
            </button>
          </form>
          <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
        </section>
      </template>
    </LoadingState>
  </main>
</template>

<style scoped>
.pill-red { color:#b91c1c; background:#fee2e2; }
.claim-item-actions { min-width:9rem; justify-content:flex-end; gap:1rem; padding-right:1.5rem; }
.claim-description strong { color:#334155; font-size:.85rem; }.claim-description p { margin:.4rem 0 0; }
.rejection-card { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-top:1rem; padding:1rem 1.125rem; border:1px solid #fed7c8; border-radius:.75rem; color:#9a4c36; background:#fff3ed; }
.rejection-card strong { font-size:.85rem; }.rejection-card p { margin:.4rem 0 0; color:#a45942; }.rejection-card > span { padding:.3rem .55rem; border-radius:2rem; color:#9a4c36; background:#ffe4d7; font-size:.72rem; font-weight:700; white-space:nowrap; }
@media(max-width:560px) { .rejection-card { flex-direction:column; } }
</style>
