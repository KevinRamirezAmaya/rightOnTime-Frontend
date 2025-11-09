type MetricCardProps = {
  title: string
  value: string
  subtitle: string
  highlight?: boolean
}

export const MetricCard = ({ title, value, subtitle, highlight = false }: MetricCardProps) => (
  <article
    className={`rounded-3xl ${
      highlight ? 'bg-pastel-coral/70 text-ink' : 'bg-white/80 text-ink'
    } p-6 shadow-soft backdrop-blur`}
  >
    <p className="text-xs uppercase tracking-[0.3rem] text-ink/60">{title}</p>
    <p className="mt-4 text-3xl font-semibold text-pastel-navy">{value}</p>
    <p className="mt-2 text-xs text-ink/60">{subtitle}</p>
  </article>
)
