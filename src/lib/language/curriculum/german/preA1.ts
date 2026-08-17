import { LanguageLesson, FinalMission } from '../../languageTypes';

export const PRE_A1_GERMAN_LESSONS: LanguageLesson[] = [
  {
    id: 'de-prea1-vocab-1',
    languageCode: 'de',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'Begrüßung und Universität Wortschatz',
    description: 'Lerne grundlegende deutsche Begrüßungen und Universität-Vokabeln.',
    estimatedMinutes: 5,
    xpReward: 30,
    vocabularyItems: [
      { id: 'de-v1', word: 'Hallo', translation: 'Hello', phonetic: '/ˈhaalo/', exampleSentence: 'Hallo, ich heiße Lukas.', exampleTranslation: 'Hello, my name is Lukas.', category: 'Begrüßung', quizQuestion: { prompt: 'Was ist die Standardbegrüßung auf Deutsch?', options: ['Tschüss', 'Hallo', 'Gute Nacht', 'Danke'], correctIndex: 1 } },
      { id: 'de-v2', word: 'Student', translation: 'Student (male)', phonetic: '/ʃtuˈdɛnt/', exampleSentence: 'Ich bin Informatik-Student.', exampleTranslation: 'I am a computer science student.', category: 'Universität', quizQuestion: { prompt: 'Welches Wort beschreibt eine Person an der Universität?', options: ['Lehrer', 'Student', 'Arzt', 'Pilot'], correctIndex: 1 } },
      { id: 'de-v3', word: 'Professor', translation: 'Professor / Teacher', phonetic: '/pʁoˈfɛsoːɐ̯/', exampleSentence: 'Der Professor erklärt die Aufgabe.', exampleTranslation: 'The professor explains the task.', category: 'Universität', quizQuestion: { prompt: 'Wer unterrichtet an der Universität?', options: ['Student', 'Professor', 'Koch', 'Fahrer'], correctIndex: 1 } },
      { id: 'de-v4', word: 'Bibliothek', translation: 'Library', phonetic: '/biblioˈteːk/', exampleSentence: 'Ich lerne in der Bibliothek.', exampleTranslation: 'I study in the library.', category: 'Universität', quizQuestion: { prompt: 'Wo liest man Bücher in Ruhe?', options: ['Im Stadion', 'In der Bibliothek', 'Im Kino', 'Auf dem Markt'], correctIndex: 1 } },
      { id: 'de-v5', word: 'Computer', translation: 'Computer', phonetic: '/kɔmˈpjuːtɐ/', exampleSentence: 'Ich programmiere am Computer.', exampleTranslation: 'I program on the computer.', category: 'Technologie', quizQuestion: { prompt: 'Welches Gerät nutzt man zum Programmieren?', options: ['Computer', 'Tisch', 'Stuhl', 'Stift'], correctIndex: 0 } },
      { id: 'de-v6', word: 'Danke', translation: 'Thank you', phonetic: '/ˈdaŋkə/', exampleSentence: 'Vielen Dank für Ihre Hilfe.', exampleTranslation: 'Thank you very much for your help.', category: 'Höflichkeit', quizQuestion: { prompt: 'Wie drückt man Dankbarkeit auf Deutsch aus?', options: ['Danke', 'Bitte', 'Ja', 'Nein'], correctIndex: 0 } },
      { id: 'de-v7', word: 'Bitte', translation: 'Please / You are welcome', phonetic: '/ˈbɪtə/', exampleSentence: 'Ein Kaffee, bitte.', exampleTranslation: 'A coffee, please.', category: 'Höflichkeit', quizQuestion: { prompt: 'Welches Höflichkeitswort nutzt man bei einer Bitte?', options: ['Bitte', 'Tschüss', 'Nie', 'Morgen'], correctIndex: 0 } },
      { id: 'de-v8', word: 'Ja', translation: 'Yes', phonetic: '/jaː/', exampleSentence: 'Ja, ich verstehe den Text.', exampleTranslation: 'Yes, I understand the text.', category: 'Grundlagen', quizQuestion: { prompt: 'Wie sagt man "Yes" auf Deutsch?', options: ['Nein', 'Ja', 'Vielleicht', 'Nie'], correctIndex: 1 } },
      { id: 'de-v9', word: 'Nein', translation: 'No', phonetic: '/naɪ̯n/', exampleSentence: 'Nein, ich habe keine Frage.', exampleTranslation: 'No, I have no question.', category: 'Grundlagen', quizQuestion: { prompt: 'Wie sagt man "No" auf Deutsch?', options: ['Ja', 'Nein', 'Gut', 'Danke'], correctIndex: 1 } },
      { id: 'de-v10', word: 'Tschüss', translation: 'Goodbye', phonetic: '/tʃʏs/', exampleSentence: 'Tschüss und bis morgen!', exampleTranslation: 'Goodbye and see you tomorrow!', category: 'Begrüßung', quizQuestion: { prompt: 'Wie verabschiedet man sich informell?', options: ['Hallo', 'Tschüss', 'Bitte', 'Danke'], correctIndex: 1 } }
    ]
  },
  {
    id: 'de-prea1-gram-1',
    languageCode: 'de',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'Die Verben Sein und Haben im Präsens & Der/Die/Das Grundlagen',
    description: 'Lerne die Konjugation von "sein" und "haben" sowie die drei deutschen Artikel.',
    estimatedMinutes: 6,
    xpReward: 30,
    grammarTopic: {
      id: 'g-de-1',
      title: 'Konjugation von Sein, Haben und Nomen-Genus',
      ruleExplanation: 'Auf Deutsch: "Ich bin Student" (Sein), "Ich habe einen Computer" (Haben). Jedes Nomen hat ein Genus: maskulin (der), feminin (die), neutral (das).',
      patternExamples: ['Ich bin Student.', 'Der Computer ist neu.', 'Wir haben ein Projekt.'],
      practiceQuestions: [
        { id: 'de-q1', prompt: 'Ergänze den Satz:', sentenceWithBlank: 'Ich ___ Informatik-Student an der PinIT Universität.', options: ['bin', 'ist', 'sind', 'habe'], correctIndex: 0, explanation: 'Nutze "bin" für das Personalpronomen "Ich" beim Verb sein.' },
        { id: 'de-q2', prompt: 'Ergänze den Satz:', sentenceWithBlank: '___ Computer ist sehr schnell.', options: ['Der', 'Die', 'Das', 'Einem'], correctIndex: 0, explanation: 'Computer ist maskulin (der Computer).' }
      ]
    }
  },
  {
    id: 'de-prea1-list-1',
    languageCode: 'de',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'Hörverstehen: Orientierung am TU München Campus',
    description: 'Höre die Willkommensnachricht auf Deutsch.',
    estimatedMinutes: 5,
    xpReward: 30,
    listeningExercise: {
      id: 'l-de-1',
      title: 'Willkommen von Anna',
      narrationScript: 'Hallo und willkommen bei PinIT. Ich bin Anna. Heute besuchen wir das Informatik-Labor und die Bibliothek.',
      speakerVoice: 'de-DE',
      questions: [
        { id: 'de-lq1', prompt: 'Wer spricht im Audio?', options: ['Lukas', 'Anna', 'Priya', 'Markus'], correctIndex: 1 },
        { id: 'de-lq2', prompt: 'Welche Orte werden heute besucht?', options: ['Die Sporthalle', 'Das Informatik-Labor und die Bibliothek', 'Das Restaurant', 'Der Bahnhof'], correctIndex: 1 }
      ]
    }
  },
  {
    id: 'de-prea1-spk-1',
    languageCode: 'de',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'Sprechübung: Sich auf Deutsch vorstellen',
    description: 'Stelle dich höflich auf Deutsch vor.',
    estimatedMinutes: 5,
    xpReward: 40,
    speakingExercise: {
      id: 's-de-1',
      title: 'Selbstvorstellung',
      promptQuestion: 'Stelle dich vor: Nenne deinen Namen, deine Rolle und dein Studienfach.',
      sampleResponse: 'Hallo! Ich heiße Lukas. Ich bin Student und lerne Informatik.',
      keywordsExpected: ['hallo', 'heiße', 'student', 'informatik'],
      minWordCount: 5
    }
  }
];

export const PRE_A1_GERMAN_MISSION: FinalMission = {
  id: 'de-prea1-mission',
  languageCode: 'de',
  level: 'PRE_A1',
  title: 'Abschlussmission: Vorstellungsgespräch bei Anna am Empfang',
  scenarioDescription: 'Meistere dein erstes Gespräch auf Deutsch am Universitäts-Empfang.',
  requiredLessons: ['de-prea1-vocab-1', 'de-prea1-gram-1', 'de-prea1-list-1', 'de-prea1-spk-1'],
  missionPrompt: 'Hallo! Willkommen am Campus. Wie heißt du und was studierst du hier?',
  keywordsTarget: ['hallo', 'heiße', 'student', 'studiere', 'danke'],
  passingScorePct: 70
};
