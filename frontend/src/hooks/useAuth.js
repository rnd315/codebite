import { useState } from 'react'
import client from '../api/client'
import useStore from '../store/useStore'

export default function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setUser, setToken, syncFromUser, logout: storeLogout } = useStore()

  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/login', { email, password })
      setToken(data.access_token)
      setUser(data.user)
      syncFromUser(data.user)
      return { ok: true }
    } catch (err) {
      // Show the server's detail message if available, otherwise fall back to i18n key
      setError(err.response?.data?.detail ?? 'errorLogin')
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ username, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/register', { username, email, password })
      setToken(data.access_token)
      setUser(data.user)
      syncFromUser(data.user)
      return { ok: true }
    } catch (err) {
      setError(err.response?.data?.detail ?? 'errorRegister')
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  const fetchMe = async () => {
    try {
      const { data } = await client.get('/auth/me')
      setUser(data)
      syncFromUser(data)
    } catch {
      storeLogout()
    }
  }

  const logout = () => storeLogout()

  return { login, register, logout, fetchMe, loading, error }
}
