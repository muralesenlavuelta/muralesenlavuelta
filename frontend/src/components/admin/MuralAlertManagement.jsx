import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { formatMuralDate } from '../../utils/formatters'
import { getMuralAlertTypeLabel, MURAL_ALERT_STATUSES } from '../../utils/muralAlerts'

function MuralAlertManagement() {
  const [alerts, setAlerts] = useState([])
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadedStatus, setLoadedStatus] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let active = true
    api.muralAlerts(status)
      .then(({ data }) => {
        if (active) {
          setAlerts(data || [])
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setAlerts([])
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
          setLoadedStatus(status)
        }
      })

    return () => { active = false }
  }, [status])

  const updateStatus = async (alert, nextStatus) => {
    setError('')
    setUpdatingId(alert.id)

    try {
      await api.updateMuralAlertStatus(alert.id, nextStatus)
      setAlerts((current) => status === 'all'
        ? current.map((item) => item.id === alert.id ? { ...item, status: nextStatus } : item)
        : current.filter((item) => item.id !== alert.id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const isLoading = loading || loadedStatus !== status

  return (
    <section className="alert-management">
      <div className="manager-heading">
        <div><div className="section-kicker">Cuidado del patrimonio</div><h2>Problemas reportados.</h2></div>
        <select aria-label="Filtrar reportes por estado" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="pending">Pendientes</option>
          <option value="resolved">Resueltos</option>
          <option value="all">Todos</option>
        </select>
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {isLoading ? <div className="comments-empty">Cargando reportes...</div> : alerts.length === 0 ? (
        <div className="comments-empty">No hay problemas en este estado.</div>
      ) : (
        <div className="alert-list">
          {alerts.map((alert) => (
            <article className="alert-item" key={alert.id}>
              <div className="alert-item-heading">
                <div>
                  <div className="eyebrow">{getMuralAlertTypeLabel(alert.type)} · {MURAL_ALERT_STATUSES[alert.status]}</div>
                  <h3>{alert.mural?.name || alert.muralName || 'Mural'}</h3>
                  {(alert.mural?.address || alert.address) && <span className="alert-address">{alert.mural?.address || alert.address}</span>}
                  {alert.latitude != null && alert.longitude != null && (
                    <span className="alert-address"><br />Ubicación: {Number(alert.latitude).toFixed(5)}, {Number(alert.longitude).toFixed(5)}</span>
                  )}
                </div>
                <span className="alert-count">{alert.reportCount} {alert.reportCount === 1 ? 'reporte' : 'reportes'}</span>
              </div>
              <div className="alert-reports">
                {alert.reports?.map((report) => (
                  <div className="alert-report" key={report.id}>
                    <div className="comment-meta">
                      <strong>{report.user?.username || 'Usuario'}</strong>
                      <span>{formatMuralDate(report.createdAt)}</span>
                    </div>
                    {report.description && <p>{report.description}</p>}
                  </div>
                ))}
              </div>
              <div className="alert-actions">
                {alert.status === 'pending' ? (
                  <button className="button button-dark" type="button" disabled={updatingId === alert.id} onClick={() => updateStatus(alert, 'resolved')}>
                    {updatingId === alert.id ? 'Guardando...' : 'Marcar como resuelto'}
                  </button>
                ) : (
                  <button className="button button-quiet" type="button" disabled={updatingId === alert.id} onClick={() => updateStatus(alert, 'pending')}>
                    {updatingId === alert.id ? 'Guardando...' : 'Volver a pendiente'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MuralAlertManagement
