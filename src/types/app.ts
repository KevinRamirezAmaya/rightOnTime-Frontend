export type Role = 'employee' | 'admin'

export type AttendanceRecord = {
  recordId: string
  employeeId: string
  name: string
  checkIn: string
  checkOut: string | null
}

export type AttendanceRecordAPI = {
  id: number
  id_attendance: string
  date: string
  check_in_time: string
  check_out_time: string | null
  status: string
  employee_id: number
  created_at: string
  updated_at: string
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

export type Employee = {
  id_employee: string
  document_id: number
  name: string
  lastname: string
  email: string
  phone_number: number
}
