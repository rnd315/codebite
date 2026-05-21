import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useStore from './store/useStore'
import client from './api/client'
import Layout from './components/layout/Layout'
import PageTransition from './components/ui/PageTransition'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Pathway from './pages/Pathway'
import ModuleView from './pages/ModuleView'
import Lesson from './pages/Lesson'
import Community from './pages/Community'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const token = useStore((s) => s.token)
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  const theme = useStore((s) => s.theme)
  const lang = useStore((s) => s.lang)
  const checkTokenRegen = useStore((s) => s.checkTokenRegen)
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const syncFromUser = useStore((s) => s.syncFromUser)
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang)
  }, [lang, i18n])

  useEffect(() => {
    checkTokenRegen()
  }, [checkTokenRegen])

  // Re-hydrate user state from the server after a page refresh.
  // token survives in localStorage; user/lives/streak/xp do not.
  useEffect(() => {
    if (token && !user) {
      client.get('/auth/me')
        .then((res) => {
          setUser(res.data)
          syncFromUser(res.data)
        })
        .catch(() => {})
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PageTransition><Home /></PageTransition>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <PageTransition><Onboarding /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/pathway" element={
          <ProtectedRoute>
            <Layout><PageTransition><Pathway /></PageTransition></Layout>
          </ProtectedRoute>
        } />
        <Route path="/module/:moduleSlug" element={
          <ProtectedRoute>
            <Layout><PageTransition><ModuleView /></PageTransition></Layout>
          </ProtectedRoute>
        } />
        <Route path="/lesson/:slug" element={
          <ProtectedRoute>
            <Layout><PageTransition><Lesson /></PageTransition></Layout>
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Layout><PageTransition><Community /></PageTransition></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><PageTransition><Profile /></PageTransition></Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
