import { useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { api } from '../api/client'

const MERCEDES_CENTER = [-33.2527, -58.032]

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })

  return null
}

function MissingMuralReportForm({ user, onNavigate }) {
  const [muralName, setMuralName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSending(true)

    try {
      await api.createMissingMuralReport({
        muralName,
        address,
        latitude: location?.latitude,
        longitude: location?.longitude,
        description,
      })
      setMessage('Gracias. El mural faltante quedó pendiente de revisión por el equipo.')
      setMuralName('')
      setAddress('')
      setDescription('')
      setLocation(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="missing-mural-section">
      <div className="comments-heading">
        <div>
          <div className="section-kicker">Ampliar el catálogo</div>
          <h2>¿Falta un mural?</h2>
        </div>
      </div>
      <p className="mural-alert-intro">Este formulario es para murales que todavía no aparecen. Indicá dónde está o marcá el punto en el mapa.</p>
      {!user ? (
        <div className="comment-login">
          Iniciá sesión para informar un mural faltante.{' '}
          <button className="text-action" type="button" onClick={() => onNavigate('/acceso')}>Acceder</button>
        </div>
      ) : (
        <form className="missing-mural-form" onSubmit={submit}>
          <label>
            Nombre o referencia del mural
            <input required maxLength="150" value={muralName} onChange={(event) => setMuralName(event.target.value)} placeholder="Por ejemplo: mural de la plaza del barrio" />
          </label>
          <label>
            Dirección o referencia de ubicación
            <input required={!location} maxLength="255" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Calle, barrio, localidad..." />
          </label>
          <div className="missing-mural-map-label">
            <strong>Ubicación en el mapa (opcional)</strong>
            <span>Hacé clic para marcar el lugar. Podés mover y acercar el mapa para elegir cualquier ubicación.</span>
          </div>
          <div className="missing-mural-map">
            <MapContainer center={MERCEDES_CENTER} zoom={13} scrollWheelZoom className="mural-map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onSelect={setLocation} />
              {location && (
                <CircleMarker
                  center={[location.latitude, location.longitude]}
                  radius={9}
                  pathOptions={{ color: '#f7f8f6', weight: 3, fillColor: '#b83f2c', fillOpacity: 1 }}
                />
              )}
            </MapContainer>
          </div>
          {location && (
            <div className="missing-mural-location">
              <span>Coordenadas: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</span>
              <button className="text-action" type="button" onClick={() => setLocation(null)}>Quitar ubicación del mapa</button>
            </div>
          )}
          <label>
            Detalles adicionales (opcional)
            <textarea maxLength="1000" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Contanos cómo reconocer el mural o cualquier otro detalle útil..." />
          </label>
          <div className="mural-alert-submit">
            <small>{description.length}/1000</small>
            <button className="button button-dark" type="submit" disabled={sending || (!address.trim() && !location)}>
              {sending ? 'Enviando...' : 'Enviar mural faltante'}
            </button>
          </div>
        </form>
      )}
      {error && <div className="error-banner" role="alert">{error}</div>}
      {message && <div className="success-banner" role="status">{message}</div>}
    </section>
  )
}

export default MissingMuralReportForm
