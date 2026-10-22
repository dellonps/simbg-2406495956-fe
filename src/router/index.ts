import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SchoolView from '@/views/SchoolView.vue'
import BudgetListView from '@/views/BudgetListView.vue'
import BudgetFormView from '@/views/BudgetFormView.vue'
import BudgetDetailView from '@/views/BudgetDetailView.vue'
import BudgetComponentFormView from '@/views/BudgetComponentFormView.vue'
import BudgetComponentDetailView from '@/views/BudgetComponentDetailView.vue'
import ClaimListView from '@/views/ClaimListView.vue'
import ClaimFormView from '@/views/ClaimFormView.vue'
import ClaimDetailView from '@/views/ClaimDetailView.vue'
import ClaimItemFormView from '@/views/ClaimItemFormView.vue'
import ClaimItemDetailView from '@/views/ClaimItemDetailView.vue'
import InvoiceListView from '@/views/InvoiceListView.vue'
import InvoiceFormView from '@/views/InvoiceFormView.vue'
import InvoiceDetailView from '@/views/InvoiceDetailView.vue'
import InvoiceStatisticsView from '@/views/InvoiceStatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/sekolah', name: 'sekolah', component: SchoolView },
    { path: '/anggaran', name: 'anggaran', component: BudgetListView },
    { path: '/anggaran/tambah', name: 'anggaran-tambah', component: BudgetFormView },
    { path: '/anggaran/:id', name: 'anggaran-detail', component: BudgetDetailView },
    { path: '/anggaran/:id/komponen/tambah', name: 'komponen-tambah', component: BudgetComponentFormView },
    { path: '/anggaran/:id/komponen/:componentId/ubah', name: 'komponen-ubah', component: BudgetComponentFormView },
    { path: '/anggaran/:id/komponen/:componentId', name: 'komponen-detail', component: BudgetComponentDetailView },
    { path: '/claim', name: 'claim', component: ClaimListView },
    { path: '/claim/tambah', name: 'claim-tambah', component: ClaimFormView },
    { path: '/claim/:id', name: 'claim-detail', component: ClaimDetailView },
    { path: '/claim/:id/ubah', name: 'claim-ubah', component: ClaimFormView },
    { path: '/claim/:id/item/tambah', name: 'claim-item-tambah', component: ClaimItemFormView },
    { path: '/claim/:id/item/:itemId/ubah', name: 'claim-item-ubah', component: ClaimItemFormView },
    { path: '/claim/:id/item/:itemId', name: 'claim-item-detail', component: ClaimItemDetailView },
    { path: '/invoice', name: 'invoice', component: InvoiceListView },
    { path: '/invoice/terbitkan', name: 'invoice-terbitkan', component: InvoiceFormView },
    { path: '/invoice/statistik', name: 'invoice-statistik', component: InvoiceStatisticsView },
    { path: '/invoice/:invoiceNumber', name: 'invoice-detail', component: InvoiceDetailView },
  ],
})

export default router
