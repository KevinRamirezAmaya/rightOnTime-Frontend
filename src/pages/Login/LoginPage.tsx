import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent } from 'react'

import { Field } from '../../components/forms/Field'
import { useAppContext } from '../../context/AppContext'
import { checkIn, checkOut } from '../../services/attendance'

type AttendanceAction = 'checkin' | 'checkout' | null

const LoginPage = () => {
  const navigate = useNavigate()
  const { flashMessage } = useAppContext()
  const [documentId, setDocumentId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attendanceData, setAttendanceData] = useState<{
    action: AttendanceAction
    document: string
    time: string
  } | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDocumentId(event.target.value)
    setError(null)
  }

  const handleAttendance = async (action: 'checkin' | 'checkout') => {
    if (!documentId.trim()) {
      setError('Por favor ingresa tu número de documento')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = action === 'checkin' 
        ? await checkIn(documentId) 
        : await checkOut(documentId)

      const time = new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      setAttendanceData({
        action,
        document: documentId,
        time
      })
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setDocumentId('')
    setAttendanceData(null)
  }

  return (
    <>
      <div className="w-full max-w-xl rounded-3xl bg-white/85 p-10 shadow-soft backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-pastel-navy">Bienvenido a RightOnTime</h1>
        <p className="mt-2 text-sm text-ink/70">
          Marca tu ingreso o salida con tu número de documento.
        </p>

        {flashMessage && (
          <div className="mt-6 rounded-2xl border border-pastel-mint/60 bg-pastel-mint/40 p-4 text-sm text-ink">
            {flashMessage}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-5">
          <Field label="Número de documento" htmlFor="document-id">
            <input
              id="document-id"
              name="document_id"
              type="text"
              required
              placeholder="Ingresa tu número de documento"
              value={documentId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Field>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAttendance('checkin')}
              disabled={isLoading}
              className="flex-1 py-3 text-base bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Marcar ingreso'}
            </button>
            <button
              type="button"
              onClick={() => handleAttendance('checkout')}
              disabled={isLoading}
              className="flex-1 py-3 text-base bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Marcar salida'}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-pastel-lilac/40 p-6 text-sm text-ink/80 text-center">
          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            className="rounded-full bg-white/70 px-4 py-2 font-semibold text-pastel-navy shadow-sm transition hover:translate-y-[-1px]"
          >
            Ingreso administradores
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && attendanceData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl mx-4">
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                attendanceData.action === 'checkin' ? 'bg-pastel-mint' : 'bg-pastel-coral'
              }`}>
                <span className="text-3xl">
                  {attendanceData.action === 'checkin' ? '✓' : '→'}
                </span>
              </div>
              
              <h2 className="text-2xl font-semibold text-pastel-navy mb-2">
                {attendanceData.action === 'checkin' ? '¡Ingreso exitoso!' : '¡Salida registrada!'}
              </h2>
              
              <div className="mt-6 space-y-3 text-left bg-pastel-lilac/20 rounded-2xl p-4">
                <div className="flex justify-between">
                  <span className="text-ink/70">Documento:</span>
                  <span className="font-semibold text-pastel-navy">{attendanceData.document}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/70">Hora:</span>
                  <span className="font-semibold text-pastel-navy">{attendanceData.time}</span>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="mt-6 w-full py-3 text-base"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LoginPage
