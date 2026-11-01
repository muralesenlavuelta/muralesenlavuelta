import { useState } from 'react'
import AdminOverview from '../components/admin/AdminOverview'
import CatalogManager from '../components/admin/CatalogManager'
import MuralManager from '../components/admin/MuralManager'
import CommentModeration from '../components/admin/CommentModeration'
import MuralAlertManagement from '../components/admin/MuralAlertManagement'

const sections = [
  { id: 'overview', label: 'Resumen' },
  { id: 'murals', label: 'Murales' },
  { id: 'authors', label: 'Autores' },
  { id: 'themes', label: 'Temáticas' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'events', label: 'Eventos' },
  { id: 'comments', label: 'Comentarios' },
  { id: 'alerts', label: 'Reportes' },
]

function AdminPage() {
  const [section, setSection] = useState('overview')
  const renderSection = () => {
    if (section === 'overview') return <AdminOverview />
    if (section === 'murals') return <MuralManager />
    if (section === 'comments') return <CommentModeration />
    if (section === 'alerts') return <MuralAlertManagement />
    return <CatalogManager key={section} resource={section} />
  }

  return <div className="page-wrap admin-page"><div className="admin-heading"><div><div className="section-kicker">Panel privado</div><h1>Gestionar archivo.</h1></div></div><div className="admin-layout"><aside className="admin-sidebar">{sections.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>{item.label}</button>)}</aside><div className="admin-content">{renderSection()}</div></div></div>
}

export default AdminPage
