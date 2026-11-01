import { useState } from 'react'
import { api } from '../api/client'

function AuthPage({ onLogin, onNavigate, adminOnly = false }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('')
    try {
      if (mode === 'register') { await api.register(form); setMode('login') }
      else { const user = await onLogin({ email: form.email, password: form.password }); onNavigate(user.role === 'admin' ? '/admin' : '/') }
    } catch (requestError) { setError(requestError.message) } finally { setSubmitting(false) }
  }

  return <div className="auth-page"><div className="auth-intro"><div className="section-kicker">Acceso al archivo</div><h1>{adminOnly ? 'Zona de gestión.' : <>Tu mirada también<br /><em>forma parte.</em></>}</h1><p>{adminOnly ? 'Inicia sesión con una cuenta administradora para continuar.' : 'Guarda tu lugar, participa en la valoración de los murales y ayuda a mantenerlo vivo.'}</p></div><form className="auth-form" onSubmit={submit}><div className="form-tabs">{!adminOnly && <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Entrar</button>}{!adminOnly && <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Crear cuenta</button>}</div>{mode === 'register' && <label>Nombre de usuario<input required minLength="3" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>}<label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Contraseña<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <div className="error-banner">{error}</div>}<button className="button button-dark button-wide" disabled={submitting}>{submitting ? 'Comprobando...' : mode === 'login' ? 'Entrar al archivo' : 'Crear mi cuenta'}</button></form></div>
}

export default AuthPage
