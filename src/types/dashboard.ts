export interface DashboardData {
  jumlahSekolah: number
  totalAnggaran: number
  jumlahInvoice: number
  totalNominalInvoice: number
}

export interface DashboardResponse {
  status: number
  message: string
  timestamp: string
  data: DashboardData
}
