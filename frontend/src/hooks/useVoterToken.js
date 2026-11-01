import { useEffect, useState } from 'react'
import { api } from '../api/client'

export function useVoterToken() {
  const [voterToken, setVoterToken] = useState(() => localStorage.getItem('33grados_voter_token'))

  useEffect(() => {
    if (voterToken) return
    api.voterToken().then(({ data }) => {
      localStorage.setItem('33grados_voter_token', data.voterToken)
      setVoterToken(data.voterToken)
    }).catch(() => {})
  }, [voterToken])

  return voterToken
}
