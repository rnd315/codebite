import axios from 'axios'
import useStore from '../store/useStore'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
client.interceptors.request.use((config) => {
  const token = useStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear auth state and redirect to home
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().logout()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default client
