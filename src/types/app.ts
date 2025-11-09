export type Role = 'employee' | 'admin'

export type AttendanceRecord = {
  recordId: string
  employeeId: string
  name: string
  checkIn: string
  checkOut: string | null
}

export type ActiveEmployee = {
  id: string
  name: string
}

export type LoginPayload = {
  email: string
  password: string
  role: Role
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: Role
  employeeId?: string
}

export type DirectoryMap = Record<string, ActiveEmployee>

export type AppSession = {
  role: Role
  employee: ActiveEmployee | null
}
