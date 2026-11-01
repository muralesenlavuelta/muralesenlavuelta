import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import MuralCard from '../components/MuralCard'
import HomeEventsSection from '../components/HomeEventsSection'
import SliderControls from '../components/SliderControls'
import Icon from '../components/Icon'
import MuralMap from '../components/MuralMap'
import MissingMuralReportForm from '../components/MissingMuralReportForm'
import './HomePage.css'

function ExplorePage({ onOpenMural, onNavigate, user }) {
  const [murals, setMurals] = useState([])
  const [featuredMurals, setFeaturedMurals] = useState([])
  const [featuredError, setFeaturedError] = useState('')
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0)
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false)
  const [mapMurals, setMapMurals] = useState([])
  const [filters, setFilters] = useState({ search: '', year: '', sort: 'newest', page: 1, limit: 9 })
  const [pagination, setPagination] = useState({})
  const [catalogs, setCatalogs] = useState({ authors: [], themes: [], keywords: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const featuredSwipeHandlers = useSwipeNavigation((direction) => {
    setActiveFeaturedIndex((current) => (current + direction + featuredMurals.length) % featuredMurals.length)
  })

  useEffect(() => {
    Promise.all(['authors', 'themes', 'keywords'].map((name) => api.resource(name)))
      .then((responses) => setCatalogs(Object.fromEntries(responses.map((response, index) => [['authors', 'themes', 'keywords'][index], response.data || []]))))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const query = Object.fromEntries(Object.entries(filters).filter(([name, value]) => name !== 'search' && value !== ''))
    if (filters.search.trim()) {
      query.page = 1
      query.limit = 100
    }
    const request = filters.search.trim() ? api.allMurals(query) : api.murals(query)
    request.then((response) => {
      setMurals(response.data || [])
      setPagination(response.pagination || {})
      setError('')
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    api.allMurals({ sort: 'newest' }).then((response) => setMapMurals(response.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    api.murals({ sort: 'popular', limit: 3 })
      .then((response) => {
        setFeaturedMurals(response.data || [])
        setActiveFeaturedIndex(0)
        setFeaturedError('')
      })
      .catch((requestError) => setFeaturedError(requestError.message))
  }, [])

  useEffect(() => {
    if (isFeaturedPaused || featuredMurals.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const intervalId = window.setInterval(() => {
      setActiveFeaturedIndex((current) => (current + 1) % featuredMurals.length)
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [featuredMurals.length, isFeaturedPaused])

  const changeFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value, page: name === 'page' ? value : 1 }))
  const searchTerm = filters.search.trim().toLocaleLowerCase()
  const filteredMurals = searchTerm
    ? murals.filter((mural) => [mural.name, mural.description, mural.address, mural.historicalInfo].filter(Boolean).some((field) => field.toLocaleLowerCase().includes(searchTerm)))
    : murals
  const orderedMurals = filters.sort === 'alphabetical'
    ? [...filteredMurals].sort((first, second) => (first.name || '').localeCompare(second.name || '', 'es'))
    : filteredMurals
  const visibleMurals = searchTerm ? orderedMurals.slice((filters.page - 1) * filters.limit, filters.page * filters.limit) : orderedMurals
  const visiblePagination = searchTerm
    ? { page: filters.page, totalItems: orderedMurals.length, totalPages: Math.ceil(orderedMurals.length / filters.limit), hasPreviousPage: filters.page > 1, hasNextPage: filters.page < Math.ceil(orderedMurals.length / filters.limit) }
    : pagination
  const featured = featuredMurals
  const heroMural = featured[activeFeaturedIndex]
  const heroImage = heroMural?.images?.find((image) => image.isPrimary) || heroMural?.images?.[0]
  const muralCount = pagination.totalItems ?? 0
  const authorCount = catalogs.authors.length
  const themeCount = catalogs.themes.length

  return <div className="page-wrap home-page">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-copy">
        <div className="section-kicker">Mercedes · Soriano · Uruguay</div>
        <h1 id="home-title">La ciudad también se cuenta <em>en sus paredes.</em></h1>
        <p>Recorré los murales de Mercedes, conocé las historias que guardan y a quienes dan vida a nuestros espacios públicos.</p>
        <div className="home-actions">
          <button className="button button-dark" onClick={() => document.getElementById('archivo')?.scrollIntoView({ behavior: 'smooth' })}>Recorrer murales <Icon name="arrow-down-right" size={17} /></button>
          <button className="home-text-action" onClick={() => document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })}>Ver el mapa <Icon name="arrow-up-right" size={17} /></button>
        </div>
      </div>
      <div className="home-artwork">
        {heroMural ? <>
          <button className="home-artwork-link" {...featuredSwipeHandlers} onClick={() => onOpenMural(heroMural)} aria-label={`Ver el mural ${heroMural.name}`}>
            {heroImage?.url ? <img key={heroImage.url} src={heroImage.url} alt={heroImage.caption || heroMural.name} /> : <span className="home-artwork-placeholder"><span>{heroMural.name?.slice(0, 1)}</span></span>}
            <span className="artwork-caption"><span>Entre los más valorados</span><strong>{heroMural.name}</strong><small>{heroMural.address || 'Mercedes, Soriano'}</small></span>
          </button>
          <SliderControls
            activeIndex={activeFeaturedIndex}
            total={featured.length}
            onChange={(direction) => setActiveFeaturedIndex((current) => (current + direction + featured.length) % featured.length)}
            isPaused={isFeaturedPaused}
            onTogglePause={() => setIsFeaturedPaused((paused) => !paused)}
          />
        </> : <div className="home-artwork-placeholder">
          <small>{featuredError ? 'No se pudieron cargar los murales destacados.' : 'MURALES DESTACADOS'}</small>
          <span>33°</span>
        </div>}
      </div>
    </section>

    <section className="home-stats" aria-label="El archivo en cifras">
      <article><strong>{String(muralCount).padStart(2, '0')}</strong><span>Murales registrados</span></article>
      <article><strong>{String(authorCount).padStart(2, '0')}</strong><span>Artistas y colectivos</span></article>
      <article><strong>{String(themeCount).padStart(2, '0')}</strong><span>Temáticas</span></article>
    </section>

    <section className="home-featured" aria-labelledby="featured-title">
      <div className="home-section-heading">
        <div><div className="section-kicker">Favoritos de la comunidad</div><h2 id="featured-title">Los más valorados</h2></div>
        <button className="home-text-action" onClick={() => document.getElementById('archivo')?.scrollIntoView({ behavior: 'smooth' })}>Ver todos los murales <Icon name="arrow-down-right" size={17} /></button>
      </div>
      {featured.length > 0 ? <div className="mural-grid home-featured-grid">{featured.map((mural) => <MuralCard key={mural.id} mural={mural} onOpen={onOpenMural} />)}</div> : <div className="home-featured-empty">{featuredError || (loading ? 'Cargando los murales más valorados…' : 'Pronto vas a encontrar aquí nuevas historias del territorio.')}</div>}
    </section>

    <HomeEventsSection onOpenMural={onOpenMural} />

    <section className="festival-band" aria-labelledby="festival-title">
      <div className="festival-copy"><div className="section-kicker">Una celebración en movimiento</div><h2 id="festival-title">Sobre el festival</h2><p>El Festival 33 Grados es un encuentro internacional de arte urbano que se realiza en Mercedes, Soriano, y convierte distintos espacios de la ciudad en una galería a cielo abierto. Reúne a muralistas y artistas nacionales e internacionales, y promueve el encuentro entre el arte, la comunidad y el espacio público. También hay talleres, intervenciones y otras actividades culturales.</p></div>
      <div className="festival-links" aria-label="Descubrí el archivo"><button onClick={() => document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })}><span>01</span><strong>Recorré el mapa</strong><Icon name="arrow-up-right" size={17} /></button><button onClick={() => document.getElementById('archivo')?.scrollIntoView({ behavior: 'smooth' })}><span>02</span><strong>Explorá las temáticas</strong><Icon name="arrow-down-right" size={17} /></button><button onClick={() => document.getElementById('archivo')?.scrollIntoView({ behavior: 'smooth' })}><span>03</span><strong>Conocé las historias</strong><Icon name="arrow-down-right" size={17} /></button></div>
    </section>

    <section className="home-archive" id="archivo" aria-labelledby="archive-title">
      <div className="home-section-heading archive-heading"><div><div className="section-kicker">Encontrá tu próximo recorrido</div><h2 id="archive-title">Explorá todos los murales</h2></div><span>{visiblePagination.totalItems ?? 0} resultados</span></div>
      <div className="search-panel">
        <label className="search-field"><Icon name="search" className="icon" size={18} /><input value={filters.search} onChange={(event) => changeFilter('search', event.target.value)} placeholder="Nombre, dirección o historia" /></label>
        <label><span>Año</span><input value={filters.year} onChange={(event) => changeFilter('year', event.target.value)} placeholder="Todos" inputMode="numeric" /></label>
        <label><span>Ordenar</span><select value={filters.sort} onChange={(event) => changeFilter('sort', event.target.value)}><option value="newest">Más recientes</option><option value="oldest">Más antiguos</option><option value="popular">Más valorados</option><option value="alphabetical">Alfabético</option></select></label>
      </div>
      <div className="catalog-strip"><span>Temáticas</span>{catalogs.themes.slice(0, 5).map((theme) => <button key={theme.id} onClick={() => changeFilter('themeId', theme.id)}>{theme.name}</button>)}{catalogs.authors.length > 0 && <span className="catalog-muted">{catalogs.authors.length} artistas · {catalogs.keywords.length} palabras clave · {catalogs.events.length} eventos</span>}</div>
      {error && <div className="error-banner">{error}</div>}
      {loading ? <div className="empty-state">Consultando el archivo...</div> : visibleMurals.length === 0 ? <div className="empty-state"><strong>No encontramos murales con esos filtros.</strong><span>Probá con otra búsqueda o limpiá los campos.</span></div> : <div className="mural-grid">{visibleMurals.map((mural) => <MuralCard key={mural.id} mural={mural} onOpen={onOpenMural} />)}</div>}
      {visiblePagination.totalPages > 1 && <div className="pagination"><button disabled={!visiblePagination.hasPreviousPage} onClick={() => changeFilter('page', filters.page - 1)}><Icon name="arrow-left" size={17} /> Anterior</button><span>Página {visiblePagination.page} de {visiblePagination.totalPages}</span><button disabled={!visiblePagination.hasNextPage} onClick={() => changeFilter('page', filters.page + 1)}>Siguiente <Icon name="arrow-right" size={17} /></button></div>}
    </section>
    <div id="mapa"><MuralMap murals={mapMurals} onOpenMural={onOpenMural} /></div>
    <MissingMuralReportForm user={user} onNavigate={onNavigate} />
  </div>
}

export default ExplorePage
