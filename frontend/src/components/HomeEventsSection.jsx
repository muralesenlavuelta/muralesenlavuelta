import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Icon from './Icon'

function formatEventDate(value) {
  if (!value) return ''

  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getEventDateLabel(event) {
  const start = formatEventDate(event.startDate)
  const end = formatEventDate(event.endDate)

  if (start && end && event.startDate !== event.endDate) return `${start} — ${end}`
  if (start) return start
  if (end) return `Hasta el ${end}`
  return 'Fecha no indicada'
}

function HomeEventsSection({ onOpenMural }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.resource('events')
      .then(({ data }) => {
        setEvents(data || [])
        setError('')
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="home-events" aria-labelledby="events-title">
      <div className="home-section-heading">
        <div>
          <div className="section-kicker">Agenda y encuentros</div>
          <h2 id="events-title">Eventos registrados</h2>
        </div>
      </div>
      {error ? <div className="error-banner">{error}</div> : loading ? (
        <div className="home-events-empty">Cargando eventos…</div>
      ) : events.length === 0 ? (
        <div className="home-events-empty">Todavía no hay eventos registrados.</div>
      ) : (
        <div className="home-events-list">
          {events.map((event) => (
            <article className="home-event-card" key={event.id}>
              <div className="home-event-main">
                <div className="home-event-date"><Icon name="calendar" size={16} /><span>{getEventDateLabel(event)}</span></div>
                <h3>{event.name}</h3>
                {event.description && <p>{event.description}</p>}
                <div className="home-event-details">
                  {event.location && <span><Icon name="map-pin" size={15} />{event.location}</span>}
                  {event.organizer && <span><Icon name="users" size={15} />{event.organizer}</span>}
                </div>
                {event.additionalInfo && <p className="home-event-additional">{event.additionalInfo}</p>}
              </div>
              <div className="home-event-murals">
                <h4>Murales vinculados <span>{event.murals?.length || 0}</span></h4>
                {event.murals?.length ? (
                  <ul>
                    {event.murals.map((mural) => (
                      <li key={mural.id}>
                        <button type="button" onClick={() => onOpenMural(mural)}>
                          <span>{mural.name}</span><Icon name="arrow-up-right" size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : <p className="home-event-no-murals">No hay murales asociados a este evento.</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default HomeEventsSection
