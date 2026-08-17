import { LanguageLesson, FinalMission } from '../../languageTypes';

export const PRE_A1_SPANISH_LESSONS: LanguageLesson[] = [
  {
    id: 'es-prea1-vocab-1',
    languageCode: 'es',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'Saludos y Presentaciones en la Universidad',
    description: 'Aprende los saludos esenciales y vocabulario universitario en español.',
    estimatedMinutes: 5,
    xpReward: 30,
    vocabularyItems: [
      { id: 'es-v1', word: 'Hola', translation: 'Hello', phonetic: '/ˈola/', exampleSentence: 'Hola, me llamo Carlos.', exampleTranslation: 'Hello, my name is Carlos.', category: 'Saludos', quizQuestion: { prompt: '¿Cuál es el saludo estándar en español?', options: ['Adiós', 'Hola', 'Buenas noches', 'Gracias'], correctIndex: 1 } },
      { id: 'es-v2', word: 'Estudiante', translation: 'Student', phonetic: '/estudˈjante/', exampleSentence: 'Soy estudiante de ingeniería.', exampleTranslation: 'I am an engineering student.', category: 'Universidad', quizQuestion: { prompt: '¿Qué palabra define a una persona que cursa estudios en la universidad?', options: ['Profesor', 'Estudiante', 'Doctor', 'Piloto'], correctIndex: 1 } },
      { id: 'es-v3', word: 'Profesor', translation: 'Teacher / Professor', phonetic: '/pɾofeˈsoɾ/', exampleSentence: 'El profesor explica el código.', exampleTranslation: 'The teacher explains the code.', category: 'Universidad', quizQuestion: { prompt: '¿Quién enseña la clase en la universidad?', options: ['Estudiante', 'Profesor', 'Cocinero', 'Chofer'], correctIndex: 1 } },
      { id: 'es-v4', word: 'Biblioteca', translation: 'Library', phonetic: '/biβljoˈteka/', exampleSentence: 'Estudio en la biblioteca central.', exampleTranslation: 'I study in the central library.', category: 'Universidad', quizQuestion: { prompt: '¿Dónde se pueden leer libros en silencio?', options: ['En el estadio', 'En la biblioteca', 'En el cine', 'En el mercado'], correctIndex: 1 } },
      { id: 'es-v5', word: 'Computadora', translation: 'Computer', phonetic: '/komputaˈðoɾa/', exampleSentence: 'Escribo código en mi computadora.', exampleTranslation: 'I write code on my computer.', category: 'Tecnología', quizQuestion: { prompt: '¿Qué dispositivo se usa para programar?', options: ['Computadora', 'Mesa', 'Silla', 'Pluma'], correctIndex: 0 } },
      { id: 'es-v6', word: 'Gracias', translation: 'Thank you', phonetic: '/ˈɡɾasjas/', exampleSentence: 'Muchas gracias por tu ayuda.', exampleTranslation: 'Thank you very much for your help.', category: 'Cortesía', quizQuestion: { prompt: '¿Cómo se expresa agradecimiento en español?', options: ['Gracias', 'Perdón', 'Sí', 'No'], correctIndex: 0 } },
      { id: 'es-v7', word: 'Por favor', translation: 'Please', phonetic: '/poɾ faˈβoɾ/', exampleSentence: 'Un café, por favor.', exampleTranslation: 'A coffee, please.', category: 'Cortesía', quizQuestion: { prompt: '¿Qué frase de cortesía se usa al pedir algo?', options: ['Por favor', 'Adiós', 'Nunca', 'Mañana'], correctIndex: 0 } },
      { id: 'es-v8', word: 'Sí', translation: 'Yes', phonetic: '/si/', exampleSentence: 'Sí, entiendo la lección.', exampleTranslation: 'Yes, I understand the lesson.', category: 'Básicos', quizQuestion: { prompt: '¿Cómo se dice "Yes" en español?', options: ['No', 'Sí', 'Tal vez', 'Nunca'], correctIndex: 1 } },
      { id: 'es-v9', word: 'No', translation: 'No', phonetic: '/no/', exampleSentence: 'No, no tengo preguntas.', exampleTranslation: 'No, I have no questions.', category: 'Básicos', quizQuestion: { prompt: '¿Cómo se dice "No" en español?', options: ['Sí', 'No', 'Bien', 'Gracias'], correctIndex: 1 } },
      { id: 'es-v10', word: 'Adiós', translation: 'Goodbye', phonetic: '/aˈðjos/', exampleSentence: 'Adiós y hasta mañana.', exampleTranslation: 'Goodbye and see you tomorrow.', category: 'Saludos', quizQuestion: { prompt: '¿Qué palabra se usa para despedirse?', options: ['Hola', 'Adiós', 'Perdón', 'Gracias'], correctIndex: 1 } }
    ]
  },
  {
    id: 'es-prea1-gram-1',
    languageCode: 'es',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'Diferencia Esencial: Ser vs Estar y el Verbo Tener',
    description: 'Comprende el uso correcto de "Ser" (identidad) y "Estar" (ubicación/estado).',
    estimatedMinutes: 6,
    xpReward: 30,
    grammarTopic: {
      id: 'g-es-1',
      title: 'Uso de Ser, Estar y Tener',
      ruleExplanation: 'En español: "Soy estudiante" (identidad permanente con SER), "Estoy en la biblioteca" (ubicación con ESTAR), "Tengo un proyecto" (posesión con TENER).',
      patternExamples: ['Yo soy estudiante.', 'Ella está en el campus.', 'Tenemos un examen.'],
      practiceQuestions: [
        { id: 'es-q1', prompt: 'Completa la oración:', sentenceWithBlank: 'Yo ___ estudiante de sistemas.', options: ['soy', 'estoy', 'tengo', 'son'], correctIndex: 0, explanation: 'Usa "soy" (verbo Ser) para definir tu profesión o rol de estudiante.' },
        { id: 'es-q2', prompt: 'Completa la oración:', sentenceWithBlank: 'Ella ___ en la biblioteca universitaria.', options: ['es', 'está', 'tiene', 'somos'], correctIndex: 1, explanation: 'Usa "está" (verbo Estar) para señalar una ubicación física.' }
      ]
    }
  },
  {
    id: 'es-prea1-list-1',
    languageCode: 'es',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'Escucha: Bienvenida al Campus Tecnológico de Madrid',
    description: 'Escucha el mensaje de bienvenida en español.',
    estimatedMinutes: 5,
    xpReward: 30,
    listeningExercise: {
      id: 'l-es-1',
      title: 'Bienvenida de Lucia',
      narrationScript: 'Hola y bienvenidos a PinIT. Soy Lucía. Hoy visitaremos el laboratorio de informática y la biblioteca universitaria.',
      speakerVoice: 'es-ES',
      questions: [
        { id: 'es-lq1', prompt: '¿Quién habla en el audio?', options: ['Carlos', 'Lucía', 'Priya', 'Mateo'], correctIndex: 1 },
        { id: 'es-lq2', prompt: '¿Qué lugares se visitan hoy?', options: ['El gimnasio', 'El laboratorio de informática y la biblioteca', 'El restaurante', 'El aeropuerto'], correctIndex: 1 }
      ]
    }
  },
  {
    id: 'es-prea1-spk-1',
    languageCode: 'es',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'Práctica Oral: Presentación Personal en Español',
    description: 'Preséntate con cortesía en español.',
    estimatedMinutes: 5,
    xpReward: 40,
    speakingExercise: {
      id: 's-es-1',
      title: 'Ejercicio de Presentación',
      promptQuestion: 'Preséntate diciendo tu nombre, tu profesión o carrera y tu entusiasmo por aprender.',
      sampleResponse: '¡Hola! Me llamo Carlos. Soy estudiante de ingeniería y me gusta programar.',
      keywordsExpected: ['hola', 'llamo', 'estudiante', 'programar'],
      minWordCount: 5
    }
  }
];

export const PRE_A1_SPANISH_MISSION: FinalMission = {
  id: 'es-prea1-mission',
  languageCode: 'es',
  level: 'PRE_A1',
  title: 'Misión Final: Presentarte ante Lucía en Recepción',
  scenarioDescription: 'Completa tu primera conversación en español en el mostrador de bienvenida universitaria.',
  requiredLessons: ['es-prea1-vocab-1', 'es-prea1-gram-1', 'es-prea1-list-1', 'es-prea1-spk-1'],
  missionPrompt: '¡Hola! Bienvenida al campus. Dime tu nombre, qué carrera estudias y de dónde eres.',
  keywordsTarget: ['hola', 'llamo', 'estudiante', 'estudio', 'gracias'],
  passingScorePct: 70
};
