import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Returns today's date as "YYYY-MM-DD" in local time
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function yesterdayStr() {
  const d = new Date(Date.now() - 86_400_000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const useStore = create(
  persist(
    (set) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () =>
        set({ user: null, token: null, lives: 5, streak: 0, xp: 0, badges: [], lastActiveDate: null }),

      // Gamification — lives/streak synced from backend; xp persisted locally (accumulates)
      lives: 5,
      streak: 0,
      xp: 0,
      lastTokenLossAt: null,
      // lastActiveDate tracks the last calendar day the user completed at least one lesson
      lastActiveDate: null,

      setLives: (lives) => set({ lives }),
      setStreak: (streak) => set({ streak }),
      setXp: (xp) => set({ xp }),
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      // Sync from backend — use Math.max for xp so local curriculum gains are not lost
      syncFromUser: (user) =>
        set((s) => ({
          lives: user.lives,
          streak: user.streak,
          xp: Math.max(s.xp, user.xp),
          lastTokenLossAt: user.last_token_loss_at ?? null,
        })),

      checkTokenRegen: () =>
        set((s) => {
          if (s.lives >= 5 || !s.lastTokenLossAt) return {}
          const elapsedSec = (Date.now() - new Date(s.lastTokenLossAt).getTime()) / 1000
          const earned = Math.floor(elapsedSec / (4 * 3600))
          if (earned <= 0) return {}
          return { lives: Math.min(s.lives + earned, 5) }
        }),

      // Daily streak: increments by 1 only on the first lesson completed each calendar day.
      // Resets to 1 if more than one day has been missed.
      checkAndUpdateDailyStreak: () =>
        set((s) => {
          const today = todayStr()
          if (s.lastActiveDate === today) return {}   // already counted today
          const yesterday = yesterdayStr()
          const newStreak = s.lastActiveDate === yesterday ? s.streak + 1 : 1
          return { streak: newStreak, lastActiveDate: today }
        }),

      // Badges — persisted, unlocked client-side
      badges: [],
      unlockBadge: (id) =>
        set((s) => s.badges.includes(id) ? {} : { badges: [...s.badges, id] }),

      // Preferences — persisted
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

      // Curriculum lesson completion (file-based, no DB ID) — persisted
      completedCurriculumLessons: [],
      addCompletedCurriculumLesson: (id) =>
        set((s) =>
          s.completedCurriculumLessons.includes(id)
            ? {}
            : { completedCurriculumLessons: [...s.completedCurriculumLessons, id] }
        ),
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
        completedCurriculumLessons: s.completedCurriculumLessons,
        xp: s.xp,
        lastActiveDate: s.lastActiveDate,
      }),
    }
  )
)

export default useStore
