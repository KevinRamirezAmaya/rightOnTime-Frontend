import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login, logout, getToken, getRefreshToken, isAuthenticated } from '../auth'

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await login('testuser', 'password123')

      expect(result).toEqual(mockResponse)
      expect(localStorage.getItem('access_token')).toBe('mock-access-token')
      expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token')
    })

    it('should throw error on 401 unauthorized', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(login('wronguser', 'wrongpass')).rejects.toThrow('Credenciales incorrectas')
    })

    it('should throw error on network failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' }),
      })

      await expect(login('testuser', 'password')).rejects.toThrow('Server error')
    })
  })

  describe('getToken', () => {
    it('should return stored access token', () => {
      localStorage.setItem('access_token', 'test-token')
      expect(getToken()).toBe('test-token')
    })

    it('should return null if no token stored', () => {
      expect(getToken()).toBeNull()
    })
  })

  describe('getRefreshToken', () => {
    it('should return stored refresh token', () => {
      localStorage.setItem('refresh_token', 'refresh-token')
      expect(getRefreshToken()).toBe('refresh-token')
    })

    it('should return null if no refresh token stored', () => {
      expect(getRefreshToken()).toBeNull()
    })
  })

  describe('logout', () => {
    it('should remove tokens from localStorage', () => {
      localStorage.setItem('access_token', 'token')
      localStorage.setItem('refresh_token', 'refresh')

      logout()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('access_token', 'token')
      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false)
    })
  })
})
