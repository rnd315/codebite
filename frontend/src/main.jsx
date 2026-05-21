import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import App from './App'
import './index.css'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ro'],
    backend: { loadPath: '/locales/{{lng}}/translation.json' },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
)
