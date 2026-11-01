import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const FIELDS = {
  authors: ['name', 'biography', 'photo'],
  themes: ['name', 'description'],
  keywords: ['name'],
  events: ['name', 'description', 'startDate', 'endDate', 'location', 'organizer', 'additionalInfo'],
}

const LABELS = { name: 'Nombre', biography: 'Biografía', photo: 'URL de foto', description: 'Descripción', startDate: 'Inicio', endDate: 'Fin', location: 'Ubicación', organizer: 'Organizador', additionalInfo: 'Información adicional' }

function CatalogManager({ resource }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState({}); const [editing, setEditing] = useState(null); const [error, setError] = useState(''); const [message, setMessage] = useState('')
  const fields = FIELDS[resource]
  const load = () => api.resource(resource).then(({ data }) => setItems(data || [])).catch((requestError) => setError(requestError.message))
  useEffect(() => { api.resource(resource).then(({ data }) => setItems(data || [])).catch((requestError) => setError(requestError.message)) }, [resource])
  const submit = async (event) => { event.preventDefault(); setError(''); setMessage(''); try { if (editing) await api.update(resource, editing, form); else await api.create(resource, form); setMessage('Cambios guardados.'); setForm({}); setEditing(null); load() } catch (requestError) { setError(requestError.message) } }
  const remove = async (id) => { if (!window.confirm('¿Eliminar este registro?')) return; try { await api.remove(resource, id); load() } catch (requestError) { setError(requestError.message) } }
  return <section className="catalog-manager"><div className="manager-heading"><div><div className="section-kicker">Catálogo · {resource}</div><h2>Gestionar registros.</h2></div><span>{items.length} registros</span></div><form className="admin-form" onSubmit={submit}><h3>{editing ? 'Editar registro' : 'Nuevo registro'}</h3><div className="form-grid">{fields.map((field) => <label key={field}>{LABELS[field]}<input type={field.includes('Date') ? 'date' : 'text'} value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}</div>{error && <div className="error-banner">{error}</div>}{message && <div className="success-banner">{message}</div>}<div className="form-actions"><button className="button button-dark">{editing ? 'Actualizar' : 'Crear'}</button>{editing && <button type="button" className="button button-quiet" onClick={() => { setEditing(null); setForm({}) }}>Cancelar</button>}</div></form><div className="admin-list">{items.map((item) => <div className="admin-row" key={item.id}><div><strong>{item.name}</strong><small>{item.description || item.email || 'Sin descripción'}</small></div><div><button className="text-action" onClick={() => { setEditing(item.id); setForm(item) }}>Editar</button><button className="text-action danger" onClick={() => remove(item.id)}>Eliminar</button></div></div>)}</div></section>
}

export default CatalogManager
