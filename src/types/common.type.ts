export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  totalPages: number
  todayCount: number
}

export interface ParamsTypes {
  page?: number
  limit?: number
  search?: string
  sort?: string
}
