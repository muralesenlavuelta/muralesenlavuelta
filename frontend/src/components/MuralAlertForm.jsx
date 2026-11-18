import { useState } from 'react'
import { api } from '../api/client'
import { MURAL_ALERT_TYPES } from '../utils/muralAlerts'

function MuralAlertForm({ muralId, user, onNavigate }) {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSending(true)

    try {
      const { data } = await api.createMuralAlertReport(muralId, { type, description })
      const summary = data.reportCount > 1
        ? `El problema ya estaba reportado. Se acumuló tu aviso (${data.reportCount} reportes en total).`
        : 'Gracias. El problema quedó pendiente de revisión.'
      setMessage(summary)
      setType('')
      setDescription('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mural-alert-section">
      <div className="comments-heading">
        <div>
          <div className="section-kicker">Cuidado del patrimonio</div>
          <h2>¿Hay un problema?</h2>
        </div>
      </div>
      <p className="mural-alert-intro">Ayudanos a mantener la información al día. Los reportes del mismo tipo sobre este mural se agrupan en un único caso.</p>
      {!user ? (
        <div className="comment-login">
          Iniciá sesión para reportar un problema.{' '}
          <button className="text-action" type="button" onClick={() => onNavigate('/acceso')}>Acceder</button>
        </div>
      ) : (
        <form className="mural-alert-form" onSubmit={submit}>
          <label>
            Tipo de problema
            <select required value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">Seleccioná una opción</option>
              {MURAL_ALERT_TYPES.filter((item) => item.value !== 'missing').map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            Detalles (opcional)
            <textarea maxLength="1000" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Contanos qué observaste para ayudar a los administradores..." />
          </label>
          <div className="mural-alert-submit">
            <small>{description.length}/1000</small>
            <button className="button button-dark" type="submit" disabled={sending || !type}>
              {sending ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      )}
      {error && <div className="error-banner" role="alert">{error}</div>}
      {message && <div className="success-banner" role="status">{message}</div>}
    </section>
  )
}

export default MuralAlertForm
