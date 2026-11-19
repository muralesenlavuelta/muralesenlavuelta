import { useState } from 'react'
import { api } from '../api/client'

function AuthPage({ onLogin, onNavigate, adminOnly = false }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (mode === 'register' && form.password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'register') {
        await api.register({ username: form.username, email: form.email, password: form.password })
        setMode('login')
        setConfirmPassword('')
        setShowPassword(false)
      } else {
        const user = await onLogin({ email: form.email, password: form.password })
        onNavigate(user.role === 'admin' ? '/admin' : '/')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="section-kicker">Acceso al archivo</div>
        <h1>{adminOnly ? 'Zona de gestión.' : <>Tu mirada también<br /><em>forma parte.</em></>}</h1>
        <p>{adminOnly ? 'Inicia sesión con una cuenta administradora para continuar.' : 'Guarda tu lugar, participa en la valoración de los murales y ayuda a mantenerlo vivo.'}</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <div className="form-tabs">
          {!adminOnly && <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Entrar</button>}
          {!adminOnly && <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Crear cuenta</button>}
        </div>
        {mode === 'register' && (
          <label>
            Nombre de usuario
            <input required minLength="3" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </label>
        )}
        <label>
          Email
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Contraseña
          <span className="password-input-wrap">
            <input
              required
              type={mode === 'login' && showPassword ? 'text' : 'password'}
              minLength="6"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            {mode === 'login' && (
              <button
                type="button"
                className="password-visibility-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            )}
          </span>
        </label>
        {mode === 'register' && (
          <label>
            Repetir contraseña
            <input
              required
              type="password"
              minLength="6"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
        )}
        {error && <div className="error-banner">{error}</div>}
        <button className="button button-dark button-wide" disabled={submitting}>
          {submitting ? 'Comprobando...' : mode === 'login' ? 'Entrar al archivo' : 'Crear mi cuenta'}
        </button>
      </form>
    </div>
  )
}

export default AuthPage
