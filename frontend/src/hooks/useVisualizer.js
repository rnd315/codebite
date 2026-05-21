import { useState, useEffect, useRef, useCallback } from 'react'
import { bubbleSortSteps, linearSearchSteps, binarySearchSteps } from '../utils/algorithms'

const DEFAULT_ARRAY = [5, 3, 8, 1, 9, 2, 7, 4, 6]
const SPEED_MAP = { 1: 1200, 2: 700, 3: 400, 4: 200, 5: 80 }

function generateSteps(algorithmName, array, target) {
  switch (algorithmName) {
    case 'bubble-sort':
      return bubbleSortSteps(array)
    case 'linear-search':
      return linearSearchSteps(array, target ?? 7)
    case 'binary-search':
      return binarySearchSteps(array, target ?? 7)
    default:
      return []
  }
}

export default function useVisualizer(algorithmName) {
  const [array, setArray] = useState(DEFAULT_ARRAY)
  const [target, setTarget] = useState(7)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const intervalRef = useRef(null)

  const buildSteps = useCallback(() => {
    const s = generateSteps(algorithmName, array, target)
    setSteps(s)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [algorithmName, array, target])

  useEffect(() => {
    buildSteps()
  }, [buildSteps])

  // Autoplay interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, SPEED_MAP[speed] ?? 400)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, steps.length])

  const play = () => {
    if (currentStep >= steps.length - 1) reset()
    setIsPlaying(true)
  }
  const pause = () => setIsPlaying(false)
  const stepForward = () => {
    setIsPlaying(false)
    setCurrentStep((p) => Math.min(p + 1, steps.length - 1))
  }
  const stepBack = () => {
    setIsPlaying(false)
    setCurrentStep((p) => Math.max(p - 1, 0))
  }
  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const setCustomArray = (newArr) => {
    setArray(newArr)
  }

  const setSearchTarget = (val) => {
    setTarget(val)
  }

  const step = steps[currentStep] ?? null

  return {
    step,
    steps,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    array,
    target,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    setCustomArray,
    setSearchTarget,
  }
}
