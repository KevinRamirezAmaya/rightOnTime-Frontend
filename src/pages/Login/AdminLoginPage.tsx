import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent, FormEvent } from 'react'

import { Field } from '../../components/forms/Field'
import { login as authLogin } from '../../services/auth'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
    setError(null)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await authLogin(username, password)
      // Redirigir al dashboard después del login exitoso
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white/85 p-10 shadow-soft backdrop-blur-md">
      <h1 className="text-3xl font-semibold text-pastel-navy">Acceso Administradores</h1>
      <p className="mt-2 text-sm text-ink/70">
        Ingresa tus credenciales para acceder al panel de administración.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} data-testid="admin-login-form">
        <Field label="Nombre de usuario" htmlFor="admin-username">
          <input
            id="admin-username"
            name="username"
            type="text"
            required
            placeholder="usuario"
            value={username}
            onChange={handleUsernameChange}
            disabled={isLoading}
          />
        </Field>
        <Field label="Contraseña" htmlFor="admin-password">
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
          />
        </Field>

        <button 
          type="submit" 
          className="w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-pastel-lilac/40 p-6 text-sm text-center">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="rounded-full bg-white/70 px-4 py-2 font-semibold text-pastel-navy shadow-sm transition hover:translate-y-[-1px]"
        >
          ← Volver al check-in de empleados
        </button>
      </div>
    </div>
  )
}

export default AdminLoginPage
