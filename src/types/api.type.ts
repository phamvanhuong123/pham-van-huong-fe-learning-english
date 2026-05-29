export interface IMeta {
  limit: number
  page: number
  total: number
  totalPages: number
}

export interface IResponse<T> {
  data: T
  meta: IMeta
}
