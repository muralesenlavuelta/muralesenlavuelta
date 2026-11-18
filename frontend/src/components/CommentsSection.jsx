import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { formatMuralDate } from '../utils/formatters'

function CommentsSection({ muralId, user }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { api.muralComments(muralId).then(({ data }) => setComments(data || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)) }, [muralId])

  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('')
    try { await api.createComment(muralId, content); setContent(''); setMessage('Comentario enviado. Quedará visible después de la moderación.'); } catch (requestError) { setError(requestError.message) }
  }

  return <section className="comments-section"><div className="comments-heading"><div><div className="section-kicker">Conversación</div><h2>Comentarios.</h2></div><span>{comments.length} publicados</span></div>{user ? <form className="comment-form" onSubmit={submit}><textarea required maxLength="2000" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Compartí algo sobre este mural..." /><div><small>{content.length}/2000</small><button className="button button-dark">Publicar comentario</button></div></form> : <div className="comment-login">Iniciá sesión para dejar un comentario.</div>}{error && <div className="error-banner">{error}</div>}{message && <div className="success-banner">{message}</div>}{loading ? <div className="comments-empty">Cargando comentarios...</div> : comments.length === 0 ? <div className="comments-empty">Todavía no hay comentarios publicados.</div> : <div className="comments-list">{comments.map((comment) => <article className="comment-item" key={comment.id}><div className="comment-avatar">{comment.user?.username?.slice(0, 1).toUpperCase() || '?'}</div><div><div className="comment-meta"><strong>{comment.user?.username || 'Usuario'}</strong><span>{formatMuralDate(comment.createdAt)}</span></div><p>{comment.content}</p></div></article>)}</div>}</section>
}

export default CommentsSection
