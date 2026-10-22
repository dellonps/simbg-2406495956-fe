export interface School {
  id: string
  nama: string
  educationLevel: string
  address: string
}

export interface Budget {
  id: string
  startPeriod: string
  endPeriod: string
  totalAnggaran: number
  status: string
  description?: string | null
  sekolahId?: string
  namaSekolah?: string
  totalAllocated?: number
  remainingAmount?: number
}

export interface BudgetComponent {
  id: string
  componentName: string
  allocatedAmount: number
  maxRate: number
  rateBasis: string
  description?: string | null
  anggaranId?: string
  usedAmount?: number
  remainingAmount?: number
}

export interface ClaimItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  claimId: string
  budgetComponentId: string
  componentName: string
  rateBasis: string
  maxRate: number
}

export interface Claim {
  id: string
  claimDate: string
  totalClaim: number
  status: string
  submittedAt?: string | null
  approvedAt?: string | null
  approvedBy?: string | null
  rejectedReason?: string | null
  description?: string | null
  anggaranId?: string
  resubmitCount?: number
  claimItems?: ClaimItem[]
}

export interface Invoice {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  status: string
  claimId: string
  claimDate?: string
  claimItems?: ClaimItem[]
  createdAt?: string
  updatedAt?: string
}

export interface Statistics {
  claimStatistics: Array<{ status: string; jumlah: number; totalNominal: number }>
  invoiceStatistics: Array<{ status: string; jumlah: number; totalNominal: number }>
}
