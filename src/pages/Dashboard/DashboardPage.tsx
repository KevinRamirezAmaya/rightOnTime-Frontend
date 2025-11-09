import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MetricCard } from '../../components/shared/MetricCard'
import { useAppContext } from '../../context/AppContext'
import {
  calculateWorkedMinutes,
  computeDashboardStats,
  formatDate,
  formatDuration,
  formatTime,
} from '../../helpers/attendance'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { records, logout } = useAppContext()
  const [selectedEmployee, setSelectedEmployee] = useState<'all' | string>('all')

  const employees = useMemo(() => {
    const unique = new Map<string, string>()
    records.forEach((record) => {
      if (!unique.has(record.employeeId)) {
        unique.set(record.employeeId, record.name)
      }
    })
    return Array.from(unique.entries())
  }, [records])

  const filteredRecords = useMemo(() => {
    const base = selectedEmployee === 'all'
    const relevant = base
      ? records
      : records.filter((record) => record.employeeId === selectedEmployee)

    return relevant.slice().sort((a, b) => b.checkIn.localeCompare(a.checkIn))
  }, [records, selectedEmployee])

  const stats = useMemo(() => computeDashboardStats(filteredRecords), [filteredRecords])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col justify-between gap-4 rounded-3xl bg-white/80 p-10 shadow-soft backdrop-blur md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2rem] text-ink/60">Panel administrativo</p>
          <h2 className="mt-2 text-4xl font-semibold text-pastel-navy">Dashboard de asistencia</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Visualiza métricas clave como horas promedio, puntualidad y salidas pendientes para tomar decisiones informadas.
          </p>
        </div>
        <button type="button" onClick={handleLogout} className="w-full max-w-[180px] bg-ink text-white hover:bg-pastel-navy">
          Cerrar sesión
        </button>
      </header>

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
              onChange={(event) => setSelectedEmployee(event.target.value as 'all' | string)}
            >
              <option value="all">Todos los empleados</option>
              {employees.map(([employeeId, name]) => (
                <option key={employeeId} value={employeeId}>
                  {name} · {employeeId}
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
                  <tr key={record.recordId}>
                    <td className="px-4 py-3 font-medium text-ink/80">
                      <div>{record.name}</div>
                      <span className="text-xs uppercase tracking-[0.2rem] text-ink/50">{record.employeeId}</span>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{formatDate(record.checkIn)}</td>
                    <td className="px-4 py-3 text-ink/80">{formatTime(record.checkIn)}</td>
                    <td className="px-4 py-3 text-ink/80">{formatTime(record.checkOut)}</td>
                    <td className="px-4 py-3 text-ink/80">
                      {formatDuration(calculateWorkedMinutes(record.checkIn, record.checkOut))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
