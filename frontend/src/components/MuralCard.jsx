import { formatMuralDate } from '../utils/formatters'
import Icon from './Icon'

function MuralCard({ mural, onOpen, featured = false }) {
  const image = mural.images?.find((item) => item.isPrimary) || mural.images?.[0]
  const authors = mural.authors?.map((author) => author.name).join(', ')

  return (
    <article className={`mural-card ${featured ? 'mural-card-featured' : ''}`}>
      <button className="mural-image" onClick={() => onOpen(mural)} aria-label={`Ver ${mural.name}`}>
        {image?.url ? <img src={image.url} alt={image.caption || mural.name} /> : <span className="image-placeholder">{mural.name?.slice(0, 1)}</span>}
        <span className="image-label">{formatMuralDate(mural.createdAt)}</span>
      </button>
      <div className="mural-card-body">
        <div className="eyebrow">{mural.address || 'Ubicación no indicada'}</div>
        <h3><button onClick={() => onOpen(mural)}>{mural.name}</button></h3>
        <p>{mural.description || 'Este mural todavía no tiene una descripción.'}</p>
        <div className="mural-meta"><span>{authors || 'Autor desconocido'}</span><span className="likes" aria-label={`${mural.likesCount ?? 0} me gusta`}><Icon name="heart" size={15} /> {mural.likesCount ?? 0}</span></div>
      </div>
    </article>
  )
}

export default MuralCard
