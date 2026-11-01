const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const request = async (path, options = {}) => {
  const token = localStorage.getItem('33grados_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'No se pudo completar la solicitud.')
  return payload
}

const json = (method, path, body) => request(path, { method, body: JSON.stringify(body) })

const getAllMurals = async (params = {}) => {
  const firstPage = await request(`/murals?${new URLSearchParams({ ...params, page: 1, limit: 100 })}`)
  const totalPages = firstPage.pagination?.totalPages || 1
  if (totalPages === 1) return firstPage

  const remainingPages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => request(`/murals?${new URLSearchParams({ ...params, page: index + 2, limit: 100 })}`)))
  return {
    ...firstPage,
    data: [firstPage.data || [], ...remainingPages.map((page) => page.data || [])].flat(),
  }
}

export const api = {
  login: (body) => json('POST', '/auth/login', body),
  register: (body) => json('POST', '/auth/register', body),
  me: () => request('/auth/me'),
  murals: (params = {}) => request(`/murals?${new URLSearchParams(params)}`),
  allMurals: getAllMurals,
  mural: (id) => request(`/murals/${id}`),
  likes: (id, voterToken) => request(`/murals/${id}/likes${voterToken ? `?voterToken=${voterToken}` : ''}`),
  like: (id, voterToken) => json('POST', `/murals/${id}/like`, { voterToken }),
  unlike: (id, voterToken) => json('DELETE', `/murals/${id}/like`, { voterToken }),
  voterToken: () => request('/voter-token'),
  resource: (name) => request(`/${name}`),
  create: (name, body) => json('POST', `/${name}`, body),
  update: (name, id, body) => json('PUT', `/${name}/${id}`, body),
  remove: (name, id) => request(`/${name}/${id}`, { method: 'DELETE' }),
  createMural: (body) => json('POST', '/murals', body),
  updateMural: (id, body) => json('PUT', `/murals/${id}`, body),
  removeMural: (id) => request(`/murals/${id}`, { method: 'DELETE' }),
  muralImages: (id) => request(`/murals/${id}/images`),
  createMuralImage: (id, body) => json('POST', `/murals/${id}/images`, body),
  removeMuralImage: (muralId, imageId) => request(`/murals/${muralId}/images/${imageId}`, { method: 'DELETE' }),
  updateMuralAuthors: (id, authorIds) => json('PUT', `/murals/${id}/authors`, { authorIds }),
  updateMuralThemes: (id, themeIds) => json('PUT', `/murals/${id}/themes`, { themeIds }),
  updateMuralKeywords: (id, keywordIds) => json('PUT', `/murals/${id}/keywords`, { keywordIds }),
  muralComments: (muralId) => request(`/comments/mural/${muralId}`),
  createComment: (muralId, content) => json('POST', `/comments/mural/${muralId}`, { content }),
  updateComment: (id, content) => json('PUT', `/comments/${id}`, { content }),
  removeComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),
  comments: (status = '') => request(`/comments${status ? `?status=${status}` : ''}`),
  moderateComment: (id, moderationStatus) => json('PATCH', `/comments/${id}/moderation`, { moderationStatus }),
  createMuralAlertReport: (muralId, body) => json('POST', `/alerts/murals/${muralId}`, body),
  createMissingMuralReport: (body) => json('POST', '/alerts/missing-murals', body),
  muralAlerts: (status = 'pending') => request(`/alerts?${new URLSearchParams({ status })}`),
  updateMuralAlertStatus: (id, status) => json('PATCH', `/alerts/${id}/status`, { status }),
}
