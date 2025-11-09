import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent, FormEvent } from 'react'

import { Field } from '../../components/forms/Field'
import { useAppContext } from '../../context/AppContext'
import { homeRouteForRole } from '../../helpers/attendance'
import type { LoginPayload } from '../../types/app'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, flashMessage } = useAppContext()
  const [form, setForm] = useState<LoginPayload>({
    email: '',
    password: '',
    role: 'employee',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = login(form)
    navigate(homeRouteForRole(result.role), { replace: true })
  }

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white/85 p-10 shadow-soft backdrop-blur-md">
      <h1 className="text-3xl font-semibold text-pastel-navy">Bienvenido a RightOnTime</h1>
      <p className="mt-2 text-sm text-ink/70">
        Gestiona entradas y salidas con un estilo minimalista y profesional.
      </p>

      {flashMessage && (
        <div className="mt-6 rounded-2xl border border-pastel-mint/60 bg-pastel-mint/40 p-4 text-sm text-ink">
          {flashMessage}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} data-testid="login-form">
        <Field label="Correo electrónico" htmlFor="login-email">
          <input
            id="login-email"
            name="email"
            type="email"
            required
            placeholder="nombre@empresa.com"
            value={form.email}
            onChange={handleChange}
          />
        </Field>
        <Field label="Contraseña" htmlFor="login-password">
          <input
            id="login-password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </Field>
        <Field label="Rol" htmlFor="login-role">
          <select id="login-role" name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </Field>

        <button type="submit" className="w-full py-3 text-base">
          Iniciar sesión
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-pastel-lilac/40 p-6 text-sm text-ink/80">
        ¿Aún no tienes cuenta?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="rounded-full bg-white/70 px-4 py-2 font-semibold text-pastel-navy shadow-sm transition hover:translate-y-[-1px]"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  )
}

export default LoginPage
