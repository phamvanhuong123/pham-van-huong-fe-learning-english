export interface LoginPayload {
  email: string
  password?: string
}

export interface RegisterRequest {
  email: string
  name: string
  password?: string
}
