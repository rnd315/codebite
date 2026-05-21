export const KERNEL_QUIZ = [{
  id: 'kernel-q1',
  question_en: 'Which operator is used to send data to the screen in C++?',
  question_ro: 'Ce operator este folosit pentru a trimite date pe ecran în C++?',
  options_json: JSON.stringify([
    { en: '>>', ro: '>>' },
    { en: '<<', ro: '<<' },
    { en: '::', ro: '::' },
  ]),
  correct_index: 1,
  explanation_en: 'The << insertion operator pushes data into the cout output stream.',
  explanation_ro: 'Operatorul de inserare << trimite date în fluxul de ieșire cout.',
}]

export const LESSON_QUIZ_FALLBACK = {

  'loops-conditionals': [{
    id: 'mock-loops-q1',
    question_en: 'Which part of a for loop executes after every iteration?',
    question_ro: 'Care parte a unui for se execută după fiecare iterație?',
    options_json: JSON.stringify([
      { en: 'Initialization',   ro: 'Inițializare' },
      { en: 'Condition',        ro: 'Condiție' },
      { en: 'Increment/Update', ro: 'Increment/Actualizare' },
    ]),
    correct_index: 2,
    explanation_en: 'The increment/update runs at the end of each iteration, advancing the loop variable.',
    explanation_ro: 'Incrementul/actualizarea rulează la sfârșitul fiecărei iterații, avansând variabila de buclă.',
  }],

  'arrays-intro': [{
    id: 'mock-arrays-q1',
    question_en: 'What index does the first element of an array have in C++?',
    question_ro: 'Ce indice are primul element al unui vector în C++?',
    options_json: JSON.stringify([
      { en: '0',  ro: '0' },
      { en: '1',  ro: '1' },
      { en: '-1', ro: '-1' },
    ]),
    correct_index: 0,
    explanation_en: 'C++ arrays are zero-indexed — the first element is always at index 0.',
    explanation_ro: 'Vectorii C++ sunt indexați de la zero — primul element se află la indexul 0.',
  }],

  'bubble-sort': [{
    id: 'mock-bubble-q1',
    question_en: 'What is the worst-case time complexity of Bubble Sort?',
    question_ro: 'Care este complexitatea timp în cazul cel mai rău pentru Bubble Sort?',
    options_json: JSON.stringify([
      { en: 'O(n)',       ro: 'O(n)' },
      { en: 'O(n log n)', ro: 'O(n log n)' },
      { en: 'O(n²)',      ro: 'O(n²)' },
    ]),
    correct_index: 2,
    explanation_en: 'Bubble Sort compares every pair in the worst case, giving O(n²) time complexity.',
    explanation_ro: 'Bubble Sort compară fiecare pereche în cel mai rău caz, rezultând complexitatea O(n²).',
  }],

  'linear-search': [{
    id: 'mock-linear-q1',
    question_en: 'What is the worst-case time complexity of Linear Search?',
    question_ro: 'Care este complexitatea timp în cazul cel mai rău pentru Căutarea Liniară?',
    options_json: JSON.stringify([
      { en: 'O(1)',  ro: 'O(1)' },
      { en: 'O(n)',  ro: 'O(n)' },
      { en: 'O(n²)', ro: 'O(n²)' },
    ]),
    correct_index: 1,
    explanation_en: 'Linear Search checks every element in the worst case, giving O(n) time complexity.',
    explanation_ro: 'Căutarea Liniară verifică fiecare element în cel mai rău caz, rezultând complexitatea O(n).',
  }],

  'binary-search': [{
    id: 'mock-binary-q1',
    question_en: 'What is required for Binary Search to work correctly?',
    question_ro: 'Ce este necesar pentru ca Căutarea Binară să funcționeze corect?',
    options_json: JSON.stringify([
      { en: 'The array must be sorted',            ro: 'Vectorul trebuie să fie sortat' },
      { en: 'The array must have an odd length',   ro: 'Vectorul trebuie să aibă lungime impară' },
      { en: 'The array must contain only integers', ro: 'Vectorul trebuie să conțină doar întregi' },
    ]),
    correct_index: 0,
    explanation_en: 'Binary Search halves the search space each step — it only works on a sorted array.',
    explanation_ro: 'Căutarea Binară înjumătățește spațiul de căutare la fiecare pas — funcționează doar pe un vector sortat.',
  }],

}

export const LESSON_FLOWS = {
  'variables-basics': [
    { type: 'story',       textKey: 'mission.kernel.story0' },
    { type: 'interactive', missionKey: 'kernel' },
    { type: 'story',       textKey: 'mission.kernel.story2' },
    { type: 'quiz',        questions: KERNEL_QUIZ },
  ],
}
