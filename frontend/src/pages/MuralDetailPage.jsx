import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useVoterToken } from '../hooks/useVoterToken'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import { formatMuralDate } from '../utils/formatters'
import CommentsSection from '../components/CommentsSection'
import MuralAlertForm from '../components/MuralAlertForm'
import SliderControls from '../components/SliderControls'
import Icon from '../components/Icon'

function MuralDetailPage({ muralId, initialMural, onBack, onNavigate, user }) {
  const [mural, setMural] = useState(initialMural)
  const [likeState, setLikeState] = useState({ likesCount: initialMural?.likesCount || 0, hasLiked: false })
  const [error, setError] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const voterToken = useVoterToken()
  const changeImage = (direction) => {
    setActiveImageIndex((index) => (index + direction + images.length) % images.length)
  }
  const detailSwipeHandlers = useSwipeNavigation(changeDirection => changeImage(changeDirection))
  const lightboxSwipeHandlers = useSwipeNavigation(changeDirection => changeImage(changeDirection))

  useEffect(() => { api.mural(muralId).then(({ data }) => setMural(data)).catch((requestError) => setError(requestError.message)) }, [muralId])
  useEffect(() => { if (voterToken) api.likes(muralId, voterToken).then(({ data }) => setLikeState(data)).catch(() => {}) }, [muralId, voterToken])

  const images = [...(mural?.images || [])].sort((first, second) => Number(second.isPrimary) - Number(first.isPrimary))
  const activeImage = images[activeImageIndex]

  useEffect(() => {
    if (!isImageExpanded) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageExpanded(false)
      if (event.key === 'ArrowLeft') setActiveImageIndex((index) => (index - 1 + images.length) % images.length)
      if (event.key === 'ArrowRight') setActiveImageIndex((index) => (index + 1) % images.length)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isImageExpanded, images.length])

  const toggleLike = async () => {
    if (!voterToken) return
    const response = likeState.hasLiked ? await api.unlike(muralId, voterToken) : await api.like(muralId, voterToken)
    setLikeState({ ...likeState, ...response.data, hasLiked: !likeState.hasLiked })
  }

  if (error) return <div className="page-wrap"><button className="back-link" onClick={onBack}><Icon name="arrow-left" size={17} /> Volver al inicio</button><div className="error-banner">{error}</div></div>
  if (!mural) return <div className="empty-state">Cargando mural...</div>

  return (
    <div className="page-wrap detail-page">
      <button className="back-link" onClick={onBack}><Icon name="arrow-left" size={17} /> Volver al inicio</button>
      <div className="detail-grid">
        <div className="detail-image">
          {activeImage?.url ? (
            <>
              <button
                className="detail-image-expand"
                type="button"
                {...detailSwipeHandlers}
                onClick={() => setIsImageExpanded(true)}
                aria-label={`Ampliar imagen ${activeImageIndex + 1} de ${images.length}`}
              >
                <img src={activeImage.url} alt={activeImage.caption || mural.name} />
                <span className="detail-image-zoom-label">Ampliar imagen</span>
              </button>
              {images.length > 1 && (
                <SliderControls activeIndex={activeImageIndex} total={images.length} onChange={changeImage} />
              )}
              {activeImage.caption && <div className="detail-image-caption">{activeImage.caption}</div>}
            </>
          ) : <span>{mural.name.slice(0, 1)}</span>}
        </div>
        <div className="detail-copy">
          <div className="section-kicker">Ficha de patrimonio · {formatMuralDate(mural.createdAt)}</div>
          <h1>{mural.name}</h1>
          <p className="detail-description">{mural.description || 'Este mural todavía no tiene una descripción.'}</p>
          <button className={`like-button ${likeState.hasLiked ? 'liked' : ''}`} onClick={toggleLike}><Icon name="heart" size={18} /><strong>{likeState.likesCount}</strong> {likeState.hasLiked ? 'Me gusta registrado' : 'Me gusta este mural'}</button>
          <dl className="facts">
            <div><dt>Fecha de registro</dt><dd>{formatMuralDate(mural.createdAt)}</dd></div>
            <div><dt>Dirección</dt><dd>{mural.address || 'No indicada'}</dd></div>
            <div><dt>Autoría</dt><dd>{mural.authors?.map((author) => author.name).join(', ') || 'Autoría colectiva'}</dd></div>
            <div><dt>Temáticas</dt><dd>{mural.themes?.map((theme) => theme.name).join(' · ') || 'Sin clasificar'}</dd></div>
            <div><dt>Historia</dt><dd>{mural.historicalInfo || 'No hay información histórica cargada.'}</dd></div>
          </dl>
        </div>
      </div>
      <MuralAlertForm muralId={muralId} user={user} onNavigate={onNavigate} />
      <CommentsSection muralId={muralId} user={user} />
      {isImageExpanded && activeImage?.url && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${mural.name}`} onClick={() => setIsImageExpanded(false)}>
          <button className="image-lightbox-close" type="button" onClick={() => setIsImageExpanded(false)} aria-label="Cerrar imagen ampliada"><Icon name="close" /></button>
          {images.length > 1 && <SliderControls className="slider-controls-lightbox" activeIndex={activeImageIndex} total={images.length} onChange={changeImage} />}
          <img className="image-lightbox-content" {...lightboxSwipeHandlers} src={activeImage.url} alt={activeImage.caption || mural.name} onClick={(event) => event.stopPropagation()} />
          {activeImage.caption && <div className="image-lightbox-caption">{activeImage.caption}</div>}
        </div>
      )}
    </div>
  )
}

export default MuralDetailPage
