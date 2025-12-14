import { getToken } from './auth'

const API_BASE_URL = 'http://127.0.0.1:8000'

export type CreateEmployeeRequest = {
  id_employee: string
  document_id: number
  name: string
  lastname: string
  email: string
  phone_number: number
}

export type EmployeeResponse = {
  id_employee: string
  document_id: number
  name: string
  lastname: string
  email: string
  phone_number: number
  created_at?: string
  updated_at?: string
}

export const createEmployee = async (employeeData: CreateEmployeeRequest): Promise<EmployeeResponse> => {
  const token = getToken()
  
  if (!token) {
    throw new Error('No hay sesión activa. Por favor inicia sesión.')
  }

  const response = await fetch(`${API_BASE_URL}/employees/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
    }
    if (response.status === 400) {
      const error = await response.json().catch(() => ({ message: 'Datos inválidos' }))
      throw new Error(error.message || 'Los datos del empleado son inválidos')
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error al crear el empleado')
  }

  return response.json()
}
