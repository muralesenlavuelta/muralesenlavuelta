import { useEffect, useState } from 'react'
import { api } from '../../api/client'

function AdminOverview() {
  const [stats, setStats] = useState({ murals: 0, likes: 0, located: 0, authors: 0, themes: 0, events: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.allMurals({ sort: 'popular' }), api.resource('authors'), api.resource('themes'), api.resource('events')])
      .then(([murals, authors, themes, events]) => {
        const data = murals.data || []
        setStats({
          murals: data.length,
          likes: data.reduce((total, mural) => total + Number(mural.likesCount || 0), 0),
          located: data.filter((mural) => mural.latitude != null && mural.longitude != null).length,
          authors: authors.data?.length || 0,
          themes: themes.data?.length || 0,
          events: events.data?.length || 0,
        })
      })
      .catch((requestError) => setError(requestError.message))
  }, [])

  return <section className="admin-overview">
    <div className="overview-head"><div><div className="section-kicker">Vista general</div><h2>El archivo, en números.</h2></div></div>
    {error && <div className="error-banner">{error}</div>}
    <div className="stat-grid">
      <article>
        <strong>{stats.murals}</strong>
        <span>Murales</span>
      </article>
      <article>
        <strong>{stats.likes}</strong>
        <span>Likes registrados</span>
      </article>
      <article>
        <strong>{stats.located}</strong>
        <span>Con ubicación</span>
      </article>
      <article>
        <strong>{stats.authors}</strong>
        <span>Autores</span>
      </article>
      <article>
        <strong>{stats.themes}</strong>
        <span>Temáticas</span>
      </article>
      <article>
        <strong>{stats.events}</strong>
        <span>Eventos</span>
      </article>
    </div>
  </section>
}

export default AdminOverview
