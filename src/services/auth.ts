const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  access: string
  refresh: string
}

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Credenciales incorrectas')
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error al iniciar sesión')
  }

  const data: LoginResponse = await response.json()
  
  // Guardar tokens en localStorage
  localStorage.setItem(TOKEN_KEY, data.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
  
  return data
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}
