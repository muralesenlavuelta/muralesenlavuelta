export function formatMuralDate(value) {
  if (!value) return 'Fecha no indicada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no indicada'
  return new Intl.DateTimeFormat('es-UY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
