import type { ReactNode } from 'react'

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col px-4 py-10 md:px-10">
      <main className="flex flex-1 items-start justify-center">{children}</main>
      <footer className="mt-12 text-center text-sm text-ink/70">
        RightOnTime · Gestión de asistencia · {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default AppLayout
