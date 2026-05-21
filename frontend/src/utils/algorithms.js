/**
 * Pure step generators for algorithm visualization.
 * Each function returns an array of step objects consumed by useVisualizer.
 * No side effects — logic is completely isolated from UI.
 */

export function bubbleSortSteps(inputArr) {
  const steps = []
  const a = [...inputArr]
  const n = a.length

  steps.push({
    array: [...a],
    comparing: [],
    swapped: false,
    done: false,
    message_en: `Starting Bubble Sort on [${a.join(', ')}]`,
    message_ro: `Începem Bubble Sort pe [${a.join(', ')}]`,
  })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapped: false,
        done: false,
        message_en: `Comparing index ${j} (${a[j]}) and index ${j + 1} (${a[j + 1]})`,
        message_ro: `Se compară indexul ${j} (${a[j]}) cu indexul ${j + 1} (${a[j + 1]})`,
      })

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push({
          array: [...a],
          comparing: [j, j + 1],
          swapped: true,
          done: false,
          message_en: `Swapped! New order at positions ${j} and ${j + 1}: [${a[j]}, ${a[j + 1]}]`,
          message_ro: `Interschimbat! Noua ordine la pozițiile ${j} și ${j + 1}: [${a[j]}, ${a[j + 1]}]`,
        })
      }
    }
  }

  steps.push({
    array: [...a],
    comparing: [],
    swapped: false,
    done: true,
    message_en: `Sorting complete! Final array: [${a.join(', ')}]`,
    message_ro: `Sortare completă! Tabloul final: [${a.join(', ')}]`,
  })

  return steps
}

export function linearSearchSteps(inputArr, target) {
  const steps = []
  const a = [...inputArr]

  steps.push({
    array: [...a],
    current: -1,
    found: false,
    done: false,
    target,
    message_en: `Searching for ${target} in [${a.join(', ')}]`,
    message_ro: `Căutăm ${target} în [${a.join(', ')}]`,
  })

  for (let i = 0; i < a.length; i++) {
    if (a[i] === target) {
      steps.push({
        array: [...a],
        current: i,
        found: true,
        done: true,
        target,
        message_en: `Found ${target} at index ${i}!`,
        message_ro: `${target} găsit la indexul ${i}!`,
      })
      return steps
    }
    steps.push({
      array: [...a],
      current: i,
      found: false,
      done: false,
      target,
      message_en: `Checking index ${i}: value ${a[i]} ≠ ${target}, continue...`,
      message_ro: `Se verifică indexul ${i}: valoarea ${a[i]} ≠ ${target}, continuăm...`,
    })
  }

  steps.push({
    array: [...a],
    current: -1,
    found: false,
    done: true,
    target,
    message_en: `${target} not found in the array.`,
    message_ro: `${target} nu a fost găsit în tablou.`,
  })

  return steps
}

export function binarySearchSteps(inputArr, target) {
  const steps = []
  const sorted = [...inputArr].sort((a, b) => a - b)
  let low = 0
  let high = sorted.length - 1

  steps.push({
    array: [...sorted],
    low,
    high,
    mid: -1,
    found: false,
    done: false,
    target,
    message_en: `Array sorted: [${sorted.join(', ')}]. Searching for ${target}...`,
    message_ro: `Tablou sortat: [${sorted.join(', ')}]. Căutăm ${target}...`,
  })

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    steps.push({
      array: [...sorted],
      low,
      high,
      mid,
      found: false,
      done: false,
      target,
      message_en: `Range [${low}..${high}]. Checking middle index ${mid}: value ${sorted[mid]}`,
      message_ro: `Interval [${low}..${high}]. Se verifică mijlocul ${mid}: valoarea ${sorted[mid]}`,
    })

    if (sorted[mid] === target) {
      steps.push({
        array: [...sorted],
        low,
        high,
        mid,
        found: true,
        done: true,
        target,
        message_en: `Found ${target} at index ${mid}!`,
        message_ro: `${target} găsit la indexul ${mid}!`,
      })
      return steps
    } else if (sorted[mid] < target) {
      low = mid + 1
      steps.push({
        array: [...sorted],
        low,
        high,
        mid,
        found: false,
        done: false,
        target,
        message_en: `${sorted[mid]} < ${target} → search right half [${low}..${high}]`,
        message_ro: `${sorted[mid]} < ${target} → căutăm în jumătatea dreaptă [${low}..${high}]`,
      })
    } else {
      high = mid - 1
      steps.push({
        array: [...sorted],
        low,
        high,
        mid,
        found: false,
        done: false,
        target,
        message_en: `${sorted[mid]} > ${target} → search left half [${low}..${high}]`,
        message_ro: `${sorted[mid]} > ${target} → căutăm în jumătatea stângă [${low}..${high}]`,
      })
    }
  }

  steps.push({
    array: [...sorted],
    low: -1,
    high: -1,
    mid: -1,
    found: false,
    done: true,
    target,
    message_en: `${target} not found in the array.`,
    message_ro: `${target} nu a fost găsit în tablou.`,
  })

  return steps
}
