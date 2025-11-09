import type { ReactNode } from 'react'

type FieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
  helper?: string
  className?: string
}

export const Field = ({ label, htmlFor, children, helper, className }: FieldProps) => (
  <label className={`flex flex-col gap-2 text-sm text-ink ${className ?? ''}`} htmlFor={htmlFor}>
    <span className="font-semibold text-ink/80">{label}</span>
    {children}
    {helper && <span className="text-xs text-ink/60">{helper}</span>}
  </label>
)
