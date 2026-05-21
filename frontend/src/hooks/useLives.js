import client from '../api/client'
import useStore from '../store/useStore'

export default function useLives() {
  const { setLives, setXp } = useStore()

  const submitQuizAnswer = async (lessonId, questionId, selectedIndex) => {
    try {
      const { data } = await client.post(`/progress/${lessonId}/quiz`, {
        question_id: questionId,
        selected_index: selectedIndex,
      })
      setLives(data.lives_remaining)
      setXp(data.xp)
      return data
    } catch {
      return null
    }
  }

  return { submitQuizAnswer }
}
