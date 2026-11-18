import './App.css'
import { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import ExplorePage from './pages/ExplorePage'
import MuralDetailPage from './pages/MuralDetailPage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/')
  const [selectedMural, setSelectedMural] = useState(null)
  const { user, login, logout, loading: authLoading } = useAuth()

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path) => {
    window.location.hash = path
  }

  const openMural = (mural) => {
    setSelectedMural(mural)
    navigate(`/murales/${mural.id}`)
  }

  const isAdmin = user?.role === 'admin'
  const isDetail = route.startsWith('/murales/')
  const isAdminRoute = route === '/admin'

  if (authLoading) return <div className="app-loading">Cargando...</div>

  return (
    <Layout user={user} isAdmin={isAdmin} onNavigate={navigate} onLogout={logout}>
      {route === '/acceso' ? (
        <AuthPage onLogin={login} onNavigate={navigate} />
      ) : isAdminRoute ? (
        isAdmin ? <AdminPage user={user} /> : <AuthPage onLogin={login} onNavigate={navigate} adminOnly />
      ) : isDetail ? (
        <MuralDetailPage
          key={route.split('/')[2]}
          muralId={route.split('/')[2]}
          initialMural={selectedMural}
          onBack={() => navigate('/')}
          onNavigate={navigate}
          user={user}
        />
      ) : (
        <ExplorePage onOpenMural={openMural} onNavigate={navigate} user={user} />
      )}
    </Layout>
  )
}

export default App
