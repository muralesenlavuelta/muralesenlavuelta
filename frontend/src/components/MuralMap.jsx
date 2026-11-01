import { useEffect } from 'react'
import { MapContainer, CircleMarker, Popup, TileLayer, useMap } from 'react-leaflet'
import Icon from './Icon'
import 'leaflet/dist/leaflet.css'

const MERCEDES_CENTER = [-33.2527, -58.032]

function FitMapToMurals({ murals }) {
  const map = useMap()

  useEffect(() => {
    if (murals.length > 0) {
      const bounds = murals.map((mural) => [Number(mural.latitude), Number(mural.longitude)])
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 })
    } else map.setView(MERCEDES_CENTER, 13)
  }, [map, murals])

  return null
}

function MuralMap({ murals, onOpenMural }) {
  const locatedMurals = murals.filter((mural) => Number.isFinite(Number(mural.latitude)) && Number.isFinite(Number(mural.longitude)))

  return <section className="map-section">
    <div className="map-heading"><div><div className="section-kicker">Mercedes · Soriano</div><h2>Mapa interactivo de los murales</h2></div><span>{locatedMurals.length} murales ubicados</span></div>
    <div className="map-frame">
      <MapContainer center={MERCEDES_CENTER} zoom={13} scrollWheelZoom className="mural-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitMapToMurals murals={locatedMurals} />
        {locatedMurals.map((mural) => <CircleMarker key={mural.id} center={[Number(mural.latitude), Number(mural.longitude)]} radius={9} pathOptions={{ color: '#f7f8f6', weight: 3, fillColor: '#2f5d50', fillOpacity: 1 }}>
          <Popup><div className="map-popup"><strong>{mural.name}</strong><span>{mural.address || 'Ubicación registrada en Mercedes'}</span><small><Icon name="heart" size={14} /> {mural.likesCount ?? 0} likes</small><button onClick={() => onOpenMural(mural)}>Ver detalles del mural <Icon name="arrow-right" size={15} /></button></div></Popup>
        </CircleMarker>)}
      </MapContainer>
      {locatedMurals.length === 0 && <div className="map-empty">Los murales todavía no tienen coordenadas registradas.</div>}
    </div>
  </section>
}

export default MuralMap
