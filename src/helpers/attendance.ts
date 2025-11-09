import type { AttendanceRecord } from '../types/app'

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const formatTime = (iso: string | null) => {
  if (!iso) {
    return '--:--'
  }

  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDate = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export const calculateWorkedMinutes = (checkIn: string, checkOut: string | null) => {
  if (!checkOut) {
    return null
  }

  const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return null
  }

  return Math.round(diffMs / 60000)
}

export const formatDuration = (minutes: number | null) => {
  if (minutes == null) {
    return '--'
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${String(remainingMinutes).padStart(2, '0')}m`
}

export const buildRecordId = (employeeId: string, iso: string) => {
  return `${employeeId}-${iso.slice(0, 10)}`
}

export const minutesFromIso = (iso: string | null) => {
  if (!iso) {
    return null
  }

  const date = new Date(iso)
  return date.getHours() * 60 + date.getMinutes()
}

const averageMinutes = (values: Array<number | null>) => {
  const valid = values.filter((value): value is number => value != null)
  if (valid.length === 0) {
    return null
  }

  const total = valid.reduce((acc, value) => acc + value, 0)
  return Math.round(total / valid.length)
}

export const formatAverageMinutes = (minutes: number | null) => {
  if (minutes == null) {
    return '--:--'
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export const formatAverageHours = (minutes: number | null) => {
  if (minutes == null) {
    return '--'
  }

  return `${(minutes / 60).toFixed(1)} h`
}

export const computeDashboardStats = (records: AttendanceRecord[]) => {
  const averageEntry = averageMinutes(records.map((record) => minutesFromIso(record.checkIn)))
  const averageExit = averageMinutes(records.map((record) => minutesFromIso(record.checkOut)))
  const averageWorked = averageMinutes(
    records.map((record) => calculateWorkedMinutes(record.checkIn, record.checkOut)),
  )
  const pendingCheckOuts = records.filter((record) => record.checkOut == null).length

  return {
    averageEntry: formatAverageMinutes(averageEntry),
    averageExit: formatAverageMinutes(averageExit),
    averageWorked: formatAverageHours(averageWorked),
    pendingCheckOuts,
  }
}

export const toTitleCase = (value: string) => {
  if (!value) {
    return 'Empleado'
  }

  return value
    .split(/[^A-Za-zÀ-ÿ]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const buildEmployeeIdFromEmail = (email: string) => {
  const localPart = email.split('@')[0] ?? 'EMP'
  const sanitized = localPart.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const base = sanitized.slice(0, 6).padEnd(6, '0')
  return `EMP-${base}`
}

export const deriveNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] ?? ''
  const cleaned = localPart.replace(/[._]/g, ' ').replace(/\d+/g, ' ').trim()
  return toTitleCase(cleaned) || 'Colaborador'
}

export const homeRouteForRole = (role: 'employee' | 'admin') => {
  return role === 'admin' ? '/dashboard' : '/employee'
}
