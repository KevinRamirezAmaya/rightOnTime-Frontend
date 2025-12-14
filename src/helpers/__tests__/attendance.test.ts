import { describe, expect, it } from 'vitest'
import {
  normalizeEmail,
  formatTime,
  formatDate,
  calculateWorkedMinutes,
  formatDuration,
  buildRecordId,
  minutesFromIso,
  formatAverageMinutes,
  formatAverageHours,
  computeDashboardStats,
  toTitleCase,
  buildEmployeeIdFromEmail,
  deriveNameFromEmail,
  homeRouteForRole,
} from '../attendance'

describe('attendance helpers', () => {
  describe('normalizeEmail', () => {
    it('should trim and lowercase email', () => {
      expect(normalizeEmail('  Test@Example.COM  ')).toBe('test@example.com')
    })
  })

  describe('formatTime', () => {
    it('should return --:-- for null', () => {
      expect(formatTime(null)).toBe('--:--')
    })

    it('should format time correctly', () => {
      const time = formatTime('2025-01-15T14:30:00')
      expect(time).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('formatDate', () => {
    it('should format date in Spanish', () => {
      const date = formatDate('2025-01-15T14:30:00')
      expect(date).toBeTruthy()
    })
  })

  describe('calculateWorkedMinutes', () => {
    it('should return null for null checkOut', () => {
      expect(calculateWorkedMinutes('2025-01-15T09:00:00', null)).toBeNull()
    })

    it('should calculate worked minutes', () => {
      const minutes = calculateWorkedMinutes('2025-01-15T09:00:00', '2025-01-15T17:30:00')
      expect(minutes).toBe(510)
    })

    it('should return null for invalid dates', () => {
      const minutes = calculateWorkedMinutes('2025-01-15T17:00:00', '2025-01-15T09:00:00')
      expect(minutes).toBeNull()
    })
  })

  describe('formatDuration', () => {
    it('should return -- for null', () => {
      expect(formatDuration(null)).toBe('--')
    })

    it('should format duration correctly', () => {
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(125)).toBe('2h 05m')
    })
  })

  describe('buildRecordId', () => {
    it('should build record ID from employeeId and date', () => {
      const id = buildRecordId('EMP-123', '2025-01-15T09:00:00')
      expect(id).toBe('EMP-123-2025-01-15')
    })
  })

  describe('minutesFromIso', () => {
    it('should return null for null input', () => {
      expect(minutesFromIso(null)).toBeNull()
    })

    it('should calculate minutes from midnight', () => {
      const minutes = minutesFromIso('2025-01-15T14:30:00')
      expect(minutes).toBe(14 * 60 + 30)
    })
  })

  describe('formatAverageMinutes', () => {
    it('should return --:-- for null', () => {
      expect(formatAverageMinutes(null)).toBe('--:--')
    })

    it('should format average minutes', () => {
      expect(formatAverageMinutes(540)).toBe('09:00')
      expect(formatAverageMinutes(1050)).toBe('17:30')
    })
  })

  describe('formatAverageHours', () => {
    it('should return -- for null', () => {
      expect(formatAverageHours(null)).toBe('--')
    })

    it('should format average hours', () => {
      expect(formatAverageHours(480)).toBe('8.0 h')
      expect(formatAverageHours(510)).toBe('8.5 h')
    })
  })

  describe('computeDashboardStats', () => {
    it('should compute stats correctly', () => {
      const records = [
        { recordId: '1', checkIn: '2025-01-15T09:00:00', checkOut: '2025-01-15T17:00:00', employeeId: 'EMP-001', name: 'John Doe' },
        { recordId: '2', checkIn: '2025-01-15T08:30:00', checkOut: '2025-01-15T16:30:00', employeeId: 'EMP-002', name: 'Jane Smith' },
        { recordId: '3', checkIn: '2025-01-15T09:15:00', checkOut: null, employeeId: 'EMP-003', name: 'Bob Johnson' },
      ]

      const stats = computeDashboardStats(records)
      expect(stats.averageEntry).toBeTruthy()
      expect(stats.averageExit).toBeTruthy()
      expect(stats.averageWorked).toBeTruthy()
      expect(stats.pendingCheckOuts).toBe(1)
    })

    it('should handle empty records', () => {
      const stats = computeDashboardStats([])
      expect(stats.averageEntry).toBe('--:--')
      expect(stats.averageExit).toBe('--:--')
      expect(stats.averageWorked).toBe('--')
      expect(stats.pendingCheckOuts).toBe(0)
    })
  })

  describe('toTitleCase', () => {
    it('should return default for empty string', () => {
      expect(toTitleCase('')).toBe('Empleado')
    })

    it('should convert to title case', () => {
      expect(toTitleCase('john doe')).toBe('John Doe')
      expect(toTitleCase('MARIA_GARCIA')).toBe('MARIA GARCIA')
    })

    it('should handle special characters', () => {
      expect(toTitleCase('josé.pérez')).toBe('José Pérez')
    })
  })

  describe('buildEmployeeIdFromEmail', () => {
    it('should build employee ID from email', () => {
      expect(buildEmployeeIdFromEmail('john.doe@example.com')).toBe('EMP-JOHNDO')
      expect(buildEmployeeIdFromEmail('maria@example.com')).toBe('EMP-MARIA0')
    })

    it('should handle short emails', () => {
      expect(buildEmployeeIdFromEmail('ab@example.com')).toBe('EMP-AB0000')
    })

    it('should sanitize special characters', () => {
      expect(buildEmployeeIdFromEmail('user-123@example.com')).toBe('EMP-USER12')
    })
  })

  describe('deriveNameFromEmail', () => {
    it('should derive name from email', () => {
      expect(deriveNameFromEmail('john.doe@example.com')).toBe('John Doe')
      expect(deriveNameFromEmail('maria_garcia@example.com')).toBe('Maria Garcia')
    })

    it('should handle emails with numbers', () => {
      expect(deriveNameFromEmail('john.doe123@example.com')).toBe('John Doe')
    })

    it('should return default for empty', () => {
      expect(deriveNameFromEmail('@example.com')).toBe('Empleado')
    })
  })

  describe('homeRouteForRole', () => {
    it('should return /dashboard for admin', () => {
      expect(homeRouteForRole('admin')).toBe('/dashboard')
    })

    it('should return /employee for employee', () => {
      expect(homeRouteForRole('employee')).toBe('/employee')
    })
  })
})
