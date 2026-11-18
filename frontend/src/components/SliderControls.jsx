import Icon from './Icon'
import './SliderControls.css'

function SliderControls({ activeIndex, total, onChange, isPaused, onTogglePause, className = '' }) {
  if (total < 2) return null

  return (
    <div className={`slider-controls ${className}`} role="group" aria-label="Controles de la galería" onClick={(event) => event.stopPropagation()}>
      <button className="slider-arrow slider-prev" type="button" onClick={() => onChange(-1)} aria-label="Imagen anterior">
        <Icon name="chevron-left" size={20} />
      </button>
      <div className="slider-status" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="slider-status-divider">/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>
      {onTogglePause && (
        <button className="slider-pause" type="button" onClick={onTogglePause}>
          {isPaused ? 'Reanudar' : 'Pausar'}
        </button>
      )}
      <button className="slider-arrow slider-next" type="button" onClick={() => onChange(1)} aria-label="Imagen siguiente">
        <Icon name="chevron-right" size={20} />
      </button>
    </div>
  )
}

export default SliderControls
