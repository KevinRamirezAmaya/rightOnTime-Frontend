import { render, renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AppProvider, useAppContext } from '../context/AppContext'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('AppContext', () => {
  describe('Initial State', () => {
    it('should initialize with null session', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })
      expect(result.current.session).toBeNull()
    })

    it('should initialize with seeded records', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })
      expect(result.current.records).toBeDefined()
      expect(Array.isArray(result.current.records)).toBe(true)
    })

    it('should initialize with null flashMessage', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })
      expect(result.current.flashMessage).toBeNull()
    })
  })

  describe('login', () => {
    it('should login as admin', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        const response = result.current.login({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
        })
        expect(response.role).toBe('admin')
      })

      expect(result.current.session).toEqual({
        role: 'admin',
        employee: null,
      })
    })

    it('should login as employee with existing profile', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      // Primer login para crear el perfil
      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const firstSession = result.current.session

      // Logout
      act(() => {
        result.current.logout()
      })

      // Segundo login con el mismo email
      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session).toEqual(firstSession)
    })

    it('should create new employee profile on first login', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        const response = result.current.login({
          email: 'newemployee@test.com',
          password: 'password123',
          role: 'employee',
        })
        expect(response.role).toBe('employee')
      })

      expect(result.current.session?.role).toBe('employee')
      expect(result.current.session?.employee).toBeDefined()
      expect(result.current.session?.employee?.name).toBeDefined()
      expect(result.current.session?.employee?.id).toBeDefined()
    })

    it('should normalize email before login', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: '  UPPERCASE@TEST.COM  ',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session?.employee).toBeDefined()
    })

    it('should clear flash message on login', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      // Set a flash message first
      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: 'Test User',
        })
      })

      expect(result.current.flashMessage).not.toBeNull()

      // Login should clear it
      act(() => {
        result.current.login({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
        })
      })

      expect(result.current.flashMessage).toBeNull()
    })
  })

  describe('registerAccount', () => {
    it('should register an employee account', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'newuser@test.com',
          password: 'password123',
          role: 'employee',
          name: 'New User',
          employeeId: 'EMP001',
        })
      })

      expect(result.current.flashMessage).toContain('Registro exitoso')
      expect(result.current.flashMessage).toContain('New User')
    })

    it('should register an admin account', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
          name: 'Admin User',
        })
      })

      expect(result.current.flashMessage).toBeDefined()
    })

    it('should use derived name when name is empty', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'john.doe@test.com',
          password: 'password123',
          role: 'employee',
          name: '',
        })
      })

      expect(result.current.flashMessage).toContain('John Doe')
    })

    it('should use derived employeeId when not provided', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: 'Test User',
        })
      })

      // Then login to verify the profile was created correctly
      act(() => {
        result.current.login({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session?.employee?.id).toBeDefined()
    })

    it('should convert name to title case', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: 'john doe',
        })
      })

      expect(result.current.flashMessage).toContain('John Doe')
    })

    it('should uppercase employeeId', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: 'Test User',
          employeeId: 'emp123',
        })
      })

      // Login to check the stored ID
      act(() => {
        result.current.login({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session?.employee?.id).toBe('EMP123')
    })
  })

  describe('logout', () => {
    it('should clear session on logout', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
        })
      })

      expect(result.current.session).not.toBeNull()

      act(() => {
        result.current.logout()
      })

      expect(result.current.session).toBeNull()
    })
  })

  describe('registerCheckIn', () => {
    beforeEach(() => {
      // Helper to ensure we're logged in as employee before each test
    })

    it('should register check-in for logged in employee', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const initialRecordCount = result.current.records.length
      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckIn(timestamp)
      })

      expect(result.current.records.length).toBeGreaterThan(initialRecordCount)
    })

    it('should not register check-in when not logged in', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      const initialRecordCount = result.current.records.length
      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckIn(timestamp)
      })

      expect(result.current.records.length).toBe(initialRecordCount)
    })

    it('should not register check-in for admin', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
        })
      })

      const initialRecordCount = result.current.records.length
      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckIn(timestamp)
      })

      expect(result.current.records.length).toBe(initialRecordCount)
    })

    it('should update existing record on same day check-in', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const timestamp1 = '2024-01-15T08:00:00.000Z'
      const timestamp2 = '2024-01-15T08:30:00.000Z'

      act(() => {
        result.current.registerCheckIn(timestamp1)
      })

      const countAfterFirst = result.current.records.length

      act(() => {
        result.current.registerCheckIn(timestamp2)
      })

      const countAfterSecond = result.current.records.length

      // Should update, not create new
      expect(countAfterSecond).toBe(countAfterFirst)
    })

    it('should create record with correct employee info', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'john.doe@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckIn(timestamp)
      })

      const lastRecord = result.current.records[result.current.records.length - 1]
      expect(lastRecord.employeeId).toBe(result.current.session?.employee?.id)
      expect(lastRecord.name).toBe(result.current.session?.employee?.name)
      expect(lastRecord.checkIn).toBe(timestamp)
      expect(lastRecord.checkOut).toBeNull()
    })
  })

  describe('registerCheckOut', () => {
    it('should register check-out for logged in employee', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const checkInTime = '2024-01-15T08:00:00.000Z'
      const checkOutTime = '2024-01-15T17:00:00.000Z'

      act(() => {
        result.current.registerCheckIn(checkInTime)
      })

      act(() => {
        result.current.registerCheckOut(checkOutTime)
      })

      const lastRecord = result.current.records[result.current.records.length - 1]
      expect(lastRecord.checkOut).toBe(checkOutTime)
    })

    it('should not register check-out when not logged in', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      const initialRecordCount = result.current.records.length
      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckOut(timestamp)
      })

      expect(result.current.records.length).toBe(initialRecordCount)
    })

    it('should not register check-out for admin', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
        })
      })

      const initialRecordCount = result.current.records.length
      const timestamp = new Date().toISOString()

      act(() => {
        result.current.registerCheckOut(timestamp)
      })

      expect(result.current.records.length).toBe(initialRecordCount)
    })

    it('should create record with both check-in and check-out if no existing record', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const timestamp = '2024-01-20T17:00:00.000Z'

      act(() => {
        result.current.registerCheckOut(timestamp)
      })

      const lastRecord = result.current.records[result.current.records.length - 1]
      expect(lastRecord.checkIn).toBe(timestamp)
      expect(lastRecord.checkOut).toBe(timestamp)
    })

    it('should update existing record with check-out time', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'employee@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const checkInTime = '2024-01-15T08:00:00.000Z'
      const checkOutTime = '2024-01-15T17:00:00.000Z'

      act(() => {
        result.current.registerCheckIn(checkInTime)
      })

      const recordBeforeCheckout = result.current.records.find(
        r => r.employeeId === result.current.session?.employee?.id && r.checkIn === checkInTime
      )

      expect(recordBeforeCheckout?.checkOut).toBeNull()

      act(() => {
        result.current.registerCheckOut(checkOutTime)
      })

      const recordAfterCheckout = result.current.records.find(
        r => r.employeeId === result.current.session?.employee?.id && r.checkIn === checkInTime
      )

      expect(recordAfterCheckout?.checkOut).toBe(checkOutTime)
    })
  })

  describe('clearFlashMessage', () => {
    it('should clear flash message', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: 'Test User',
        })
      })

      expect(result.current.flashMessage).not.toBeNull()

      act(() => {
        result.current.clearFlashMessage()
      })

      expect(result.current.flashMessage).toBeNull()
    })
  })

  describe('useAppContext error handling', () => {
    it('should throw error when used outside AppProvider', () => {
      expect(() => {
        renderHook(() => useAppContext())
      }).toThrow('useAppContext debe usarse dentro de AppProvider')
    })
  })

  describe('AppProvider rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <AppProvider>
          <div>Test Child</div>
        </AppProvider>
      )

      expect(getByText('Test Child')).toBeDefined()
    })
  })

  describe('Multiple employee workflows', () => {
    it('should handle multiple employees with different profiles', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      // Employee 1
      act(() => {
        result.current.login({
          email: 'john.smith@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const employee1 = result.current.session?.employee

      act(() => {
        result.current.registerCheckIn('2024-01-15T08:00:00.000Z')
      })

      act(() => {
        result.current.logout()
      })

      // Employee 2
      act(() => {
        result.current.login({
          email: 'mary.jones@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      const employee2 = result.current.session?.employee

      expect(employee1?.id).not.toBe(employee2?.id)
      expect(employee1?.name).not.toBe(employee2?.name)
    })
  })

  describe('Edge cases', () => {
    it('should handle emails with special characters', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.login({
          email: 'user+test@example.com',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session?.employee).toBeDefined()
    })

    it('should handle registering with trimmed whitespace in name', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper })

      act(() => {
        result.current.registerAccount({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
          name: '   Test User   ',
          employeeId: '   EMP001   ',
        })
      })

      act(() => {
        result.current.login({
          email: 'test@test.com',
          password: 'password123',
          role: 'employee',
        })
      })

      expect(result.current.session?.employee?.name).toBe('Test User')
      expect(result.current.session?.employee?.id).toBe('EMP001')
    })
  })
})
