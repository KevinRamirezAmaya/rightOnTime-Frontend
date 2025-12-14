import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkIn, checkOut, getAllAttendanceRecords } from '../attendance'
import * as auth from '../auth'

describe('Attendance Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkIn', () => {
    it('should perform check-in successfully', async () => {
      const mockResponse = {
        message: 'Check-in successful',
        document_id: 1234567891,
        timestamp: '2025-12-13T10:00:00',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await checkIn('1234567891')

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/attendance/checkin/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ document_id: 1234567891 }),
        })
      )
    })

    it('should throw error on 409 conflict', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
      })

      await expect(checkIn('1234567891')).rejects.toThrow('Ya tienes un ingreso activo')
    })
  })

  describe('checkOut', () => {
    it('should perform check-out successfully', async () => {
      const mockResponse = {
        message: 'Check-out successful',
        document_id: 1234567891,
        timestamp: '2025-12-13T18:00:00',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await checkOut('1234567891')

      expect(result).toEqual(mockResponse)
    })

    it('should throw error on 409 conflict', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
      })

      await expect(checkOut('1234567891')).rejects.toThrow('No tienes un ingreso activo')
    })
  })

  describe('getAllAttendanceRecords', () => {
    it('should fetch all records with valid token', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue('valid-token')

      const mockRecords = [
        {
          id: 1,
          id_attendance: 'A-123',
          date: '2025-12-13',
          check_in_time: '09:00:00',
          check_out_time: '18:00:00',
          status: 'Present',
          employee_id: 1,
          created_at: '2025-12-13T09:00:00Z',
          updated_at: '2025-12-13T18:00:00Z',
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockRecords,
      })

      const result = await getAllAttendanceRecords()

      expect(result).toEqual(mockRecords)
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/attendance/all/',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      )
    })

    it('should throw error when no token', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue(null)

      await expect(getAllAttendanceRecords()).rejects.toThrow('No hay sesión activa')
    })

    it('should throw error on 401 unauthorized', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue('expired-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(getAllAttendanceRecords()).rejects.toThrow('Sesión expirada')
    })
  })
})
