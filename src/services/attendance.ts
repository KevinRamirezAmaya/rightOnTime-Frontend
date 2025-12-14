import { getToken } from './auth'
import type { AttendanceRecordAPI } from '../types/app'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export type CheckInRequest = {
  document_id: number
}

export type CheckInResponse = {
  message: string
  document_id: number
  timestamp: string
  // Agregar otros campos según la respuesta real del backend
}

export type CheckOutResponse = {
  message: string
  document_id: number
  timestamp: string
  // Agregar otros campos según la respuesta real del backend
}

export const checkIn = async (documentId: string): Promise<CheckInResponse> => {
  const response = await fetch(`${API_BASE_URL}/attendance/checkin/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: Number.parseInt(documentId, 10),
    }),
  })

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Ya tienes un ingreso activo. Debes marcar salida primero.')
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error al registrar el ingreso')
  }

  return response.json()
}

export const checkOut = async (documentId: string): Promise<CheckOutResponse> => {
  const response = await fetch(`${API_BASE_URL}/attendance/checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: Number.parseInt(documentId, 10),
    }),
  })

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('No tienes un ingreso activo. Debes marcar entrada primero.')
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error al registrar la salida')
  }

  return response.json()
}

export const getAllAttendanceRecords = async (): Promise<AttendanceRecordAPI[]> => {
  const token = getToken()
  
  if (!token) {
    throw new Error('No hay sesión activa. Por favor inicia sesión.')
  }

  const response = await fetch(`${API_BASE_URL}/attendance/all/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
    }
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || 'Error al obtener los registros de asistencia')
  }

  return response.json()
}
