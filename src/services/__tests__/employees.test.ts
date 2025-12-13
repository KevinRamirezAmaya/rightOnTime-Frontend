import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmployee } from '../employees'
import * as auth from '../auth'

describe('Employees Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createEmployee', () => {
    it('should create employee successfully', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue('valid-token')

      const employeeData = {
        id_employee: 'EMP004',
        document_id: 1224566891,
        name: 'Carolina',
        lastname: 'Cruz',
        email: 'carolina.cruz@example.com',
        phone_number: 3107652233,
      }

      const mockResponse = {
        ...employeeData,
        created_at: '2025-12-13T10:00:00Z',
        updated_at: '2025-12-13T10:00:00Z',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await createEmployee(employeeData)

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/employees/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
          body: JSON.stringify(employeeData),
        })
      )
    })

    it('should throw error when no token', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue(null)

      const employeeData = {
        id_employee: 'EMP004',
        document_id: 1224566891,
        name: 'Carolina',
        lastname: 'Cruz',
        email: 'carolina.cruz@example.com',
        phone_number: 3107652233,
      }

      await expect(createEmployee(employeeData)).rejects.toThrow('No hay sesión activa')
    })

    it('should throw error on 400 bad request', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue('valid-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid data' }),
      })

      const employeeData = {
        id_employee: 'EMP004',
        document_id: 1224566891,
        name: 'Carolina',
        lastname: 'Cruz',
        email: 'carolina.cruz@example.com',
        phone_number: 3107652233,
      }

      await expect(createEmployee(employeeData)).rejects.toThrow('Invalid data')
    })

    it('should throw error on 401 unauthorized', async () => {
      vi.spyOn(auth, 'getToken').mockReturnValue('expired-token')

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })

      const employeeData = {
        id_employee: 'EMP004',
        document_id: 1224566891,
        name: 'Carolina',
        lastname: 'Cruz',
        email: 'carolina.cruz@example.com',
        phone_number: 3107652233,
      }

      await expect(createEmployee(employeeData)).rejects.toThrow('Sesión expirada')
    })
  })
})
