export interface BaseResponse<T> {
  status: number
  message: string
  timestamp: string
  data: T
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const body: BaseResponse<T> = await res.json()
  if (!res.ok) throw new Error(body.message)
  return body.data
}