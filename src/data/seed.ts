import type { AttendanceRecord } from '../types/app'

export const seededRecords: AttendanceRecord[] = [
  {
    recordId: 'EMP-001-2025-11-03',
    employeeId: 'EMP-001',
    name: 'Ana Martínez',
    checkIn: '2025-11-03T08:54:00',
    checkOut: '2025-11-03T17:12:00',
  },
  {
    recordId: 'EMP-001-2025-11-04',
    employeeId: 'EMP-001',
    name: 'Ana Martínez',
    checkIn: '2025-11-04T08:47:00',
    checkOut: '2025-11-04T17:05:00',
  },
  {
    recordId: 'EMP-002-2025-11-03',
    employeeId: 'EMP-002',
    name: 'Luis Fernández',
    checkIn: '2025-11-03T09:05:00',
    checkOut: '2025-11-03T18:02:00',
  },
  {
    recordId: 'EMP-002-2025-11-04',
    employeeId: 'EMP-002',
    name: 'Luis Fernández',
    checkIn: '2025-11-04T08:58:00',
    checkOut: '2025-11-04T17:44:00',
  },
  {
    recordId: 'EMP-003-2025-11-03',
    employeeId: 'EMP-003',
    name: 'María Gómez',
    checkIn: '2025-11-03T08:40:00',
    checkOut: '2025-11-03T16:55:00',
  },
  {
    recordId: 'EMP-003-2025-11-04',
    employeeId: 'EMP-003',
    name: 'María Gómez',
    checkIn: '2025-11-04T08:42:00',
    checkOut: null,
  },
]
