import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { seededRecords } from '../data/seed'
import {
  buildEmployeeIdFromEmail,
  buildRecordId,
  deriveNameFromEmail,
  normalizeEmail,
  toTitleCase,
} from '../helpers/attendance'
import type {
  AppSession,
  AttendanceRecord,
  DirectoryMap,
  LoginPayload,
  RegisterPayload,
  Role,
} from '../types/app'

export type AppContextValue = {
  session: AppSession | null
  records: AttendanceRecord[]
  flashMessage: string | null
  login: (payload: LoginPayload) => { role: Role }
  registerAccount: (payload: RegisterPayload) => void
  logout: () => void
  registerCheckIn: (iso: string) => void
  registerCheckOut: (iso: string) => void
  clearFlashMessage: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>(seededRecords)
  const [directory, setDirectory] = useState<DirectoryMap>({})
  const [session, setSession] = useState<AppSession | null>(null)
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  const login = useCallback((payload: LoginPayload): { role: Role } => {
    const normalizedEmail = normalizeEmail(payload.email)
    setFlashMessage(null)

    if (payload.role === 'admin') {
      setSession({ role: 'admin', employee: null })
  return { role: 'admin' }
    }

    let profile = directory[normalizedEmail]

    if (!profile) {
      const nextProfile = {
        id: buildEmployeeIdFromEmail(payload.email),
        name: deriveNameFromEmail(payload.email),
      }
      profile = nextProfile
      setDirectory((prev) => ({
        ...prev,
        [normalizedEmail]: nextProfile,
      }))
    }

    setSession({
      role: 'employee',
      employee: profile,
    })

    return { role: 'employee' }
  }, [directory])

  const registerAccount = useCallback((payload: RegisterPayload) => {
    const normalizedEmail = normalizeEmail(payload.email)
    const preferredName = payload.name.trim() || deriveNameFromEmail(payload.email)
    const preferredId = payload.employeeId?.trim().toUpperCase() || buildEmployeeIdFromEmail(payload.email)

    if (payload.role === 'employee') {
      setDirectory((prev) => ({
        ...prev,
        [normalizedEmail]: {
          id: preferredId,
          name: toTitleCase(preferredName),
        },
      }))
    }

    setFlashMessage(`Registro exitoso para ${toTitleCase(preferredName)}. Inicia sesión para comenzar.`)
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const registerCheckIn = useCallback((timestamp: string) => {
    setRecords((prev) => {
      if (!session || session.role !== 'employee' || !session.employee) {
        return prev
      }

      const recordId = buildRecordId(session.employee.id, timestamp)
      const existingIndex = prev.findIndex((record) => record.recordId === recordId)

      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          checkIn: timestamp,
          name: session.employee.name,
        }
        return next
      }

      return [
        ...prev,
        {
          recordId,
          employeeId: session.employee.id,
          name: session.employee.name,
          checkIn: timestamp,
          checkOut: null,
        },
      ]
    })
  }, [session])

  const registerCheckOut = useCallback((timestamp: string) => {
    setRecords((prev) => {
      if (!session || session.role !== 'employee' || !session.employee) {
        return prev
      }

      const recordId = buildRecordId(session.employee.id, timestamp)
      const existingIndex = prev.findIndex((record) => record.recordId === recordId)

      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          checkOut: timestamp,
          name: session.employee.name,
        }
        return next
      }

      return [
        ...prev,
        {
          recordId,
          employeeId: session.employee.id,
          name: session.employee.name,
          checkIn: timestamp,
          checkOut: timestamp,
        },
      ]
    })
  }, [session])

  const clearFlashMessage = useCallback(() => {
    setFlashMessage(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      records,
      flashMessage,
      login,
      registerAccount,
      logout,
      registerCheckIn,
      registerCheckOut,
      clearFlashMessage,
    }),
    [session, records, flashMessage, login, registerAccount, logout, registerCheckIn, registerCheckOut, clearFlashMessage],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider')
  }
  return context
}
