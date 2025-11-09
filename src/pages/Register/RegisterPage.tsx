import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent, FormEvent } from 'react'

import { Field } from '../../components/forms/Field'
import { useAppContext } from '../../context/AppContext'
import type { RegisterPayload } from '../../types/app'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { registerAccount } = useAppContext()
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    employeeId: '',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    registerAccount(form)
    navigate('/login', { replace: true })
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl bg-white/85 p-10 shadow-soft backdrop-blur-md">
      <h2 className="text-3xl font-semibold text-pastel-navy">Crea tu cuenta</h2>
      <p className="mt-2 text-sm text-ink/70">
        Registra colaboradores o administra el panel de métricas de tu organización.
      </p>

      <form className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <Field label="Nombre completo" htmlFor="register-name">
          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Nombre y Apellido"
            value={form.name}
            onChange={handleChange}
          />
        </Field>
        <Field label="Correo corporativo" htmlFor="register-email">
          <input
            id="register-email"
            name="email"
            type="email"
            required
            placeholder="nombre@empresa.com"
            value={form.email}
            onChange={handleChange}
          />
        </Field>
        <Field label="Contraseña" htmlFor="register-password">
          <input
            id="register-password"
            name="password"
            type="password"
            required
            placeholder="Crea una contraseña segura"
            value={form.password}
            onChange={handleChange}
          />
        </Field>
        <Field label="Rol" htmlFor="register-role">
          <select id="register-role" name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </Field>
        {form.role === 'employee' && (
          <Field
            className="md:col-span-2"
            label="ID de empleado (opcional)"
            htmlFor="register-employee-id"
            helper="Si ya tienes un identificador interno, escríbelo para mantener consistencia."
          >
            <input
              id="register-employee-id"
              name="employeeId"
              type="text"
              placeholder="EMP-001"
              value={form.employeeId}
              onChange={handleChange}
            />
          </Field>
        )}

        <button type="submit" className="mt-2 w-full py-3 text-base md:col-span-2">
          Completar registro
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-pastel-sky/40 p-6 text-sm text-ink/80">
        ¿Ya tienes cuenta?
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="ml-3 rounded-full bg-white/70 px-4 py-2 font-semibold text-pastel-navy shadow-sm transition hover:translate-y-[-1px]"
        >
          Inicia sesión
        </button>
      </div>
    </div>
  )
}

export default RegisterPage
