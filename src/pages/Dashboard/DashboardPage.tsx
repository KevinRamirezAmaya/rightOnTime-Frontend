import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent, FormEvent } from 'react'

import { MetricCard } from '../../components/shared/MetricCard'
import { Field } from '../../components/forms/Field'
import { getAllAttendanceRecords } from '../../services/attendance'
import { logout as authLogout } from '../../services/auth'
import { createEmployee } from '../../services/employees'
import type { AttendanceRecordAPI, Employee } from '../../types/app'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [records, setRecords] = useState<AttendanceRecordAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<'all' | number>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState(false)
  const [employeeForm, setEmployeeForm] = useState<Employee>({
    id_employee: '',
    document_id: 0,
    name: '',
    lastname: '',
    email: '',
    phone_number: 0,
  })

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true)
        const data = await getAllAttendanceRecords()
        setRecords(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los registros')
        if (err instanceof Error && err.message.includes('sesión')) {
          // Si hay error de sesión, redirigir al login
          setTimeout(() => {
            handleLogout()
          }, 2000)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const employees = useMemo(() => {
    const unique = new Map<number, number>()
    records.forEach((record) => {
      if (!unique.has(record.employee_id)) {
        unique.set(record.employee_id, record.employee_id)
      }
    })
    return Array.from(unique.entries())
  }, [records])

  const filteredRecords = useMemo(() => {
    const relevant = selectedEmployee === 'all'
      ? records
      : records.filter((record) => record.employee_id === selectedEmployee)

    return relevant.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))
  }, [records, selectedEmployee])

  const stats = useMemo(() => {
    const totalRecords = filteredRecords.length
    const completedRecords = filteredRecords.filter(r => r.check_out_time !== null)
    const pendingCheckOuts = filteredRecords.filter(r => r.check_out_time === null).length

    // Calcular entrada promedio
    const avgCheckIn = filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => {
          const time = r.check_in_time.split(':')
          return sum + parseInt(time[0]) * 60 + parseInt(time[1])
        }, 0) / filteredRecords.length
      : 0
    
    const avgCheckInHours = Math.floor(avgCheckIn / 60)
    const avgCheckInMins = Math.floor(avgCheckIn % 60)

    // Calcular salida promedio
    const avgCheckOut = completedRecords.length > 0
      ? completedRecords.reduce((sum, r) => {
          const time = r.check_out_time!.split(':')
          return sum + parseInt(time[0]) * 60 + parseInt(time[1])
        }, 0) / completedRecords.length
      : 0
    
    const avgCheckOutHours = Math.floor(avgCheckOut / 60)
    const avgCheckOutMins = Math.floor(avgCheckOut % 60)

    // Calcular horas trabajadas promedio
    const avgWorked = completedRecords.length > 0
      ? completedRecords.reduce((sum, r) => {
          const checkIn = r.check_in_time.split(':')
          const checkOut = r.check_out_time!.split(':')
          const inMins = parseInt(checkIn[0]) * 60 + parseInt(checkIn[1])
          const outMins = parseInt(checkOut[0]) * 60 + parseInt(checkOut[1])
          return sum + (outMins - inMins)
        }, 0) / completedRecords.length
      : 0

    const avgWorkedHours = Math.floor(avgWorked / 60)
    const avgWorkedMins = Math.floor(avgWorked % 60)

    return {
      averageEntry: totalRecords > 0 ? `${String(avgCheckInHours).padStart(2, '0')}:${String(avgCheckInMins).padStart(2, '0')}` : '--:--',
      averageExit: completedRecords.length > 0 ? `${String(avgCheckOutHours).padStart(2, '0')}:${String(avgCheckOutMins).padStart(2, '0')}` : '--:--',
      averageWorked: completedRecords.length > 0 ? `${avgWorkedHours}h ${avgWorkedMins}m` : '--',
      pendingCheckOuts,
    }
  }, [filteredRecords])

  const handleLogout = () => {
    authLogout()
    navigate('/admin-login', { replace: true })
  }

  const handleEmployeeFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEmployeeForm(prev => ({
      ...prev,
      [name]: name === 'document_id' || name === 'phone_number' ? Number(value) : value
    }))
    setCreateError(null)
  }

  const handleCreateEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreating(true)
    setCreateError(null)
    setCreateSuccess(false)

    try {
      await createEmployee(employeeForm)
      setCreateSuccess(true)
      // Resetear formulario
      setEmployeeForm({
        id_employee: '',
        document_id: 0,
        name: '',
        lastname: '',
        email: '',
        phone_number: 0,
      })
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowCreateModal(false)
        setCreateSuccess(false)
      }, 2000)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error al crear el empleado')
    } finally {
      setIsCreating(false)
    }
  }

  const openCreateModal = () => {
    setShowCreateModal(true)
    setCreateError(null)
    setCreateSuccess(false)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setCreateError(null)
    setCreateSuccess(false)
    setEmployeeForm({
      id_employee: '',
      document_id: 0,
      name: '',
      lastname: '',
      email: '',
      phone_number: 0,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--'
    return timeString.substring(0, 5) // HH:MM
  }

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return '--'
    
    const [inH, inM] = checkIn.split(':').map(Number)
    const [outH, outM] = checkOut.split(':').map(Number)
    
    const inMins = inH * 60 + inM
    const outMins = outH * 60 + outM
    const diff = outMins - inMins
    
    const hours = Math.floor(diff / 60)
    const mins = diff % 60
    
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-3xl bg-white/80 p-10 shadow-soft backdrop-blur text-center">
          <p className="text-lg text-ink/70">Cargando registros de asistencia...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col justify-between gap-4 rounded-3xl bg-white/80 p-10 shadow-soft backdrop-blur md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2rem] text-ink/60">Panel administrativo</p>
            <h2 className="mt-2 text-4xl font-semibold text-pastel-navy">Dashboard de asistencia</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Visualiza métricas clave como horas promedio, puntualidad y salidas pendientes para tomar decisiones informadas.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={openCreateModal} 
              className="bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
            >
              + Crear Empleado
            </button>
            <button 
              type="button" 
              onClick={handleLogout} 
              className="w-full max-w-[180px] bg-ink text-white hover:bg-pastel-navy"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-4">
        <MetricCard title="Entrada promedio" value={stats.averageEntry} subtitle="Promedio de la muestra" />
        <MetricCard title="Salida promedio" value={stats.averageExit} subtitle="En base a registros completos" />
        <MetricCard title="Horas promedio" value={stats.averageWorked} subtitle="Horas efectivas por jornada" />
        <MetricCard title="Salidas pendientes" value={`${stats.pendingCheckOuts}`} subtitle="Registros sin salida" highlight />
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-pastel-navy">Detalle de registros</h3>
            <p className="text-sm text-ink/70">Filtra por colaborador para analizar su comportamiento horario.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <label className="text-xs font-semibold uppercase tracking-[0.2rem] text-ink/60" htmlFor="dashboard-filter">
              Seleccionar colaborador
            </label>
            <select
              id="dashboard-filter"
              className="rounded-xl border border-pastel-lilac/60 bg-white/80 px-4 py-3 text-sm text-ink"
              value={selectedEmployee}
              onChange={(event) => setSelectedEmployee(event.target.value === 'all' ? 'all' : Number(event.target.value))}
            >
              <option value="all">Todos los empleados</option>
              {employees.map(([employeeId]) => (
                <option key={employeeId} value={employeeId}>
                  Empleado ID: {employeeId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <p className="mt-6 text-sm text-ink/60">No hay registros disponibles para este filtro.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-pastel-lilac/50">
            <table className="min-w-full divide-y divide-pastel-lilac/60 text-sm">
              <thead className="bg-pastel-lilac/50 text-ink/70">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Colaborador</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold">Entrada</th>
                  <th className="px-4 py-3 text-left font-semibold">Salida</th>
                  <th className="px-4 py-3 text-left font-semibold">Horas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pastel-lilac/40 bg-white/60">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 font-medium text-ink/80">
                      <div>Empleado {record.employee_id}</div>
                      <span className="text-xs uppercase tracking-[0.2rem] text-ink/50">{record.id_attendance}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{formatDate(record.date)}</td>
                    <td className="px-4 py-3 text-ink/80">{formatTime(record.check_in_time)}</td>
                    <td className="px-4 py-3 text-ink/80">
                      <span className={record.check_out_time ? 'text-ink/80' : 'text-orange-500 font-semibold'}>
                        {formatTime(record.check_out_time)}
                        {!record.check_out_time && ' (Activo)'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/80">
                      {calculateDuration(record.check_in_time, record.check_out_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </div>

      {/* Modal de creación de empleado */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-pastel-navy">Crear Nuevo Empleado</h2>
              <button
                onClick={closeCreateModal}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 text-xl font-bold"
                disabled={isCreating}
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                ¡Empleado creado exitosamente!
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-5">
              <Field label="ID Empleado" htmlFor="id_employee">
                <input
                  id="id_employee"
                  name="id_employee"
                  type="text"
                  required
                  placeholder="EMPxxx"
                  value={employeeForm.id_employee}
                  onChange={handleEmployeeFormChange}
                  disabled={isCreating}
                />
              </Field>

              <Field label="Número de Documento" htmlFor="document_id">
                <input
                  id="document_id"
                  name="document_id"
                  type="number"
                  required
                  placeholder="123456789"
                  value={employeeForm.document_id || ''}
                  onChange={handleEmployeeFormChange}
                  disabled={isCreating}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nombre" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Nombres"
                    value={employeeForm.name}
                    onChange={handleEmployeeFormChange}
                    disabled={isCreating}
                  />
                </Field>

                <Field label="Apellido" htmlFor="lastname">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    placeholder="Apellidos"
                    value={employeeForm.lastname}
                    onChange={handleEmployeeFormChange}
                    disabled={isCreating}
                  />
                </Field>
              </div>

              <Field label="Correo Electrónico" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={employeeForm.email}
                  onChange={handleEmployeeFormChange}
                  disabled={isCreating}
                />
              </Field>

              <Field label="Número de Teléfono" htmlFor="phone_number">
                <input
                  id="phone_number"
                  name="phone_number"
                  type="number"
                  required
                  placeholder="1234567890"
                  value={employeeForm.phone_number || ''}
                  onChange={handleEmployeeFormChange}
                  disabled={isCreating}
                />
              </Field>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  className="flex-1 py-3 text-base bg-gray-200 hover:bg-gray-300 text-ink disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 text-base bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                >
                  {isCreating ? 'Creando...' : 'Crear Empleado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardPage
