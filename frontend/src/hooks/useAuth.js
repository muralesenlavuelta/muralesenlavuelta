import { useEffect, useState } from 'react'
import { api } from '../api/client'

export function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('33grados_user') || 'null'))
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('33grados_token')))

  useEffect(() => {
    if (!localStorage.getItem('33grados_token')) return
    api.me().then(({ data }) => setUser(data)).catch(() => {
      localStorage.removeItem('33grados_token')
      localStorage.removeItem('33grados_user')
      setUser(null)
    }).finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const { data } = await api.login(credentials)
    localStorage.setItem('33grados_token', data.token)
    localStorage.setItem('33grados_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('33grados_token')
    localStorage.removeItem('33grados_user')
    setUser(null)
    window.location.hash = '/'
  }

  return { user, login, logout, loading }
}
