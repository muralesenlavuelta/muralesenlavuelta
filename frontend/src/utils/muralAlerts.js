export const MURAL_ALERT_TYPES = [
  { value: 'damaged', label: 'Mural dañado' },
  { value: 'missing', label: 'Mural faltante' },
  { value: 'changed', label: 'Mural cambiado' },
]

export const MURAL_ALERT_STATUSES = {
  pending: 'Pendiente',
  resolved: 'Resuelto',
}

export function getMuralAlertTypeLabel(type) {
  return MURAL_ALERT_TYPES.find((item) => item.value === type)?.label || type
}
