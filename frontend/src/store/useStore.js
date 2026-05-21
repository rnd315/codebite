import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () =>
        set({ user: null, token: null, lives: 5, streak: 0, xp: 0, badges: [] }),

      // Gamification state — synced from backend on login/progress
      lives: 5,
      streak: 0,
      xp: 0,
      lastTokenLossAt: null,
      setLives: (lives) => set({ lives }),
      setStreak: (streak) => set({ streak }),
      setXp: (xp) => set({ xp }),
      syncFromUser: (user) =>
        set({
          lives: user.lives,
          streak: user.streak,
          xp: user.xp,
          lastTokenLossAt: user.last_token_loss_at ?? null,
        }),
      checkTokenRegen: () =>
        set((s) => {
          if (s.lives >= 5 || !s.lastTokenLossAt) return {}
          const elapsedSec = (Date.now() - new Date(s.lastTokenLossAt).getTime()) / 1000
          const earned = Math.floor(elapsedSec / (4 * 3600))
          if (earned <= 0) return {}
          return { lives: Math.min(s.lives + earned, 5) }
        }),

      // Badges — persisted, unlocked client-side
      badges: [],
      unlockBadge: (id) =>
        set((s) => s.badges.includes(id) ? {} : { badges: [...s.badges, id] }),

      // Preferences — persisted to localStorage
      theme: 'dark',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      codeLang: 'cpp',
      setCodeLang: (codeLang) => set({ codeLang }),

      lang: 'ro',
      setLang: (lang) => set({ lang }),

      // Personalization — persisted
      learningProtocol: 'architect',
      isOnboarded: false,
      showProtocolModal: false,
      setLearningProtocol: (learningProtocol) => set({ learningProtocol }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
      setShowProtocolModal: (showProtocolModal) => set({ showProtocolModal }),
    }),
    {
      name: 'codebite-store',
      partialize: (s) => ({
        token: s.token,
        theme: s.theme,
        codeLang: s.codeLang,
        lang: s.lang,
        learningProtocol: s.learningProtocol,
        isOnboarded: s.isOnboarded,
        badges: s.badges,
      }),
    }
  )
)

export default useStore
