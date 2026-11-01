import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { formatMuralDate } from '../../utils/formatters'

function CommentModeration() {
  const [comments, setComments] = useState([]); const [status, setStatus] = useState('pending'); const [error, setError] = useState(''); const [loading, setLoading] = useState(true)
  const load = () => api.comments(status).then(({ data }) => setComments(data || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  useEffect(() => { api.comments(status).then(({ data }) => setComments(data || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)) }, [status])
  const moderate = async (id, moderationStatus) => { try { await api.moderateComment(id, moderationStatus); setLoading(true); load() } catch (requestError) { setError(requestError.message) } }
  const remove = async (id) => { if (!window.confirm('¿Eliminar este comentario?')) return; try { await api.removeComment(id); setComments((current) => current.filter((comment) => comment.id !== id)) } catch (requestError) { setError(requestError.message) } }

  return <section className="comment-moderation"><div className="manager-heading"><div><div className="section-kicker">Moderación</div><h2>Comentarios.</h2></div><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="pending">Pendientes</option><option value="approved">Aprobados</option><option value="rejected">Rechazados</option></select></div>{error && <div className="error-banner">{error}</div>}{loading ? <div className="comments-empty">Cargando comentarios...</div> : comments.length === 0 ? <div className="comments-empty">No hay comentarios en este estado.</div> : <div className="moderation-list">{comments.map((comment) => <article className="moderation-item" key={comment.id}><div><div className="comment-meta"><strong>{comment.user?.username || 'Usuario'}</strong><span>{formatMuralDate(comment.createdAt)} · {comment.mural?.name || 'Mural'}</span></div><p>{comment.content}</p></div><div className="moderation-actions">{status !== 'approved' && <button className="button button-dark" onClick={() => moderate(comment.id, 'approved')}>Aprobar</button>}{status !== 'rejected' && <button className="button button-danger" onClick={() => moderate(comment.id, 'rejected')}>Rechazar</button>}{status !== 'pending' && <button className="button button-quiet" onClick={() => moderate(comment.id, 'pending')}>Pendiente</button>}<button className="text-action danger" onClick={() => remove(comment.id)}>Eliminar</button></div></article>)}</div>}
  </section>
}

export default CommentModeration
