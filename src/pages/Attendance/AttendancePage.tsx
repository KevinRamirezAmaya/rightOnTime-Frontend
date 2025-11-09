import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SummaryRow } from '../../components/shared/SummaryRow'
import { useAppContext } from '../../context/AppContext'
import {
  calculateWorkedMinutes,
  formatDate,
  formatDuration,
  formatTime,
} from '../../helpers/attendance'

const AttendancePage = () => {
  const navigate = useNavigate()
  const { session, records, registerCheckIn, registerCheckOut, logout } = useAppContext()
  const employee = session?.employee
  const [message, setMessage] = useState<string | null>(null)

  const history = useMemo(() => {
    if (!employee) {
      return []
    }

    return records
      .filter((record) => record.employeeId === employee.id)
      .sort((a, b) => b.checkIn.localeCompare(a.checkIn))
      .slice(0, 6)
  }, [records, employee])

  if (!employee) {
    return null
  }

  const latestRecord = history[0]
  const hasOpenRecord = history.some((record) => record.checkOut == null)

  const handleCheckIn = () => {
    const now = new Date().toISOString()
    registerCheckIn(now)
    setMessage(`Entrada registrada a las ${formatTime(now)}.`)
  }

  const handleCheckOut = () => {
    if (!hasOpenRecord) {
      return
    }

    const now = new Date().toISOString()
    registerCheckOut(now)
    setMessage(`Salida registrada a las ${formatTime(now)}. ¡Buen trabajo!`)
  }

  const handleReset = () => {
    setMessage(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex w-full max-w-5xl flex-col gap-8">
      <header className="flex flex-col justify-between gap-4 rounded-3xl bg-white/75 p-8 shadow-soft backdrop-blur md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2rem] text-ink/60">Panel de empleado</p>
          <h2 className="mt-2 text-3xl font-semibold text-pastel-navy">Hola, {employee.name}! 👋</h2>
          <p className="mt-2 max-w-xl text-sm text-ink/70">
            Registra tu entrada y salida y sigue tu historial más reciente en un solo lugar.
          </p>
        </div>
        <button type="button" onClick={handleLogout} className="w-full max-w-[180px] bg-ink text-white hover:bg-pastel-navy">
          Cerrar sesión
        </button>
      </header>

      <section className="grid gap-6 md:grid-cols-5">
        <div className="rounded-3xl bg-white/80 p-8 shadow-soft backdrop-blur md:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-pastel-navy">Registrar horario</h3>
            <span className="rounded-full bg-pastel-lilac/60 px-3 py-1 text-xs font-medium text-ink/70">
              ID · {employee.id}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink/70">
            Los registros se guardan con la hora exacta de este dispositivo.
          </p>

          {message && (
            <div className="mt-6 rounded-2xl border border-pastel-mint/60 bg-pastel-mint/40 p-4 text-sm text-ink">
              {message}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" onClick={handleCheckIn} disabled={hasOpenRecord}>
              Registrar entrada
            </button>
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={!hasOpenRecord}
              className="bg-pastel-mint text-ink hover:bg-pastel-mint/90"
            >
              Registrar salida
            </button>
            <button type="button" onClick={handleReset} className="bg-white text-ink shadow-sm hover:bg-pastel-lilac/50">
              Restablecer
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-8 shadow-soft backdrop-blur md:col-span-2">
          <h3 className="text-lg font-semibold text-pastel-navy">Resumen rápido</h3>
          <div className="space-y-3 text-sm text-ink/80">
            <SummaryRow label="Última entrada" value={formatTime(latestRecord?.checkIn ?? null)} />
            <SummaryRow label="Última salida" value={formatTime(latestRecord?.checkOut ?? null)} />
            <SummaryRow
              label="Duración estimada"
              value={formatDuration(
                latestRecord ? calculateWorkedMinutes(latestRecord.checkIn, latestRecord.checkOut) : null,
              )}
            />
            <SummaryRow label="Registros activos" value={`${history.filter((record) => !record.checkOut).length}`} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-pastel-navy">Historial reciente</h3>
            <p className="text-sm text-ink/70">Los últimos movimientos se ordenan del más reciente al más antiguo.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="mt-6 text-sm text-ink/60">Aún no tienes registros guardados.</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-pastel-lilac/40">
            <table className="min-w-full divide-y divide-pastel-lilac/60 text-sm">
              <thead className="bg-pastel-lilac/50 text-ink/70">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold">Entrada</th>
                  <th className="px-4 py-3 text-left font-semibold">Salida</th>
                  <th className="px-4 py-3 text-left font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pastel-lilac/40 bg-white/60">
                {history.map((record) => (
                  <tr key={record.recordId}>
                    <td className="px-4 py-3 font-medium text-ink/80">{formatDate(record.checkIn)}</td>
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

export default AttendancePage
