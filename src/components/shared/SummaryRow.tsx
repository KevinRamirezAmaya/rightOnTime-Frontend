type SummaryRowProps = {
  label: string
  value: string
}

export const SummaryRow = ({ label, value }: SummaryRowProps) => (
  <div className="flex items-center justify-between rounded-2xl bg-pastel-lilac/40 px-4 py-3">
    <span className="text-xs uppercase tracking-[0.2rem] text-ink/60">{label}</span>
    <span className="text-base font-semibold text-ink/80">{value}</span>
  </div>
)
